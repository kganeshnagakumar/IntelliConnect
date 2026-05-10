from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .google_token import GoogleTokenVerificationError, verify_google_token


class GoogleOAuth2Authentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = get_authorization_header(request).split()
        if not auth_header:
            return None

        if auth_header[0].lower() != b'bearer':
            return None

        if len(auth_header) != 2:
            raise AuthenticationFailed('Invalid Authorization header format.')

        token = auth_header[1].decode('utf-8')

        try:
            payload = verify_google_token(token)
        except GoogleTokenVerificationError as exc:
            raise AuthenticationFailed(str(exc)) from exc

        email = payload.get('email')
        if not email:
            raise AuthenticationFailed('Google token missing email claim.')

        user, _ = User.objects.get_or_create(email=email, defaults={'username': email})
        name = payload.get('name')
        if name and user.first_name != name:
            user.first_name = name
            user.save(update_fields=['first_name'])

        return (user, None)
