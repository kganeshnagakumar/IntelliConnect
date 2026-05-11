# Deployment Guide

Intelliconnect requires two parallel deployments for the frontend (static hosting) and backend (Python application server).

## Environment Variables required

### Backend (`backend/.env`)
```env
DEBUG=False
SECRET_KEY=your_secure_django_key
DATABASE_URL=postgres://user:password@hostname:5432/dbname
GEMINI_API_KEY=your_gemini_api_key
CELERY_BROKER_URL=redis://hostname:6379/0
CELERY_RESULT_BACKEND=redis://hostname:6379/0
```

### Frontend (`frontend/.env`)
```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## Build & Deployment Steps

### 1. Backend Deployment (e.g., Render, Heroku)
The backend is a standard WSGI application.
- **Command**: `gunicorn intelliconnect_backend.wsgi:application`
- **Pre-start**: Run `python manage.py migrate` and `python manage.py collectstatic`.
- Ensure `ALLOWED_HOSTS` in `settings.py` includes your production domain.
- Run a separate Celery worker process:
  - **Worker Command**: `celery -A intelliconnect_backend worker --loglevel=info`
- Provision Redis (or compatible broker/backend) and set `CELERY_BROKER_URL` / `CELERY_RESULT_BACKEND`.

### 2. Frontend Deployment (e.g., Vercel, Netlify)
The frontend is built as a static SPA.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Routing Note**: Configure your static host to rewrite all requests to `index.html` to support React Router.
- Ensure the production API base URL is configured in the frontend Axios instance (currently relies on Vite Proxy, needs explicit baseUrl in production).
