from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.authentication.models import UserProfile
from .models import Meeting, UploadedFile
import uuid

class MeetingAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserProfile.objects.create_user(
            email='test@example.com',
            full_name='Test User',
            id=uuid.uuid4()
        )
        self.client.force_authenticate(user=self.user)

    def test_create_meeting(self):
        url = reverse('meetings-list')
        data = {'title': 'Test Meeting', 'description': 'Test Description'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Meeting.objects.count(), 1)
        self.assertEqual(Meeting.objects.get().title, 'Test Meeting')

    def test_get_meetings(self):
        Meeting.objects.create(title='Meeting 1', owner=self.user)
        Meeting.objects.create(title='Meeting 2', owner=self.user)
        
        url = reverse('meetings-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_upload_invalid_file_type(self):
        meeting = Meeting.objects.create(title='Upload Test', owner=self.user)
        url = reverse('meetings-upload', kwargs={'pk': meeting.id})
        
        from django.core.files.uploadedfile import SimpleUploadedFile
        invalid_file = SimpleUploadedFile("test.exe", b"fake content", content_type="application/x-msdownload")
        
        response = self.client.post(url, {'file': invalid_file}, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Unsupported file type', response.data['error'])
