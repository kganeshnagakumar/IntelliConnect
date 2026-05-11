from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from django.test import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import Mock, patch
from .models import Meeting, Task

class DashboardTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )
        self.meeting = Meeting.objects.create(
            meeting_id="M123",
            title="Test Meeting",
            priority="High"
        )
        Task.objects.create(
            meeting=self.meeting,
            employee_name="Test Employee",
            description="Test Task",
            status="pending"
        )

    def test_dashboard_stats_endpoint(self):
        # Even if authentication isn't strictly required by the current AllowAny setup,
        # it's good practice for production-ready tests.
        response = self.client.get("/api/meetings/dashboard_stats/")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_meetings'], 1)
        self.assertEqual(response.data['pending_tasks'], 1)
        self.assertEqual(response.data['completed_tasks'], 0)
        self.assertEqual(response.data['priority_stats']['High'], 1)


class MeetingProcessingTests(APITestCase):
    @patch("meetings.views.process_meeting_task.delay")
    def test_process_meeting_enqueues_job_and_returns_202(self, mock_delay):
        mock_delay.return_value = Mock(id="job-123")
        upload = SimpleUploadedFile("meeting.txt", b"Meeting transcript")

        response = self.client.post(
            "/api/meetings/process_meeting/",
            {"file": upload, "category": "General", "settings": "{}"},
            format="multipart",
        )

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.data["job_id"], "job-123")
        self.assertTrue(mock_delay.called)

    @patch("meetings.views.AsyncResult")
    def test_process_status_returns_pending_state(self, mock_async_result):
        mock_async_result.return_value = Mock(state="PENDING", info=None)

        response = self.client.get("/api/meetings/process_status/", {"job_id": "job-123"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["job_id"], "job-123")
        self.assertEqual(response.data["state"], "PENDING")

    @patch("meetings.views.AsyncResult")
    def test_process_status_returns_success_payload(self, mock_async_result):
        mock_async_result.return_value = Mock(
            state="SUCCESS",
            info=None,
            result={"meeting_id": "M100", "summary": "Done"},
        )

        response = self.client.get("/api/meetings/process_status/", {"job_id": "job-456"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["state"], "SUCCESS")
        self.assertEqual(response.data["result"]["meeting_id"], "M100")

    @override_settings(
        CELERY_TASK_ALWAYS_EAGER=True,
        CELERY_TASK_EAGER_PROPAGATES=True,
        CELERY_TASK_STORE_EAGER_RESULT=True,
        CELERY_BROKER_URL="memory://",
        CELERY_RESULT_BACKEND="cache+memory://",
        GEMINI_API_KEY="test-api-key",
    )
    @patch("meetings.tasks.GeminiService.process_meeting_file")
    def test_process_meeting_task_executes_in_eager_mode(self, mock_process):
        mock_process.return_value = {
            "summary": "Summary",
            "tasks": [],
            "participants": [],
            "transcripts": [],
        }
        upload = SimpleUploadedFile("meeting.txt", b"Meeting transcript")

        response = self.client.post(
            "/api/meetings/process_meeting/",
            {"file": upload, "category": "General", "settings": "{}"},
            format="multipart",
        )

        self.assertEqual(response.status_code, 202)
        job_id = response.data["job_id"]

        status_response = self.client.get("/api/meetings/process_status/", {"job_id": job_id})
        self.assertEqual(status_response.status_code, 200)
        self.assertEqual(status_response.data["state"], "SUCCESS")
        self.assertIn("result", status_response.data)
