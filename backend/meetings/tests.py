from rest_framework.test import APITestCase
from django.contrib.auth.models import User
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
