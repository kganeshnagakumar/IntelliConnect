from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from services.gemini_service import GeminiService
from apps.meetings.models import Meeting, UploadedFile
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

gemini = GeminiService()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def copilot_chat(request):
    """
    Copilot chat endpoint — powered by Gemini 3.1 Flash-Lite.
    POST /api/ai/copilot/
    Body: { "message": "...", "include_context": true }
    """
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    context = {}
    if request.data.get('include_context', True):
        # Inject recent meetings and tasks as context
        meetings = Meeting.objects.filter(owner=request.user).order_by('-created_at')[:5]
        context['recent_meetings'] = [
            {'title': m.title, 'created_at': str(m.created_at.date())}
            for m in meetings
        ]

    result = gemini.copilot_chat(message, context)
    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def summarize_meeting(request, meeting_id):
    """
    On-demand meeting summary.
    POST /api/ai/meetings/<meeting_id>/summarize/
    """
    try:
        meeting = Meeting.objects.get(id=meeting_id, owner=request.user)
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

    transcript = getattr(meeting, 'transcript', None)
    if not transcript or not transcript.cleaned_content:
        return Response({'error': 'No transcript available for this meeting'}, status=status.HTTP_400_BAD_REQUEST)

    summary = gemini.quick_summarize(transcript.cleaned_content)
    return Response({'summary': summary, 'meeting_title': meeting.title})
