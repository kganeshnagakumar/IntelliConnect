from celery import shared_task
from apps.meetings.models import Meeting, UploadedFile, MeetingTranscript, ProcessingLog
from apps.ai_processing.models import AIAnalysis, RoleSummary, PersonalizedTask
from apps.pdf_generator.models import GeneratedPDF
from apps.notifications.models import EmailRecipient, EmailLog
from services.gemini_service import GeminiService
from services.pdf_service import PDFService
from services.email_service import EmailService
from services.supabase_storage import SupabaseStorageService
from utils.parsers import get_parser
from datetime import datetime
import os
import tempfile
import requests

@shared_task(bind=True, max_retries=3)
def process_meeting_pipeline(self, meeting_id):
    """Main pipeline for processing a meeting."""
    try:
        meeting = Meeting.objects.get(id=meeting_id)
        uploaded_file = meeting.uploaded_file
        
        # 1. Update status
        uploaded_file.processing_status = 'PROCESSING'
        uploaded_file.save()
        ProcessingLog.objects.create(meeting=meeting, stage='PIPELINE', status='STARTED', message='Starting processing pipeline')

        ProcessingLog.objects.create(meeting=meeting, stage='TRANSCRIPTION', status='STARTED')

        storage_service = SupabaseStorageService()
        
        transcript_text = ""
        ai_service = GeminiService()
        
        with tempfile.NamedTemporaryFile(suffix=f".{uploaded_file.file_type}", delete=False) as tmp:
            file_bytes = storage_service.download_file(uploaded_file.storage_path)
            tmp.write(file_bytes)
            local_path = tmp.name

        try:
            if uploaded_file.file_type in ['mp3', 'wav', 'm4a']:
                transcript_text = ai_service.transcribe_audio_file(local_path)
            else:
                parser = get_parser(uploaded_file.file_type)
                if parser:
                    transcript_text = parser(local_path)
                else:
                    transcript_text = "Unsupported file format for text extraction."
            
            # Save Transcript
            MeetingTranscript.objects.update_or_create(
                meeting=meeting,
                defaults={'cleaned_content': transcript_text, 'raw_content': transcript_text}
            )
        finally:
            if os.path.exists(local_path):
                os.remove(local_path)
        
        # 3. AI Analysis
        ProcessingLog.objects.create(meeting=meeting, stage='ANALYSIS', status='STARTED')
        analysis_data = ai_service.analyze_meeting(transcript_text)
        
        analysis, _ = AIAnalysis.objects.update_or_create(
            meeting=meeting,
            defaults={
                'context_summary': analysis_data.get('context_summary', ''),
                'status': 'COMPLETED'
            }
        )
        
        # Clear old summaries/tasks if re-processing
        analysis.role_summaries.all().delete()
        analysis.personalized_tasks.all().delete()
        
        for rs in analysis_data.get('role_summaries', []):
            RoleSummary.objects.create(analysis=analysis, role_name=rs['role'], summary_content=rs['content'])
            
        for pt in analysis_data.get('personalized_tasks', []):
            PersonalizedTask.objects.create(
                analysis=analysis, 
                person_name=pt['name'], 
                task_description=pt['task'], 
                priority=pt['priority'],
                deadline=pt.get('deadline')
            )
            
        # 4. Sync to External API Tables (Power BI / External Integration)
        try:
            from apps.meetings.models import APIMeeting, APITask, APIParticipant, APIDocument
            import uuid
            
            meeting_id_str = str(meeting.id)
            owner = meeting.owner
            
            APIMeeting.objects.create(
                meeting_id=meeting_id_str,
                meeting_title=meeting.title,
                ai_summary=analysis_data.get('context_summary', ''),
                file_type=uploaded_file.file_type,
                uploaded_by=getattr(owner, 'full_name', '') or getattr(owner, 'email', ''),
                uploaded_by_email=getattr(owner, 'email', ''),
                participants_count=len(analysis_data.get('role_summaries', []))
            )
            
            for pt in analysis_data.get('personalized_tasks', []):
                APITask.objects.create(
                    meeting_id=meeting_id_str,
                    task_id=str(uuid.uuid4()),
                    task_description=pt['task'],
                    assigned_to=pt['name'],
                    priority=pt['priority']
                )
                
            for rs in analysis_data.get('role_summaries', []):
                APIParticipant.objects.create(
                    meeting_id=meeting_id_str,
                    participant_id=str(uuid.uuid4()),
                    participant_name=rs['role'],
                    role=rs['role']
                )
                
            APIDocument.objects.create(
                meeting_id=meeting_id_str,
                doc_id=str(uuid.uuid4()),
                document_name=uploaded_file.original_filename,
                document_type=uploaded_file.file_type
            )
            ProcessingLog.objects.create(meeting=meeting, stage='API_SYNC', status='SUCCESS', message='Synced to external API tables')
        except Exception as sync_err:
            # Log sync failure but don't block the pipeline
            ProcessingLog.objects.create(meeting=meeting, stage='API_SYNC', status='FAILED', message=f'External sync failed: {str(sync_err)}')

        uploaded_file.processing_status = 'COMPLETED'
        uploaded_file.save()
        ProcessingLog.objects.create(meeting=meeting, stage='PIPELINE', status='SUCCESS', message='Processing pipeline completed')
        
    except Exception as e:
        ProcessingLog.objects.create(meeting=meeting, stage='PIPELINE', status='FAILED', message=str(e))
        if 'meeting' in locals():
            uploaded_file.processing_status = 'FAILED'
            uploaded_file.save()
        raise self.retry(exc=e)

