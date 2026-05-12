import openai
import google.generativeai as genai
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self, provider='openai'):
        self.provider = provider
        if provider == 'openai':
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        elif provider == 'gemini':
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro')

    def transcribe_audio(self, file_path):
        """
        Transcribes audio using Whisper (Gemini doesn't have a direct equivalent in the standard SDK yet,
        so we stay with Whisper or use Gemini 1.5 Pro's multimodal if needed).
        """
        try:
            # For now, keeping Whisper for transcription
            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            with open(file_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio_file
                )
            return transcript.text
        except Exception as e:
            logger.error(f"Transcription failed: {str(e)}")
            raise Exception(f"Transcription failed: {str(e)}")

    def analyze_meeting(self, transcript_text):
        """
        Generates summaries and tasks from transcript using selected LLM.
        """
        if not transcript_text:
            return {
                "context_summary": "No transcript available.",
                "role_summaries": [],
                "personalized_tasks": []
            }

        prompt = f"""
        Analyze the following meeting transcript and provide:
        1. Context Summary: Overview, Main discussion, Decisions, Highlights.
        2. Role-Based Summary: Categorize insights by domain.
        3. Personalized Tasks: Identify person-specific tasks with priority and deadline.

        Transcript:
        {transcript_text}

        Return the response in JSON format:
        {{
            "context_summary": "...",
            "role_summaries": [
                {{"role": "...", "content": "..."}}
            ],
            "personalized_tasks": [
                {{"name": "...", "task": "...", "priority": "...", "deadline": "..."}}
            ]
        }}
        """

        try:
            if self.provider == 'openai':
                response = self.client.chat.completions.create(
                    model="gpt-4-turbo-preview",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)
            
            elif self.provider == 'gemini':
                response = self.model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        response_mime_type="application/json"
                    )
                )
                return json.loads(response.text)

        except Exception as e:
            logger.error(f"AI Analysis failed: {str(e)}")
            return {
                "context_summary": f"Analysis failed: {str(e)}",
                "role_summaries": [],
                "personalized_tasks": []
            }

    def clean_transcript(self, raw_text):
        """Clean and normalize transcript."""
        prompt = f"Clean and normalize this meeting transcript. Remove timestamps and redundant speaker tags.\n\n{raw_text}"
        try:
            if self.provider == 'openai':
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}]
                )
                return response.choices[0].message.content
            elif self.provider == 'gemini':
                response = self.model.generate_content(prompt)
                return response.text
        except Exception as e:
            logger.error(f"Cleaning failed: {str(e)}")
            return raw_text
