from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Meeting, UploadedFile
from .serializers import MeetingSerializer, UploadedFileSerializer
from tasks.processing_tasks import process_meeting_pipeline, send_personalized_emails
from services.supabase_storage import SupabaseStorageService
import uuid

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@method_decorator(csrf_exempt, name='dispatch')
class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        title = request.data.get('title', 'Untitled Meeting')
        file_obj = request.FILES.get('file')
        
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Create Meeting
        meeting = Meeting.objects.create(
            title=title,
            owner=request.user
        )

        # 2. Basic validation
        allowed_extensions = ['mp3', 'wav', 'm4a', 'vtt', 'txt', 'pdf', 'mp4']
        ext = file_obj.name.split('.')[-1].lower()
        if ext not in allowed_extensions:
            return Response({"error": f"Unsupported file type .{ext}"}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Save locally temporarily
        import os
        from django.core.files.storage import default_storage
        from django.core.files.base import ContentFile
        
        temp_filename = f'tmp/{uuid.uuid4()}_{file_obj.name}'
        full_temp_path = os.path.join(settings.MEDIA_ROOT, temp_filename)
        os.makedirs(os.path.dirname(full_temp_path), exist_ok=True)
        
        temp_path = default_storage.save(temp_filename, ContentFile(file_obj.read()))

        # 4. Upload to Supabase Storage
        storage_service = SupabaseStorageService()
        safe_filename = f"{uuid.uuid4()}.{ext}"
        remote_path = f"uploads/{meeting.id}/{safe_filename}"
        
        try:
            storage_service.upload_file(full_temp_path, remote_path)
            
            # 5. Create UploadedFile record
            uploaded_file = UploadedFile.objects.create(
                meeting=meeting,
                original_filename=file_obj.name,
                storage_path=remote_path,
                file_type=ext,
                mime_type=file_obj.content_type,
                file_size=file_obj.size,
                upload_status='UPLOADED',
                processing_status='QUEUED'
            )

            # 6. Trigger Pipeline
            process_meeting_pipeline.delay(meeting.id)

        finally:
            # Cleanup temp file
            if os.path.exists(full_temp_path):
                os.remove(full_temp_path)

        return Response(MeetingSerializer(meeting).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def recipients(self, request, pk=None):
        meeting = self.get_object()
        emails = request.data.get('emails', []) # List of strings or objects
        
        from apps.notifications.models import EmailRecipient
        for item in emails:
            email = item.get('email') if isinstance(item, dict) else item
            name = item.get('name', '') if isinstance(item, dict) else ''
            EmailRecipient.objects.update_or_create(
                meeting=meeting, email=email, defaults={'name': name, 'source': 'MANUAL'}
            )
        
        return Response({"status": "Recipients updated"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def send_reports(self, request, pk=None):
        meeting = self.get_object()
        send_personalized_emails.delay(meeting.id)
        return Response({"status": "Emails queued"}, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=['patch'])
    def save_analysis(self, request, pk=None):
        meeting = self.get_object()
        data = request.data
        analysis = meeting.ai_analysis
        
        if not analysis:
            return Response({"error": "No AI analysis found"}, status=status.HTTP_404_NOT_FOUND)
            
        # 1. Update Context Summary
        if 'context_summary' in data:
            analysis.context_summary = data['context_summary']
            analysis.save()
            
        # 2. Update Personalized Tasks (specifically emails)
        tasks_data = data.get('personalized_tasks', [])
        for task_item in tasks_data:
            # Match by person_name and task_description
            task = analysis.personalized_tasks.filter(
                person_name=task_item.get('person_name'),
                task_description=task_item.get('task_description')
            ).first()
            if task:
                task.email = task_item.get('email')
                task.save()
                
        # 3. Sync to External API Tables
        from apps.meetings.models import APIMeeting, APITask
        api_meeting = APIMeeting.objects.filter(meeting_id=str(meeting.id)).order_by('-created_at').first()
        if api_meeting:
            api_meeting.ai_summary = analysis.context_summary
            api_meeting.save()
            
            for task_item in tasks_data:
                api_task = APITask.objects.filter(
                    meeting_id=str(meeting.id),
                    assigned_to=task_item.get('person_name'),
                    task_description=task_item.get('task_description')
                ).first()
                if api_task:
                    # Sync any updates
                    api_task.assigned_email = task_item.get('email')
                    api_task.save()
                
        return Response({"status": "Analysis saved successfully and synced"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def update_summary(self, request, pk=None):
        meeting = self.get_object()
        new_summary = request.data.get('context_summary')
        if hasattr(meeting, 'ai_analysis') and meeting.ai_analysis:
            if new_summary is not None:
                meeting.ai_analysis.context_summary = new_summary
                meeting.ai_analysis.save()
            return Response({"status": "Summary updated"}, status=status.HTTP_200_OK)
        return Response({"error": "No AI analysis found for this meeting"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='api-documents')
    def api_documents(self, request):
        """Returns all documents from the api_document table, enriched with meeting AI content."""
        from apps.meetings.models import APIDocument
        docs = APIDocument.objects.all().order_by('-generated_at')
        data = []
        for doc in docs:
            # Attempt to enrich with meeting AI analysis
            meeting_title = ''
            ai_content = ''
            try:
                if doc.meeting_id:
                    meeting = Meeting.objects.filter(id=doc.meeting_id).first()
                    if meeting:
                        meeting_title = meeting.title
                        if hasattr(meeting, 'ai_analysis') and meeting.ai_analysis:
                            analysis = meeting.ai_analysis
                            parts = []
                            if analysis.context_summary:
                                parts.append(f"SUMMARY\n{analysis.context_summary}")
                            tasks = analysis.personalized_tasks.all() if hasattr(analysis, 'personalized_tasks') else []
                            if tasks:
                                parts.append("ACTION ITEMS")
                                for t in tasks:
                                    parts.append(f"- {t.person_name}: {t.task_description} [{t.priority}]")
                            roles = analysis.role_summaries.all() if hasattr(analysis, 'role_summaries') else []
                            if roles:
                                parts.append("ROLE INSIGHTS")
                                for r in roles:
                                    parts.append(f"[{r.role_name}]\n{r.summary_content}")
                            ai_content = '\n\n'.join(parts)
            except Exception:
                pass
            data.append({
                'id': doc.id,
                'doc_id': doc.doc_id or '',
                'meeting_id': doc.meeting_id or '',
                'meeting_title': meeting_title,
                'document_name': doc.document_name or '',
                'document_type': doc.document_type or '',
                'generated_at': str(doc.generated_at) if doc.generated_at else '',
                'shared_to_email': doc.shared_to_email or '',
                'ai_content': ai_content,
            })
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['patch'], url_path='api-documents/(?P<doc_id>[^/.]+)/rename')
    def rename_document(self, request, doc_id=None):
        """Rename a document in the api_document table."""
        from apps.meetings.models import APIDocument
        try:
            doc = APIDocument.objects.get(id=doc_id)
            new_name = request.data.get('document_name', '').strip()
            if not new_name:
                return Response({'error': 'Name cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
            doc.document_name = new_name
            doc.save(update_fields=['document_name'])
            return Response({'status': 'renamed', 'document_name': doc.document_name})
        except APIDocument.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['patch'], url_path='api-documents/(?P<doc_id>[^/.]+)/share')
    def share_document(self, request, doc_id=None):
        """Update the shared_to_email field for a document."""
        from apps.meetings.models import APIDocument
        try:
            doc = APIDocument.objects.get(id=doc_id)
            email = request.data.get('email', '').strip()
            doc.shared_to_email = email
            doc.save(update_fields=['shared_to_email'])
            return Response({'status': 'shared', 'shared_to_email': doc.shared_to_email})
        except APIDocument.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
