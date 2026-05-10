from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import requests


class GoogleTokenVerificationError(Exception):
    pass


def _validate_issuer(payload):
    issuer = payload.get('iss')
    if issuer not in {'accounts.google.com', 'https://accounts.google.com'}:
        raise GoogleTokenVerificationError('Invalid Google token issuer.')


def verify_google_token(token: str) -> dict:
    if not token:
        raise GoogleTokenVerificationError('Google token is required.')

    client_id = settings.GOOGLE_CLIENT_ID
    if not client_id:
        raise GoogleTokenVerificationError('GOOGLE_CLIENT_ID is not configured.')

    try:
        payload = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            client_id,
        )
        _validate_issuer(payload)
        return payload
    except ValueError:
        try:
            response = requests.get(
                'https://oauth2.googleapis.com/tokeninfo',
                params={'access_token': token},
                timeout=5,
            )
            response.raise_for_status()
            payload = response.json()
        except requests.RequestException as exc:
            raise GoogleTokenVerificationError('Failed to verify Google token.') from exc

        audience = payload.get('aud')
        if audience != client_id:
            raise GoogleTokenVerificationError('Google token audience mismatch.')
        _validate_issuer(payload)
        return payload
