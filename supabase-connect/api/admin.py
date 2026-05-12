from django.contrib import admin
from .models import Meeting, Participant, Task, Document

# Register your models here.

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('meeting_id', 'meeting_title', 'meeting_date', 'uploaded_by')

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('participant_id', 'participant_name', 'meeting', 'role', 'department')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_id', 'meeting', 'assigned_to', 'priority')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('doc_id', 'document_name', 'meeting', 'document_type')
