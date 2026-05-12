# Database Relationship Documentation

## Core Entities

### 1. UserProfile (authentication.UserProfile)
- Extended from `AbstractBaseUser`.
- Primary Key: `id` (UUID from Supabase).
- Relationships:
  - `One-to-Many` with `Meeting`.

### 2. Meeting (meetings.Meeting)
- Central entity for all platform actions.
- Relationships:
  - `One-to-One` with `UploadedFile`.
  - `One-to-One` with `MeetingTranscript`.
  - `One-to-One` with `AIAnalysis`.
  - `One-to-Many` with `EmailRecipient`.
  - `One-to-Many` with `GeneratedPDF`.
  - `One-to-Many` with `ProcessingLog`.

### 3. AIAnalysis (ai_processing.AIAnalysis)
- Stores common summary data.
- Relationships:
  - `One-to-Many` with `RoleSummary`.
  - `One-to-Many` with `PersonalizedTask`.

### 4. GeneratedPDF (pdf_generator.GeneratedPDF)
- Tracks individual PDF files.
- Relationships:
  - `One-to-Many` with `EmailLog`.

### 5. EmailRecipient (notifications.EmailRecipient)
- Stores contact info for distribution.
- Relationships:
  - `One-to-Many` with `EmailLog`.

## Processing Flow
1. **Meeting** is created.
2. **UploadedFile** is linked upon file submission.
3. **MeetingTranscript** is created after parsing/transcription.
4. **AIAnalysis** is generated, creating multiple **RoleSummary** and **PersonalizedTask** records.
5. **GeneratedPDF** records are created when PDFs are rendered.
6. **EmailLog** records track the delivery to each **EmailRecipient**.
