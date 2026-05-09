from rest_framework import serializers
from .models import Meeting, Task, Participant, TranscriptSegment

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

class TranscriptSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptSegment
        fields = '__all__'

class MeetingSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    participants = ParticipantSerializer(many=True, read_only=True)
    transcripts = TranscriptSegmentSerializer(many=True, read_only=True)
    tasks_count = serializers.IntegerField(source='tasks.count', read_only=True)
    participants_count = serializers.IntegerField(source='participants.count', read_only=True)

    class Meta:
        model = Meeting
        fields = [
            'id', 'meeting_id', 'title', 'summary', 'category', 
            'status', 'created_at', 'video_url', 'audio_url', 
            'transcript_url', 'priority', 'duration', 'tasks_count', 
            'participants_count', 'key_decisions', 'ai_insights', 'tasks', 'participants', 'transcripts'
        ]
