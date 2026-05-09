# System Design Decisions

## Decoupling Processing from Persistence
A key design decision in Intelliconnect is separating the AI analysis from database persistence:
1. `POST /api/meetings/process_meeting/` -> **Stateless**. Uploads, processes, and returns JSON.
2. `POST /api/meetings/save_analysis/` -> **Stateful**. Commits the JSON to the database.
**Tradeoff**: It requires the frontend to hold large JSON state temporarily.
**Benefit**: It empowers the user to review, edit, or cancel the AI results before polluting the database with hallucinations or incorrect assignments.

## AI Integration Choice
The system uses `gemini-3.1-flash-lite` combined with Pydantic schemas. 
**Benefit**: The Flash-Lite model provides an extremely cost-effective tier while the Structured Outputs (JSON Schema) guarantee the API payload conforms perfectly to the backend's expectations, eliminating the need for complex Regex parsing of AI text.

## Webhook-Friendly Data Structures
The `IntegratedIntelligence` model denormalizes tasks and meetings into a single table partitioned by `person_name`/`person_mail`.
**Design Rationale**: This allows external listeners (like Supabase, Make.com, or Zapier) to watch a single table for `INSERT` events and easily trigger personalized email summaries without needing to perform complex SQL joins across the `Meeting`, `Participant`, and `Task` tables.