@shared_task
def send_personalized_emails(meeting_id):
    """Task to generate personalized PDFs and send emails."""
    try:
        meeting = Meeting.objects.get(id=meeting_id)
        recipients = meeting.recipients.all()
        analysis = meeting.ai_analysis
        pdf_service = PDFService()
        email_service = EmailService()
        storage_service = SupabaseStorageService()
        
        role_summaries = [{"role": rs.role_name, "content": rs.summary_content} for rs in analysis.role_summaries.all()]
        
        for recipient in recipients:
            # Find personal tasks for this recipient
            personal_tasks = analysis.personalized_tasks.filter(person_name__icontains=recipient.name)
            
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                pdf_path = tmp.name
                
            pdf_service.generate_meeting_pdf(
                pdf_path, 
                meeting.title, 
                analysis.context_summary, 
                role_summaries, 
                personal_tasks=[{"task": t.task_description, "priority": t.priority, "deadline": t.deadline} for t in personal_tasks],
                recipient_name=recipient.name
            )
            
            # Upload to Supabase
            remote_path = f"reports/{meeting.id}/{recipient.email}.pdf"
            with open(pdf_path, 'rb') as f:
                storage_service.supabase.storage.from_(storage_service.bucket_name).upload(
                    path=remote_path,
                    file=f,
                    file_options={"cache-control": "3600", "upsert": "true"}
                )
            
            pdf_url = storage_service.get_public_url(remote_path)
            
            gen_pdf = GeneratedPDF.objects.create(
                meeting=meeting,
                recipient_name=recipient.name,
                recipient_email=recipient.email,
                pdf_type='PERSONALIZED',
                storage_path=remote_path,
                pdf_url=pdf_url,
                status='GENERATED'
            )
            
            # Send Email
            success, error = email_service.send_meeting_report(recipient.email, recipient.name, pdf_path, meeting.title)
            
            EmailLog.objects.create(
                recipient=recipient,
                pdf=gen_pdf,
                status='SENT' if success else 'FAILED',
                sent_at=datetime.now() if success else None,
                failed_reason=error or ""
            )
            
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
    except Exception as e:
        print(f"Error in send_personalized_emails: {str(e)}")
