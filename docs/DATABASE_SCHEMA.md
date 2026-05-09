# Database Schema

The application primarily uses Django's ORM mapped to an underlying database (SQLite by default).

## Entity Relationship Diagram

```mermaid
erDiagram
    MEETING {
        string meeting_id PK
        string title
        text summary
        string category
        string status
        datetime created_at
        string priority
        string duration
        text key_decisions
        text ai_insights
    }
    
    TASK {
        int id PK
        string employee_name
        text description
        date deadline
        string status
        string email
        int meeting_id FK
    }
    
    PARTICIPANT {
        int id PK
        string name
        string role
        string email
        float contribution_score
        int meeting_id FK
    }
    
    TRANSCRIPT_SEGMENT {
        int id PK
        string speaker
        text text
        string timestamp
        int meeting_id FK
    }

    INTEGRATED_INTELLIGENCE {
        int id PK
        string meeting_id
        string person_name
        string person_mail
        text tasks_assigned
        text deadlines
        json tasks_json
    }

    MEETING ||--o{ TASK : has
    MEETING ||--o{ PARTICIPANT : contains
    MEETING ||--o{ TRANSCRIPT_SEGMENT : includes
```

## Model Descriptions

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `Meeting` | Central entity representing a processed session. | `meeting_id`, `summary`, `key_decisions`, `ai_insights`, `priority` |
| `Task` | Action items extracted by the AI. | `employee_name`, `deadline`, `description`, `email`, `status` |
| `Participant` | People identified in the meeting. | `name`, `role`, `contribution_score`, `email` |
| `TranscriptSegment` | Extracted or parsed conversational chunks. | `speaker`, `text`, `timestamp` |
| `IntegratedIntelligence` | Flat representation created per-participant to easily interface with Supabase webhooks for automated emails/notifications. | `person_mail`, `tasks_assigned`, `deadlines` |