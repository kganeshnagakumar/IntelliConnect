# API Documentation

## Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/save-user/` | Synchronizes user data from Google OAuth with the backend. Creates or updates the user record after token verification. | Bearer token |
| | | **Request**: `{ "token": "str", "email": "str", "name": "str", "avatar_url": "str" }` | |
| | | **Response**: `{ "message": "str", "is_new": bool, "user": {...} }` | |

## Meeting Core & Processing

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/meetings/` | Returns a paginated list of all saved meetings ordered by creation date. | No (AllowAny) |
| POST | `/api/meetings/process_meeting/` | Uploads a file (Audio/Video/VTT/TXT), sends it to Gemini API, and returns structured analysis (Tasks, Decisions, Summary). **Does NOT save to DB.** | No |
| | | **Request**: `multipart/form-data` with `file`, `category`, `settings` | |
| | | **Response**: JSON matching the `MeetingAnalysis` schema | |
| POST | `/api/meetings/save_analysis/` | Accepts the parsed analysis from the frontend and persists it into `Meeting`, `Task`, `Participant`, and `IntegratedIntelligence` tables. | No |
| | | **Request**: JSON containing full analysis (summary, tasks, transcripts, etc.) | |
| | | **Response**: Created `Meeting` record | |

## Analytics Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/meetings/dashboard_stats/` | Returns top-level aggregates: total meetings, total tasks, and priority counts. | No |
| GET | `/api/meetings/analytics_stats/` | Returns dynamic analytics: efficiency score, department distribution, and activity trends. | No |

## CRUD Endpoints

Standard ViewSet endpoints are available for standard CRUD operations:
- `/api/tasks/`
- `/api/participants/`
