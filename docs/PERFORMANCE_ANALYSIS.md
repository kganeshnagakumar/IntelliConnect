# Performance Analysis

## Optimizations Found

1. **Frontend Proxying**
   - The frontend uses Vite server proxies, avoiding the overhead of preflight CORS requests during local development.

2. **Token Saving Constraints**
   - In `backend/meetings/views.py`, the GenAI prompt explicitly instructs the LLM: `"limit the transcripts array to the 50 most important conversational segments to save tokens and prevent JSON cutoff."` This is a crucial architectural decision to prevent massive cost overruns and context-window failures on long meetings.

3. **Robust JSON Parsing**
   - The system utilizes `json_repair` library instead of standard `json.loads`. LLMs occasionally truncate responses or insert markdown block formatting (` ```json `); `json_repair` ensures partial or slightly malformed outputs are gracefully salvaged, significantly reducing application failure rates.

## Identified Bottlenecks

1. **Synchronous LLM Processing**
   - The `process_meeting` endpoint handles file upload to Gemini and loops `time.sleep(3)` synchronously while waiting for Google to process the audio. This blocks the Django worker completely. For production scale, this flow must be moved to an asynchronous task queue (e.g., Celery) using WebSockets or polling to notify the frontend.
   
2. **Missing Frontend Pagination**
   - The `/api/meetings/` endpoint relies on standard DRF querysets, but if the dataset grows, the frontend will need to implement infinite scroll or standard pagination to prevent massive payloads on the Meeting History page.