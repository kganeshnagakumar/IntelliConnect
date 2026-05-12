import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import UserProfile
import uuid
import logging

logger = logging.getLogger(__name__)


class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
                options={"verify_signature": False}
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
        except Exception as e:
            logger.error(f"JWT authentication error: {e}")
            raise exceptions.AuthenticationFailed(str(e))

        user_id = payload.get('sub')
        email = payload.get('email')
        user_metadata = payload.get('user_metadata', {})
        full_name = user_metadata.get('full_name', '')
        avatar_url = user_metadata.get('avatar_url', '')

        if not user_id:
            raise exceptions.AuthenticationFailed('Invalid payload')

        try:
            user = UserProfile.objects.get(email=email)
            # Update profile if user ID changed (Supabase project migration)
            if user.id != uuid.UUID(user_id):
                UserProfile.objects.filter(email=email).update(
                    id=uuid.UUID(user_id),
                    full_name=full_name,
                    profile_image=avatar_url
                )
                user.refresh_from_db()
            else:
                # Update profile metadata
                UserProfile.objects.filter(id=user.id).update(
                    full_name=full_name or user.full_name,
                    profile_image=avatar_url or user.profile_image
                )
        except UserProfile.DoesNotExist:
            user = UserProfile.objects.create(
                id=uuid.UUID(user_id),
                email=email,
                full_name=full_name,
                profile_image=avatar_url
            )

        return (user, None)

    def authenticate_header(self, request):
        return 'Bearer'
