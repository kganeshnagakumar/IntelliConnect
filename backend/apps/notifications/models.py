from django.db import models
from apps.meetings.models import Meeting
from apps.pdf_generator.models import GeneratedPDF

class EmailRecipient(models.Model):
    SOURCE_CHOICES = [
        ('MANUAL', 'Manual'),
        ('CSV', 'CSV'),
        ('XLSX', 'XLSX'),
    ]

    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='recipients')
    email = models.EmailField()
    name = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES, default='MANUAL')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'email_recipients'
        unique_together = ('meeting', 'email')

class EmailLog(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('FAILED', 'Failed'),
        ('RETRYING', 'Retrying'),
    ]

    recipient = models.ForeignKey(EmailRecipient, on_delete=models.CASCADE, related_name='logs')
    pdf = models.ForeignKey(GeneratedPDF, on_delete=models.SET_NULL, null=True, related_name='email_logs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    sent_at = models.DateTimeField(null=True, blank=True)
    failed_reason = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'email_logs'
