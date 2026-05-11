import logging
import os
import random

from celery import shared_task

from .services.gemini_service import GeminiService

logger = logging.getLogger(__name__)


def is_iso_date_string(deadline_val):
    return bool(
        deadline_val
        and isinstance(deadline_val, str)
        and len(deadline_val) == 10
        and deadline_val.count("-") == 2
    )


def build_processed_meeting_response(analysis_data, file_name, category):
    meeting_id = f"M{random.randint(100, 999)}"

    tasks_data = []
    for task in analysis_data.get("tasks", []):
        deadline_val = task.get("deadline")
        if not is_iso_date_string(deadline_val):
            deadline_val = None

        tasks_data.append(
            {
                "employee_name": task.get("employee_name", "Unknown")[:255],
                "description": task.get("description", ""),
                "deadline": deadline_val,
            }
        )

    participants_data = []
    for participant in analysis_data.get("participants", []):
        name_val = participant.get("name", "Unknown")[:255]
        default_email = f"{name_val.lower().replace(' ', '.')}@company.com"
        participants_data.append(
            {
                "name": name_val,
                "role": participant.get("role", "Participant")[:255],
                "email": participant.get("email", default_email),
                "contribution_score": float(participant.get("contribution_score", 0.5)),
            }
        )

    transcripts_data = []
    for transcript in analysis_data.get("transcripts", []):
        transcripts_data.append(
            {
                "speaker": transcript.get("speaker", "Unknown")[:255],
                "timestamp": transcript.get("timestamp", "00:00:00")[:50],
                "text": transcript.get("text", ""),
            }
        )

    return {
        "meeting_id": meeting_id,
        "title": file_name,
        "category": category,
        "status": "completed",
        "priority": "Medium",
        "duration": "45:00",
        "summary": analysis_data.get("summary", ""),
        "key_decisions": analysis_data.get("key_decisions", ""),
        "ai_insights": analysis_data.get("ai_insights", ""),
        "tasks": tasks_data,
        "participants": participants_data,
        "transcripts": transcripts_data,
        "tasks_count": len(tasks_data),
        "participants_count": len(participants_data),
    }


@shared_task(bind=True)
def process_meeting_task(self, temp_path, file_name, category="General", settings_str="{}"):
    try:
        analysis_data = GeminiService().process_meeting_file(
            temp_path,
            file_name,
            category=category,
            settings_str=settings_str,
        )
        return build_processed_meeting_response(analysis_data, file_name=file_name, category=category)
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
            except OSError:
                logger.warning("Failed to remove temp file after processing", exc_info=True)
