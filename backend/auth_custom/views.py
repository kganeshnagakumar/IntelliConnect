from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

from .google_token import GoogleTokenVerificationError, verify_google_token

@api_view(['POST'])
@permission_classes([AllowAny])
def save_user(request):
    """
    Saves or updates user info after successful Google login.
    In a production app, we would verify the token here using the client_secret.
    """
    token = request.data.get('token')
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1].strip()

    payload = getattr(request, 'google_token_payload', None)

    try:
        if payload is None:
            payload = verify_google_token(token)
    except GoogleTokenVerificationError:
        return Response({'error': 'Invalid Google token.'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception:
        return Response({'error': 'Token verification failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    token_email = payload.get('email')
    if not token_email:
        return Response({'error': 'Google token missing email claim.'}, status=status.HTTP_401_UNAUTHORIZED)

    requested_email = request.data.get('email')
    if requested_email and requested_email != token_email:
        return Response({'error': 'Token email does not match request email.'}, status=status.HTTP_400_BAD_REQUEST)

    user_name = request.data.get('name') or payload.get('name') or ''
    user, created = User.objects.get_or_create(email=token_email, defaults={'username': token_email})

    if created or user.first_name != user_name:
        user.first_name = user_name
        user.save(update_fields=['first_name'])

    return Response(
        {
            'message': 'User synced successfully',
            'is_new': created,
            'user': {
                'email': user.email,
                'name': user.first_name,
            },
        },
        status=status.HTTP_200_OK,
    )
