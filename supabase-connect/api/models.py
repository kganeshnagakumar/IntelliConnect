from django.db import models

# Create your models here.

class Meeting(models.Model):
    meeting_id = models.CharField(max_length=100, unique=True)
    meeting_title = models.CharField(max_length=255)
    meeting_date = models.DateField()
    meeting_time = models.TimeField()
    duration_minutes = models.IntegerField()
    meeting_context = models.TextField()
    ai_summary = models.TextField(blank=True)
    role_based_summary = models.TextField(blank=True)
    custom_summary = models.TextField(blank=True)
    participants_count = models.IntegerField()
    docs_generated = models.IntegerField()
    file_type = models.CharField(max_length=10)  # e.g., mp4, wav, pdf, docx
    uploaded_by = models.CharField(max_length=100)
    uploaded_by_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.meeting_title

class Participant(models.Model):
    participant_id = models.CharField(max_length=100, unique=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    participant_name = models.CharField(max_length=100)
    participant_email = models.EmailField()
    role = models.CharField(max_length=50)  # e.g., HR, Finance, Tech
    department = models.CharField(max_length=100)
    speaking_time = models.IntegerField(null=True, blank=True)
    summary_sent = models.BooleanField(default=False)
    summary_sent_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.participant_name

class Task(models.Model):
    task_id = models.CharField(max_length=100, unique=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    role = models.CharField(max_length=50)
    task_description = models.TextField()
    assigned_to = models.CharField(max_length=100)
    assigned_email = models.EmailField()
    priority = models.CharField(max_length=10)  # High, Medium, Low
    generated_time = models.DateTimeField(auto_now_add=True)
    document_link = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.task_description[:50]

class Document(models.Model):
    doc_id = models.CharField(max_length=100, unique=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    document_name = models.CharField(max_length=255)
    document_type = models.CharField(max_length=50)  # e.g., MOM, Summary
    generated_at = models.DateTimeField(auto_now_add=True)
    shared_to_email = models.EmailField()

    def __str__(self):
        return self.document_name
