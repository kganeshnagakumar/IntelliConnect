from pydantic import BaseModel, Field

class TaskSchema(BaseModel):
    employee_name: str = Field(description="Name of the person assigned the task")
    description: str = Field(description="Description of the task")
    deadline: str = Field(description="Deadline if mentioned, else YYYY-MM-DD format roughly", default="2026-05-15")

class ParticipantSchema(BaseModel):
    name: str = Field(description="Name of the participant")
    role: str = Field(description="Role or title of the participant, guess from context if needed")
    contribution_score: float = Field(description="A score between 0.0 and 1.0 representing their participation level")

class TranscriptSegmentSchema(BaseModel):
    speaker: str = Field(description="Name of the speaker")
    timestamp: str = Field(description="Timestamp of the speech segment (e.g., '00:01:23')")
    text: str = Field(description="The actual spoken text")

class MeetingAnalysis(BaseModel):
    summary: str = Field(description="A detailed summary of the meeting")
    key_decisions: str = Field(description="A list of key decisions made, formatted with bullet points")
    ai_insights: str = Field(description="General AI insights about the meeting tone, productivity, etc.")
    tasks: list[TaskSchema] = Field(description="List of tasks assigned during the meeting")
    participants: list[ParticipantSchema] = Field(description="List of identified participants")
    transcripts: list[TranscriptSegmentSchema] = Field(description="The transcribed segments of the meeting. If it was already a VTT, just parse it. If audio, transcribe it.")
