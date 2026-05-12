from django.db import models
from apps.meetings.models import Meeting

class AIAnalysis(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]

    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='ai_analysis')
    context_summary = models.TextField(blank=True) # Overview, Main discussion, Decisions, Highlights
    overall_sentiment = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_analysis'

class RoleSummary(models.Model):
    analysis = models.ForeignKey(AIAnalysis, on_delete=models.CASCADE, related_name='role_summaries')
    role_name = models.CharField(max_length=100) # Backend Developer, Data Analyst, etc.
    summary_content = models.TextField()
    
    class Meta:
        db_table = 'role_summaries'

class PersonalizedTask(models.Model):
    analysis = models.ForeignKey(AIAnalysis, on_delete=models.CASCADE, related_name='personalized_tasks')
    person_name = models.CharField(max_length=255)
    task_description = models.TextField()
    priority = models.CharField(max_length=20, default='Medium') # High, Medium, Low
    deadline = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'personalized_tasks'
