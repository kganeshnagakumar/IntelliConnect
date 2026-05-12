import csv
from api.models import Meeting, Participant, Task, Document

base_dir = '/home/pavan/Documents/projects/intelli3/'

# Delete old data
Document.objects.all().delete()
Task.objects.all().delete()
Participant.objects.all().delete()
Meeting.objects.all().delete()
print("Deleted old data.")

# Import Meetings
meetings_to_create = []
with open(f'{base_dir}meetings.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meetings_to_create.append(Meeting(
            meeting_id=row['meeting_id'],
            meeting_title=row['meeting_title'],
            meeting_date=row['meeting_date'],
            meeting_time=row['meeting_time'],
            duration_minutes=int(row['duration_minutes']) if row['duration_minutes'] else 0,
            meeting_context=row['meeting_context'],
            ai_summary=row['ai_summary'],
            role_based_summary=row['role_based_summary'],
            custom_summary=row['custom_summary'],
            participants_count=int(row['participants_count']) if row['participants_count'] else 0,
            docs_generated=int(row['docs_generated']) if row['docs_generated'] else 0,
            file_type=row['file_type'],
            uploaded_by=row['uploaded_by'],
            uploaded_by_email=row['uploaded_by_email']
        ))
Meeting.objects.bulk_create(meetings_to_create)
print(f"Imported {len(meetings_to_create)} meetings.")

# Map meeting_ids to actual Meeting instances to avoid N queries
meeting_map = {m.meeting_id: m for m in Meeting.objects.all()}

# Import Participants
participants_to_create = []
with open(f'{base_dir}participants.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['meeting_id'] in meeting_map:
            participants_to_create.append(Participant(
                participant_id=row['participant_id'],
                meeting=meeting_map[row['meeting_id']],
                participant_name=row['participant_name'],
                participant_email=row['participant_email'],
                role=row['role'],
                department=row['department'],
                speaking_time=int(float(row['speaking_time'])) if row['speaking_time'] else None,
                summary_sent=str(row['summary_sent']).lower() == 'true',
            ))
Participant.objects.bulk_create(participants_to_create)
print(f"Imported {len(participants_to_create)} participants.")

# Import Tasks
tasks_to_create = []
with open(f'{base_dir}tasks.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['meeting_id'] in meeting_map:
            tasks_to_create.append(Task(
                task_id=row['task_id'],
                meeting=meeting_map[row['meeting_id']],
                role=row['role'],
                task_description=row['task_description'],
                assigned_to=row['assigned_to'],
                assigned_email=row['assigned_email'],
                priority=row['priority'],
                document_link=row.get('document_link', '')
            ))
Task.objects.bulk_create(tasks_to_create)
print(f"Imported {len(tasks_to_create)} tasks.")

# Import Documents
docs_to_create = []
with open(f'{base_dir}documents.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['meeting_id'] in meeting_map:
            docs_to_create.append(Document(
                doc_id=row['doc_id'],
                meeting=meeting_map[row['meeting_id']],
                document_name=row['document_name'],
                document_type=row['document_type'],
                shared_to_email=row['shared_to_email']
            ))
Document.objects.bulk_create(docs_to_create)
print(f"Imported {len(docs_to_create)} documents.")

print("All done!")
