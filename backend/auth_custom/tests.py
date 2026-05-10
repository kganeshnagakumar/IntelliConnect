from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from auth_custom.google_token import GoogleTokenVerificationError


class SaveUserAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/api/auth/save-user/'

    @patch('auth_custom.views.verify_google_token')
    def test_save_user_accepts_valid_google_token(self, mock_verify):
        mock_verify.return_value = {
            'email': 'alice@example.com',
            'name': 'Alice',
            'iss': 'accounts.google.com',
        }

        response = self.client.post(
            self.url,
            {'token': 'valid-token'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['email'], 'alice@example.com')
        self.assertTrue(User.objects.filter(email='alice@example.com').exists())

    @patch('auth_custom.views.verify_google_token')
    def test_save_user_rejects_invalid_google_token(self, mock_verify):
        mock_verify.side_effect = GoogleTokenVerificationError('Invalid Google token.')

        response = self.client.post(
            self.url,
            {'token': 'invalid-token'},
            format='json',
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data['error'], 'Invalid Google token.')

    @patch('auth_custom.views.verify_google_token')
    def test_save_user_rejects_email_mismatch(self, mock_verify):
        mock_verify.return_value = {
            'email': 'verified@example.com',
            'name': 'Verified User',
            'iss': 'accounts.google.com',
        }

        response = self.client.post(
            self.url,
            {'token': 'valid-token', 'email': 'different@example.com'},
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Token email does not match request email.')

    @patch('auth_custom.views.verify_google_token')
    @patch('auth_custom.middleware.verify_google_token')
    def test_middleware_rejects_invalid_token_before_view(self, mock_middleware_verify, mock_view_verify):
        mock_middleware_verify.side_effect = GoogleTokenVerificationError('Invalid Google token.')

        response = self.client.post(
            self.url,
            {'token': 'invalid-token'},
            format='json',
            HTTP_AUTHORIZATION='Bearer invalid-token',
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'Invalid Google token.')
        mock_view_verify.assert_not_called()
