from rest_framework import serializers
from .models import Meeting, UploadedFile, ProcessingLog
from apps.ai_processing.models import AIAnalysis, RoleSummary, PersonalizedTask

class RoleSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleSummary
        fields = ['role_name', 'summary_content']

class PersonalizedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalizedTask
        fields = ['person_name', 'task_description', 'priority', 'deadline', 'email']

class AIAnalysisSerializer(serializers.ModelSerializer):
    role_summaries = RoleSummarySerializer(many=True, read_only=True)
    personalized_tasks = PersonalizedTaskSerializer(many=True, read_only=True)

    class Meta:
        model = AIAnalysis
        fields = ['context_summary', 'overall_sentiment', 'status', 'role_summaries', 'personalized_tasks']

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['original_filename', 'file_type', 'file_size', 'upload_status', 'processing_status', 'uploaded_at']

class ProcessingLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessingLog
        fields = ['stage', 'status', 'message', 'created_at']

class MeetingSerializer(serializers.ModelSerializer):
    uploaded_file = UploadedFileSerializer(read_only=True)
    ai_analysis = AIAnalysisSerializer(read_only=True)
    processing_logs = ProcessingLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Meeting
        fields = ['id', 'title', 'description', 'owner', 'created_at', 'uploaded_file', 'ai_analysis', 'processing_logs']
        read_only_fields = ['owner']
