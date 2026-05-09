import email
from django.db import models

class Meeting(models.Model):
    meeting_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=50, default='completed')
    created_at = models.DateTimeField(auto_now_add=True)
    video_url = models.URLField(blank=True, null=True)
    audio_url = models.URLField(blank=True, null=True)
    transcript_url = models.URLField(blank=True, null=True)
    priority = models.CharField(
        max_length=10, 
        choices=[('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')], 
        default='Medium'
    )
    duration = models.CharField(max_length=20, blank=True, null=True) # e.g. "45:20"
    key_decisions = models.TextField(blank=True, null=True)
    ai_insights = models.TextField(blank=True, null=True)



    def __str__(self):
        return f"{self.meeting_id} - {self.title}"

class Task(models.Model):
    meeting = models.ForeignKey(Meeting, related_name='tasks', on_delete=models.CASCADE, null=True, blank=True)
    employee_name = models.CharField(max_length=255)
    description = models.TextField()
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, default='pending')
    email = models.EmailField(max_length=254, blank=True, null=True)

    def __str__(self):
        return f"Task for {self.employee_name}: {self.description[:50]}"

class Participant(models.Model):
    meeting = models.ForeignKey(Meeting, related_name='participants', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    contribution_score = models.FloatField(default=0.0) # contribution insights

    def __str__(self):
        return f"{self.name} in {self.meeting.title}"

class TranscriptSegment(models.Model):
    meeting = models.ForeignKey(Meeting, related_name='transcripts', on_delete=models.CASCADE)
    speaker = models.CharField(max_length=255)
    text = models.TextField()
    timestamp = models.CharField(max_length=50) # e.g. "00:01:23"

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"[{self.timestamp}] {self.speaker}: {self.text[:50]}"

class IntegratedIntelligence(models.Model):
    # IDs and Metadata
    meeting_id = models.CharField(max_length=50)
    meeting_title = models.CharField(max_length=255)
    duration = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Person details
    person_name = models.CharField(max_length=255, blank=True, null=True)
    person_id = models.CharField(max_length=50, blank=True, null=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    person_mail = models.EmailField(max_length=254, blank=True, null=True)
    
    # Content details
    description = models.TextField(blank=True, null=True) # Overall meeting description/summary
    tasks_assigned = models.TextField(blank=True, null=True) # Formatted list of tasks
    deadlines = models.TextField(blank=True, null=True) # Formatted list of deadlines
    
    # Full data payloads if needed
    tasks_json = models.JSONField(default=list, blank=True)
    participants_json = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Sync: {self.meeting_title} - {self.person_name}"
