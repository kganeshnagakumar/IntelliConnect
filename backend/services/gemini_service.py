"""
GeminiService — Optimized for Gemini 3.1 Flash-Lite
Handles: Meeting Summarization, Transcript Cleaning, Copilot Chat
"""

from google import genai
from google.genai import types
from django.conf import settings
import json
import logging
from pydantic import BaseModel, Field
from typing import List, Optional

logger = logging.getLogger(__name__)

# ─────────────────────── Structured Output Schemas ───────────────────────

class RoleSummary(BaseModel):
    role: str = Field(description="Department or role group e.g. Engineering, HR, Sales")
    content: str = Field(description="Key summary for that role")

class PersonalizedTask(BaseModel):
    name: str = Field(description="Person's name")
    task: str = Field(description="What they need to do")
    priority: str = Field(description="High, Medium, or Low")
    deadline: Optional[str] = Field(description="Deadline date if mentioned")

class MeetingAnalysis(BaseModel):
    context_summary: str = Field(description="A highly structured, markdown-formatted bulleted list containing: 1. Executive Overview, 2. Key Decisions, 3. Critical Highlights, 4. Risks/Blockers.")
    role_summaries: List[RoleSummary]
    personalized_tasks: List[PersonalizedTask]

class CopilotResponse(BaseModel):
    answer: str = Field(description="Concise, helpful response to user query")
    follow_up_suggestions: List[str] = Field(description="2-3 short follow-up prompt suggestions")


# ─────────────────────────── Main Service ────────────────────────────────

