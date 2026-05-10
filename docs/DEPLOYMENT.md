# Deployment Guide

Intelliconnect requires two parallel deployments for the frontend (static hosting) and backend (Python application server).

## Environment Variables required

### Backend (`backend/.env`)
```env
DEBUG=False
SECRET_KEY=your_secure_django_key
DATABASE_URL=postgres://user:password@hostname:5432/dbname
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
EMAIL_HOST_USER=your_email_address
EMAIL_HOST_PASSWORD=your_email_password_or_app_password
```

### Frontend (`frontend/.env`)
```env
VITE_BACKEND_URL=https://your-backend-domain
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Build & Deployment Steps

### 1. Backend Deployment (e.g., Render, Heroku)
The backend is a standard WSGI application.
- **Command**: `gunicorn intelliconnect_backend.wsgi:application`
- **Pre-start**: Run `python manage.py migrate` and `python manage.py collectstatic`.
- Ensure `ALLOWED_HOSTS` in `settings.py` includes your production domain.

### 2. Frontend Deployment (e.g., Vercel, Netlify)
The frontend is built as a static SPA.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Routing Note**: Configure your static host to rewrite all requests to `index.html` to support React Router.
- Ensure the production API base URL is configured in the frontend Axios instance (currently relies on Vite Proxy, needs explicit baseUrl in production).
