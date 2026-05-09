# Features

Intelliconnect offers the following capabilities derived directly from the codebase:

1. **Intelligent Meeting Processing**
   - Supports uploading raw audio/video files directly.
   - Leverages Google Gemini Flash-Lite to transcribe and analyze the audio.
   - Optionally accepts text transcripts (`.vtt`, `.txt`) for faster, text-only analysis.

2. **Automated Extraction**
   - **Key Decisions**: Extracts bulleted lists of strategic decisions.
   - **Actionable Tasks**: Identifies tasks, the assignee, and the stated deadline, mapping them directly to database schemas.
   - **Participant Recognition**: Identifies speakers and assigns a mock "Contribution Score".

3. **Dashboard & Analytics**
   - View top-level aggregates regarding total meetings, priority splits, and total tasks generated.
   - Real-time charting representations for AI accuracy, efficiency scores, and categorical distributions.

4. **Event-Driven Architecture Readiness**
   - The application generates `IntegratedIntelligence` records upon saving a meeting. This flattened table structure creates a row per participant containing their specific tasks and deadlines, designed to be easily hooked into by database-level triggers (like Supabase Edge Functions) for automated email notification dispatching.