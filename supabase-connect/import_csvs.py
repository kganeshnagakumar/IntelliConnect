import csv
from api.models import Meeting, Participant, Task, Document
from datetime import datetime

# Delete existing data (Django ORM handles cascading)
Document.objects.all().delete()
Task.objects.all().delete()
Participant.objects.all().delete()
Meeting.objects.all().delete()

print("Deleted old data.")

base_dir = '/home/pavan/Documents/projects/intelli3/'

# Import Meetings
with open(f'{base_dir}meetings.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        Meeting.objects.create(
            meeting_id=row['meeting_id'],
            meeting_title=row['meeting_title'],
            meeting_date=row['meeting_date'],
            meeting_time=row['meeting_time'],
            duration_minutes=int(row['duration_minutes']),
            meeting_context=row['meeting_context'],
            ai_summary=row['ai_summary'],
            role_based_summary=row['role_based_summary'],
            custom_summary=row['custom_summary'],
            participants_count=int(row['participants_count']),
            docs_generated=int(row['docs_generated']),
            file_type=row['file_type'],
            uploaded_by=row['uploaded_by'],
            uploaded_by_email=row['uploaded_by_email']
        )
print("Imported meetings.")

# Import Participants
with open(f'{base_dir}participants.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meeting = Meeting.objects.get(meeting_id=row['meeting_id'])
        Participant.objects.create(
            participant_id=row['participant_id'],
            meeting=meeting,
            participant_name=row['participant_name'],
            email=row['email'],
            role=row['role'],
            department=row['department'],
            speaking_time=int(row['speaking_time']) if row['speaking_time'] else None,
            summary_sent=row['summary_sent'].lower() == 'true',
        )
print("Imported participants.")

# Import Tasks
with open(f'{base_dir}tasks.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meeting = Meeting.objects.get(meeting_id=row['meeting_id'])
        Task.objects.create(
            task_id=row['task_id'],
            meeting=meeting,
            role=row['role'],
            task_description=row['task_description'],
            assigned_to=row['assigned_to'],
            assigned_email=row['assigned_email'],
            priority=row['priority'],
            document_link=row['document_link']
        )
print("Imported tasks.")

# Import Documents
with open(f'{base_dir}documents.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meeting = Meeting.objects.get(meeting_id=row['meeting_id'])
        Document.objects.create(
            doc_id=row['doc_id'],
            meeting=meeting,
            document_name=row['document_name'],
            document_type=row['document_type'],
            shared_to_email=row['shared_to_email']
        )
print("Imported documents.")
print("All done!")