class GeminiService:
    MODEL = "gemini-3.1-flash-lite"

    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def _call_with_retry(self, func, *args, **kwargs):
        import time
        max_retries = 3
        delay = 2
        for i in range(max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if "503" in str(e) or "UNAVAILABLE" in str(e):
                    logger.warning(f"Gemini 503 error, retrying in {delay}s... (Attempt {i+1}/{max_retries})")
                    time.sleep(delay)
                    delay *= 2
                    continue
                raise e
        return func(*args, **kwargs)

    # ── 1. Meeting Analysis ──────────────────────────────────────────────

    def analyze_meeting(self, transcript_text: str) -> dict:
        """
        Full meeting analysis: context summary, role summaries, personalized tasks.
        Uses structured JSON output for reliability.
        """
        if not transcript_text or len(transcript_text.strip()) < 50:
            return {
                "context_summary": "No transcript content available for analysis.",
                "role_summaries": [],
                "personalized_tasks": []
            }

        prompt = f"""You are an expert meeting analyst. Analyze the following meeting transcript.
Extract the following information and structure it meticulously:

1. Context Summary: Provide a comprehensive but concise summary formatted as a clean text bulleted list. It MUST include these exact headings:
   - EXECUTIVE OVERVIEW: (1-2 sentences summarizing the main goal)
   - KEY DECISIONS: (Bullet points of finalized decisions)
   - CRITICAL HIGHLIGHTS: (Bullet points of important information shared)
   - RISKS & BLOCKERS: (Bullet points of concerns or blockers mentioned)
2. **Role-Based Summaries**: Grouped by department/role (e.g. Engineering, HR, Sales, Finance).
3. **Personalized Tasks**: For each person mentioned, extract what they need to do, priority (High/Medium/Low), and deadline.

Meeting Transcript:
\"\"\"
{transcript_text[:60000]}
\"\"\"

Be concise, professional, and ensure the context_summary is beautifully formatted with markdown bullet points."""

        try:
            response = self._call_with_retry(
                self.client.models.generate_content,
                model=self.MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_json_schema=MeetingAnalysis.model_json_schema(),
                    temperature=0.3,
                )
            )
            data = json.loads(response.text)
            logger.info(f"Meeting analysis complete. Tasks found: {len(data.get('personalized_tasks', []))}")
            return data

        except Exception as e:
            logger.error(f"Meeting analysis failed: {e}")
            return {
                "context_summary": f"Analysis failed: {str(e)}",
                "role_summaries": [],
                "personalized_tasks": []
            }

    # ── 2. Transcript Cleaning ───────────────────────────────────────────

    def clean_transcript(self, raw_text: str) -> str:
        """
        Lightweight transcript cleaning — removes timestamps, speaker tags noise.
        Uses Flash-Lite for maximum speed and cost efficiency.
        """
        if not raw_text:
            return raw_text

        prompt = f"""Clean this meeting transcript. Remove timestamps, redundant speaker tags, and filler words.
Keep all spoken content and speaker names. Output clean, readable paragraphs.

Transcript:
{raw_text[:80000]}"""

        try:
            response = self._call_with_retry(
                self.client.models.generate_content,
                model=self.MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=8192,
                )
            )
            return response.text

        except Exception as e:
            logger.error(f"Transcript cleaning failed: {e}")
            return raw_text

    # ── 3. Audio/Multimodal Transcription ───────────────────────────────

    def transcribe_audio_file(self, file_path: str) -> str:
        """
        Transcribes audio using Gemini's native multimodal capability.
        Supports mp3, wav, m4a.
        """
        import pathlib
        import time
        try:
            # Upload file to GenAI File API
            uploaded_file = self.client.files.upload(file=file_path)
            
            # Wait for large files (audio/video) to finish processing in Gemini
            while uploaded_file.state.name == "PROCESSING":
                time.sleep(3)
                uploaded_file = self.client.files.get(name=uploaded_file.name)
                
            if uploaded_file.state.name == "FAILED":
                err_details = str(getattr(uploaded_file, 'error', 'No additional details provided by Gemini.'))
                raise Exception(f"Audio/Video file processing failed in Gemini API. Reason: {err_details}")
            
            response = self._call_with_retry(
                self.client.models.generate_content,
                model=self.MODEL,
                contents=["Generate a detailed transcript of this audio. Include speaker identification where possible.", uploaded_file],
                config=types.GenerateContentConfig(temperature=0.1)
            )
            return response.text

        except Exception as e:
            logger.error(f"Gemini transcription failed: {e}")
            raise Exception(f"Transcription failed: {str(e)}")

    # ── 4. Copilot Chat ──────────────────────────────────────────────────

    def copilot_chat(self, user_message: str, context: dict = None) -> dict:
        """
        Handles AI Copilot chat with structured response.
        Context can include: recent meetings, tasks, participant info.
        """
        system_instruction = """You are IntelliConnect's AI Copilot — a smart, concise meeting intelligence assistant.
You help users understand meeting outcomes, track tasks, and get insights from their meeting data.
Be direct, professional, and action-oriented. Responses should be short (2-4 sentences max).
Always provide 2-3 relevant follow-up suggestions."""

        context_block = ""
        if context:
            if context.get("recent_meetings"):
                context_block += f"\nRecent Meetings: {json.dumps(context['recent_meetings'][:3])}"
            if context.get("pending_tasks"):
                context_block += f"\nPending Tasks: {json.dumps(context['pending_tasks'][:5])}"

        full_prompt = f"{context_block}\n\nUser: {user_message}" if context_block else user_message

        try:
            response = self.client.models.generate_content(
                model=self.MODEL,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_json_schema=CopilotResponse.model_json_schema(),
                    temperature=0.5,
                    max_output_tokens=1024,
                )
            )
            return json.loads(response.text)

        except Exception as e:
            logger.error(f"Copilot chat failed: {e}")
            return {
                "answer": f"I encountered an error: {str(e)}. Please try again.",
                "follow_up_suggestions": ["Show recent meetings", "List my tasks", "Team overview"]
            }

    # ── 5. Quick Summarization ───────────────────────────────────────────

    def quick_summarize(self, text: str, max_lines: int = 5) -> str:
        """
        Lightweight summary for dashboard cards and notifications.
        Very fast — optimized for high-frequency calls.
        """
        try:
            response = self.client.models.generate_content(
                model=self.MODEL,
                config=types.GenerateContentConfig(
                    system_instruction=f"Summarize in {max_lines} bullet points maximum. Be concise."
                ),
                contents=text[:20000]
            )
            return response.text
        except Exception as e:
            logger.error(f"Quick summarize failed: {e}")
            return text[:500]
