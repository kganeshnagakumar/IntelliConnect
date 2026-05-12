from django.db import models
from django.conf import settings
import uuid

class Meeting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='meetings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'meetings'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class UploadedFile(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('UPLOADING', 'Uploading'),
        ('UPLOADED', 'Uploaded'),
        ('FAILED', 'Failed'),
    ]
    
    PROCESSING_CHOICES = [
        ('IDLE', 'Idle'),
        ('QUEUED', 'Queued'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='uploaded_file')
    original_filename = models.CharField(max_length=255)
    storage_path = models.CharField(max_length=1024)
    file_type = models.CharField(max_length=50) # mp3, wav, vtt, pdf, etc.
    mime_type = models.CharField(max_length=100)
    file_size = models.BigIntegerField()
    upload_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    processing_status = models.CharField(max_length=20, choices=PROCESSING_CHOICES, default='IDLE')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'uploaded_files'

class MeetingTranscript(models.Model):
    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='transcript')
    raw_content = models.TextField(blank=True)
    cleaned_content = models.TextField(blank=True)
    vtt_content = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'meeting_transcripts'

class ProcessingLog(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='logs')
    stage = models.CharField(max_length=100) # UPLOAD, TRANSCRIPTION, ANALYSIS, PDF_GEN, EMAIL
    status = models.CharField(max_length=50) # STARTED, SUCCESS, FAILED
    message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'processing_logs'
        ordering = ['timestamp']


# ─────────────────────── API Sync Tables (Power BI / External) ───────────────────────

class APIMeeting(models.Model):
    id = models.BigAutoField(primary_key=True)
    meeting_id = models.CharField(max_length=255, blank=True, null=True)
    meeting_title = models.CharField(max_length=255, blank=True, null=True)
    meeting_date = models.CharField(max_length=100, blank=True, null=True)
    meeting_time = models.CharField(max_length=100, blank=True, null=True)
    duration_minutes = models.IntegerField(blank=True, null=True)
    meeting_context = models.TextField(blank=True, null=True)
    ai_summary = models.TextField(blank=True, null=True)
    role_based_summary = models.TextField(blank=True, null=True)
    custom_summary = models.TextField(blank=True, null=True)
    participants_count = models.IntegerField(blank=True, null=True)
    docs_generated = models.IntegerField(blank=True, null=True)
    file_type = models.CharField(max_length=50, blank=True, null=True)
    uploaded_by = models.CharField(max_length=255, blank=True, null=True)
    uploaded_by_email = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'api_meeting'
        managed = False

class APITask(models.Model):
    id = models.BigAutoField(primary_key=True)
    meeting_id = models.CharField(max_length=255, blank=True, null=True)
    task_id = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=255, blank=True, null=True)
    task_description = models.TextField(blank=True, null=True)
    assigned_to = models.CharField(max_length=255, blank=True, null=True)
    assigned_email = models.CharField(max_length=255, blank=True, null=True)
    priority = models.CharField(max_length=50, blank=True, null=True)
    generated_time = models.DateTimeField(auto_now_add=True)
    document_link = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'api_task'
        managed = False

class APIParticipant(models.Model):
    id = models.BigAutoField(primary_key=True)
    meeting_id = models.CharField(max_length=255, blank=True, null=True)
    participant_id = models.CharField(max_length=255, blank=True, null=True)
    participant_name = models.CharField(max_length=255, blank=True, null=True)
    participant_email = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    speaking_time = models.CharField(max_length=100, blank=True, null=True)
    summary_sent = models.BooleanField(default=False)
    summary_sent_time = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'api_participant'
        managed = False

class APIDocument(models.Model):
    id = models.BigAutoField(primary_key=True)
    meeting_id = models.CharField(max_length=255, blank=True, null=True)
    doc_id = models.CharField(max_length=255, blank=True, null=True)
    document_name = models.CharField(max_length=255, blank=True, null=True)
    document_type = models.CharField(max_length=255, blank=True, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    shared_to_email = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'api_document'
        managed = False
