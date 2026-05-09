# AI Analysis Pipeline

Intelliconnect leverages **Google GenAI** (`gemini-3.1-flash-lite`) to process meeting transcripts and audio files natively.

## Implementation Details

### Model & Prompt Strategy
- **Prompt**: The backend constructs a prompt instructing the model to extract summaries, key decisions, insights, tasks, participants, and transcript segments based on provided meeting category and settings.
- **Pydantic Schemas**: Structured output is strictly enforced using `response_json_schema` via Pydantic (`MeetingAnalysis`, `TaskSchema`, `ParticipantSchema`, `TranscriptSegmentSchema`).
- **Token Optimization**: The prompt explicitly instructs the AI to "limit the transcripts array to the 50 most important conversational segments to save tokens and prevent JSON cutoff."

### Processing Pipeline (`process_meeting` view)
1. **Ingestion**: Receives the file via `multipart/form-data`.
2. **Temporary Storage**: Saves the file temporarily to the local filesystem.
3. **Format Detection**:
   - If the file is text-based (`.vtt`, `.txt`, `.csv`, `.md`), it reads the text and appends it to the prompt.
   - If the file is audio/video, it uploads it to Google's File API (`client.files.upload`), waits for the `"PROCESSING"` state to resolve, and passes the file reference to the prompt.
4. **Execution**: Calls `client.models.generate_content`.
5. **Robust Parsing**: Uses `json_repair.loads(response.text)` to handle cases where the AI might return slightly malformed or truncated JSON.
6. **Cleanup**: Deletes the remote file on Google servers and unlinks the local temporary file.
7. **Mapping**: Enriches the parsed data with default estimates (e.g., creating fake emails for participants based on names) before returning it to the frontend.

### Task & Deadline Extraction
The AI utilizes the `TaskSchema` to map natural language to specific assignees (`employee_name`), extract descriptions, and map temporal mentions to ISO formats (`YYYY-MM-DD`). Default fallback values are specified in the schema.