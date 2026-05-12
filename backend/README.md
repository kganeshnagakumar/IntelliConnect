# IntelliConnect Backend

Django REST Framework API with Celery async workers.

## Stack
- **Django 5** + Django REST Framework
- **PostgreSQL** (via Supabase)
- **Celery** + Redis (task queue)
- **Google Gemini** (AI transcription & analysis)
- **Supabase Storage** (file storage)

## Local Dev

```bash
cp .env.example .env
docker-compose up --build
```

API available at `http://localhost:8000`

## Key Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/meetings/` | Upload & trigger processing pipeline |
| `GET` | `/api/meetings/` | List user's meetings |
| `GET` | `/api/meetings/{id}/` | Get meeting with AI analysis |
| `PATCH` | `/api/meetings/{id}/save_analysis/` | Save edited analysis |
| `GET` | `/api/meetings/api-documents/` | List document vault artefacts |
| `GET` | `/api/auth/me` | Sync/fetch current user profile |

## Apps

| App | Responsibility |
|---|---|
| `meetings` | Core models: Meeting, UploadedFile, ProcessingLog, API sync tables |
| `ai_processing` | Gemini transcription, summarisation, diarisation |
| `authentication` | Supabase JWT middleware & user sync |
| `notifications` | EmailRecipient model, Celery email tasks |
| `pdf_generator` | Server-side PDF generation pipeline |
| `storage` | Supabase Storage wrappers |
