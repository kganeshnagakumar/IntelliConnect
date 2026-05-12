from django.db import models
from apps.meetings.models import Meeting

class GeneratedPDF(models.Model):
    TYPE_CHOICES = [
        ('COMMON', 'Common'),
        ('PERSONALIZED', 'Personalized'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('GENERATED', 'Generated'),
        ('FAILED', 'Failed'),
    ]

    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='pdfs')
    recipient_name = models.CharField(max_length=255, blank=True)
    recipient_email = models.EmailField(blank=True)
    pdf_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    storage_path = models.CharField(max_length=1024, blank=True)
    pdf_url = models.URLField(max_length=1024, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'generated_pdfs'
