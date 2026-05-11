import os
import time
import logging
import json_repair
from google import genai
from django.conf import settings
from ..schemas import MeetingAnalysis

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def process_meeting_file(self, temp_path, file_name, category="General", settings_str="{}"):
        prompt = f"Analyze this meeting recording or transcript. Category: {category}. Settings: {settings_str}. Extract the requested structured data including summary, decisions, participants, tasks, and transcripts. Note: If the audio is very long, limit the transcripts array to the 50 most important conversational segments to save tokens and prevent JSON cutoff."
        
        gemini_file = None
        contents_list = [prompt]
        
        try:
            # If it's a text/VTT file, read it and pass as text
            if file_name.lower().endswith(('.vtt', '.txt', '.md', '.csv')):
                with open(temp_path, 'r', encoding='utf-8', errors='ignore') as f:
                    text_content = f.read()
                contents_list.append(f"Meeting Transcript:\n{text_content}")
            else:
                # For audio/video files
                gemini_file = self.client.files.upload(file=temp_path)
                
                # Wait for large files (audio/video) to finish processing in Gemini
                while gemini_file.state.name == "PROCESSING":
                    time.sleep(3)
                    gemini_file = self.client.files.get(name=gemini_file.name)
                    
                if gemini_file.state.name == "FAILED":
                    err_details = str(getattr(gemini_file, 'error', 'No additional details provided by Gemini.'))
                    raise Exception(f"Audio/Video file processing failed in Gemini API. Reason: {err_details}")
                    
                contents_list.append(gemini_file)
            
            response = self.client.models.generate_content(
                model="gemini-2.0-flash", # Updated to a more stable model name if needed, but keeping intent
                contents=contents_list,
                config={
                    "response_mime_type": "application/json",
                    "response_json_schema": MeetingAnalysis.model_json_schema(),
                },
            )
            
            # Use json_repair to robustly parse potentially truncated JSON
            analysis_data = json_repair.loads(response.text)
            
            return analysis_data
            
        finally:
            if gemini_file:
                try:
                    self.client.files.delete(name=gemini_file.name)
                except Exception as e:
                    logger.warning(f"Failed to delete Gemini file: {e}")
