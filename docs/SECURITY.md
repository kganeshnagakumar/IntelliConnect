# Security & Authentication

## Authentication Flow

Intelliconnect implements a hybrid authentication strategy:
- **Provider**: Google OAuth 2.0 (`@react-oauth/google`)
- **Flow**: The frontend handles the user login prompt and receives the Google Token and Profile payload.
- **Backend Sync**: The frontend subsequently hits `POST /api/auth/save_user/` to synchronize the user profile (email, name) into the Django `User` model.

### ⚠️ Current Security Considerations

- **Verification Deficit**: Currently, the `/api/auth/save_user/` endpoint does not cryptographically verify the Google token payload. In a production environment, this endpoint must decode and verify the JWT signature against Google's public keys.
- **Open Endpoints**: DRF `DEFAULT_PERMISSION_CLASSES` is set to `AllowAny` and `CORS_ALLOW_ALL_ORIGINS` is `True`. These must be heavily restricted for production to require Session/Token authentication and strict CORS origin checks.
- **API Keys**: The `AIzaSy...` Google GenAI key is currently hardcoded in `backend/meetings/views.py`. **This must be rotated immediately** and moved to the `.env` file using `os.getenv()`.

## API Security Standards

- Django's built-in `SecurityMiddleware`, `CsrfViewMiddleware`, and `XFrameOptionsMiddleware` are enabled.
- The `DATABASE_URL` and `SECRET_KEY` are successfully decoupled into environment variables via `django-environ`/`dj-database-url`.