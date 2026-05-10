from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Meeting, Task, Participant, TranscriptSegment, IntegratedIntelligence
from .serializers import MeetingSerializer, TaskSerializer, ParticipantSerializer, TranscriptSegmentSerializer
from .schemas import MeetingAnalysis
from .services.gemini_service import GeminiService
import random
import logging
from django.db.models import Count, Avg

import tempfile
import os
import json
from django.conf import settings

logger = logging.getLogger(__name__)

gemini_service = GeminiService()

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all().order_by('-created_at')
    serializer_class = MeetingSerializer

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        total_meetings = Meeting.objects.count()
        completed_tasks = Task.objects.filter(status='completed').count()
        pending_tasks = Task.objects.filter(status='pending').count()
        
        # Priority stats
        priority_stats = {
            'High': Meeting.objects.filter(priority='High').count(),
            'Medium': Meeting.objects.filter(priority='Medium').count(),
            'Low': Meeting.objects.filter(priority='Low').count(),
        }
        
        return Response({
            'total_meetings': total_meetings,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'priority_stats': priority_stats
        })

    @action(detail=False, methods=['get'])
    def analytics_stats(self, request):
        """
        Provides dynamic analytics data based on the database.
        """
        total_meetings = Meeting.objects.count()
        
        # Department distribution (mocked based on categories)
        dept_dist = Meeting.objects.values('category').annotate(count=Count('id'))
        
        # Efficiency Score (mocked as contribution average)
        avg_contribution = Participant.objects.aggregate(Avg('contribution_score'))['contribution_score__avg'] or 0.85
        
        # Intelligence categories (based on category counts)
        categories = Meeting.objects.values('category').annotate(percentage=Count('id'))
        
        # Activity trends (meetings per day for last 7 days)
        # For demo, we return the counts per category as a proxy
        activity_trends = [random.randint(40, 100) for _ in range(7)]
        
        return Response({
            'efficiency_score': round(avg_contribution * 100, 1),
            'ai_accuracy': 98.8, # Constant for now
            'department_distribution': list(dept_dist),
            'activity_trends': activity_trends,
            'categories': list(categories)
        })

    @action(detail=False, methods=['post'])
    def process_meeting(self, request):
        uploaded_file = request.FILES.get('file')
        category = request.data.get('category', 'General')
        settings_str = request.data.get('settings', '{}')
        
        if not uploaded_file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
            
        file_name = uploaded_file.name
        
        # Save file temporarily
        temp_path = ""
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file_name)[1]) as temp_file:
            for chunk in uploaded_file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name
            
        try:
            analysis_data = gemini_service.process_meeting_file(
                temp_path, 
                file_name, 
                category=category, 
                settings_str=settings_str
            )
            
            os.unlink(temp_path)
            
            # Instead of saving to the database, we return the parsed data to the frontend
            import random
            meeting_id = f"M{random.randint(100, 999)}"
            
            # Format tasks
            tasks_data = []
            for t in analysis_data.get('tasks', []):
                deadline_val = t.get('deadline')
                if deadline_val and isinstance(deadline_val, str) and len(deadline_val) == 10 and deadline_val.count('-') == 2:
                    pass
                else:
                    deadline_val = None
                tasks_data.append({
                    'employee_name': t.get('employee_name', 'Unknown')[:255],
                    'description': t.get('description', ''),
                    'deadline': deadline_val
                })
                
            # Format participants
            participants_data = []
            for p in analysis_data.get('participants', []):
                name_val = p.get('name', 'Unknown')[:255]
                default_email = f"{name_val.lower().replace(' ', '.')}@company.com"
                participants_data.append({
                    'name': name_val,
                    'role': p.get('role', 'Participant')[:255],
                    'email': p.get('email', default_email),
                    'contribution_score': float(p.get('contribution_score', 0.5))
                })
                
            # Format transcripts
            transcripts_data = []
            for tr in analysis_data.get('transcripts', []):
                transcripts_data.append({
                    'speaker': tr.get('speaker', 'Unknown')[:255],
                    'timestamp': tr.get('timestamp', '00:00:00')[:50],
                    'text': tr.get('text', '')
                })

            response_data = {
                'meeting_id': meeting_id,
                'title': file_name,
                'category': category,
                'status': 'completed',
                'priority': 'Medium',
                'duration': '45:00',
                'summary': analysis_data.get('summary', ''),
                'key_decisions': analysis_data.get('key_decisions', ''),
                'ai_insights': analysis_data.get('ai_insights', ''),
                'tasks': tasks_data,
                'participants': participants_data,
                'transcripts': transcripts_data,
                'tasks_count': len(tasks_data),
                'participants_count': len(participants_data)
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception("Error processing meeting")
            if temp_path and os.path.exists(temp_path):
                os.unlink(temp_path)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def save_analysis(self, request):
        data = request.data
        try:
            meeting = Meeting.objects.create(
                meeting_id=data.get('meeting_id', 'M000'),
                title=data.get('title', 'Unknown Meeting'),
                category=data.get('category', 'General'),
                status='completed',
                priority=data.get('priority', 'Medium'),
                duration=data.get('duration', '45:00'),
                key_decisions=data.get('key_decisions', ''),
                ai_insights=data.get('ai_insights', ''),
                summary=data.get('summary', '')
            )
            
            # Create a mapping of participant names to their emails
            participant_emails = {}
            for p in data.get('participants', []):
                p_name = p.get('name', 'Unknown')[:255]
                p_email = p.get('email', '')
                # Map both the full name and the first name (as tasks often just use the first name)
                participant_emails[p_name.lower()] = p_email
                participant_emails[p_name.split(' ')[0].lower()] = p_email
            
            tasks_list = []
            for t in data.get('tasks', []):
                emp_name = t.get('employee_name', 'Unknown')[:255]
                emp_email = participant_emails.get(emp_name.lower())
                if not emp_email:
                    for full_name, mail in participant_emails.items():
                        if emp_name.lower() in full_name:
                            emp_email = mail
                            break
                            
                task_obj = Task.objects.create(
                    meeting=meeting, 
                    employee_name=emp_name,
                    description=t.get('description', ''),
                    deadline=t.get('deadline'),
                    email=emp_email
                )
                tasks_list.append({
                    'employee_name': emp_name,
                    'description': t.get('description', ''),
                    'status': 'pending',
                    'email': emp_email
                })
                
            participants_list = []
            for p in data.get('participants', []):
                p_obj = Participant.objects.create(
                    meeting=meeting,
                    name=p.get('name', 'Unknown')[:255],
                    role=p.get('role', 'Participant')[:255],
                    email=p.get('email', ''),
                    contribution_score=float(p.get('contribution_score', 0.5))
                )
                participants_list.append({
                    'id': p_obj.id,
                    'name': p_obj.name,
                    'role': p_obj.role,
                    'email': p_obj.email
                })
                
            for tr in data.get('transcripts', []):
                TranscriptSegment.objects.create(
                    meeting=meeting,
                    speaker=tr.get('speaker', 'Unknown')[:255],
                    timestamp=tr.get('timestamp', '00:00:00')[:50],
                    text=tr.get('text', '')
                )

            # Create IntegratedIntelligence entries for Supabase HTTP Triggers
            # One row per participant to allow person-specific triggers
            for p_data in participants_list:
                # Find tasks for this person by matching name
                person_tasks = [t for t in tasks_list if p_data['name'].lower().startswith(t['employee_name'].lower().split(' ')[0])]
                
                tasks_str = "\n".join([f"- {t['description']}" for t in person_tasks])
                deadlines_str = "\n".join([f"{t['description']}: {t.get('deadline', 'N/A')}" for t in person_tasks])

                IntegratedIntelligence.objects.create(
                    meeting_id=meeting.meeting_id,
                    meeting_title=meeting.title,
                    duration=meeting.duration,
                    person_name=p_data['name'],
                    person_id=str(p_data['id']), # Using the actual database ID
                    role=p_data['role'],
                    person_mail=p_data['email'],
                    description=meeting.summary,
                    tasks_assigned=tasks_str if tasks_str else "No tasks assigned.",
                    deadlines=deadlines_str if deadlines_str else "N/A",
                    tasks_json=person_tasks,
                    participants_json=participants_list
                )
                
            serializer = self.get_serializer(meeting)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Error saving analysis")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
