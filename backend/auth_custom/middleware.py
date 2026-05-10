from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

from .google_token import GoogleTokenVerificationError, verify_google_token


class GoogleTokenAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ', 1)[1].strip()
        try:
            request.google_token_payload = verify_google_token(token)
        except GoogleTokenVerificationError as exc:
            return JsonResponse({'error': str(exc)}, status=401)
        return None
