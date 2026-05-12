# Architecture Decisions

## 1. Modular App Structure
The project is divided into functional apps (`authentication`, `meetings`, `ai_processing`, `pdf_generator`, `notifications`, `storage`) to ensure scalability and ease of maintenance. This follows the separation of concerns principle.

## 2. Service Layer Pattern
Business logic is abstracted into a `services/` directory. This keeps models and views thin and allows for easy swapping of providers (e.g., changing from OpenAI to Claude, or SendGrid to another SMTP).

## 3. Asynchronous Processing (Celery + Redis)
Time-consuming tasks like audio transcription, AI summarization, PDF generation, and email delivery are handled asynchronously by Celery workers. This ensures the API remains responsive and handles large file processing gracefully.

## 4. Supabase Integration
- **PostgreSQL**: Used as the primary relational database.
- **OAuth (Google)**: Handled by Supabase on the frontend, with JWT verification on the backend via custom middleware.
- **Storage**: Used for storing raw uploads and generated PDF reports.

## 5. Security & Validation
- **JWT Verification**: Every request is authenticated using Supabase JWT tokens.
- **File Validation**: MIME type and extension checks are performed before processing.
- **Environment Secrets**: All sensitive data (API keys, DB credentials) is managed via `.env` files.

## 6. Processing Logs
Every stage of the pipeline (Transcription -> Analysis -> PDF Gen -> Email) is logged in the `ProcessingLog` table to provide visibility into the system's state and facilitate debugging.

## 7. Automated Mail Flow (Power Automate)
Email delivery and external routing (such as sending generated PDFs and task assignments) are supported by a dedicated Power Automate managed solution (`Mail_flow_1_0_0_1_managed`). This decoupled workflow approach allows robust delivery of notifications leveraging enterprise Microsoft 365 services, independent of the core Python backend.
