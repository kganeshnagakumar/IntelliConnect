# Security & Authentication

## Authentication Flow

Intelliconnect implements a hybrid authentication strategy:
- **Provider**: Google OAuth 2.0 (`@react-oauth/google`)
- **Flow**: The frontend handles the user login prompt and receives the Google Token and Profile payload.
- **Backend Sync**: The frontend subsequently hits `POST /api/auth/save-user/` to synchronize the user profile (email, name) into the Django `User` model.

### ⚠️ Current Security Considerations

- **Token Validation**: Google OAuth tokens are verified server-side with `google.oauth2.id_token.verify_oauth2_token()` and invalid tokens are rejected.
- **Open Endpoints**: DRF `DEFAULT_PERMISSION_CLASSES` is set to `AllowAny` and `CORS_ALLOW_ALL_ORIGINS` is `True`. These must be heavily restricted for production to require Session/Token authentication and strict CORS origin checks.
- **Secrets Management**: Gemini/Supabase/Google OAuth/SMTP secrets are read from environment variables and validated at startup.

## API Security Standards

- Django's built-in `SecurityMiddleware`, `CsrfViewMiddleware`, and `XFrameOptionsMiddleware` are enabled.
- The `DATABASE_URL` and `SECRET_KEY` are successfully decoupled into environment variables via `django-environ`/`dj-database-url`.
