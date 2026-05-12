from django.core.mail import EmailMessage
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    @staticmethod
    def send_meeting_report(recipient_email, recipient_name, pdf_path, meeting_title):
        """Sends an email with the PDF attachment."""
        subject = f"Your Meeting Report: {meeting_title}"
        body = f"Hi {recipient_name or 'there'},\n\nPlease find attached your personalized meeting report for '{meeting_title}'.\n\nBest regards,\nAI Meeting Intelligence Team"
        
        email = EmailMessage(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            [recipient_email],
        )
        
        try:
            with open(pdf_path, 'rb') as f:
                email.attach(f"{meeting_title.replace(' ', '_')}_Report.pdf", f.read(), 'application/pdf')
            
            email.send(fail_silently=False)
            return True, None
        except Exception as e:
            logger.error(f"Failed to send email to {recipient_email}: {str(e)}")
            return False, str(e)
