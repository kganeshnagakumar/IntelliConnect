from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from api.models import Meeting, Participant, Task, Document
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Populate database with 50 sample records for each table'

    def handle(self, *args, **options):
        fake = Faker()
        self.stdout.write(self.style.SUCCESS('Starting to populate sample data...'))
        
        # Create 50 Meeting records
        self.stdout.write('Creating meetings...')
        meetings = []
        for i in range(50):
            meeting = Meeting.objects.create(
                meeting_id=f'MEET_{i+1:03d}',
                meeting_title=fake.sentence(nb_words=6),
                meeting_date=fake.date_between(start_date='-30d'),
                meeting_time=fake.time_object(),
                duration_minutes=random.choice([30, 45, 60, 90, 120]),
                meeting_context=fake.paragraph(nb_sentences=3),
                ai_summary=fake.paragraph(nb_sentences=5),
                role_based_summary=fake.paragraph(nb_sentences=5),
                custom_summary=fake.paragraph(nb_sentences=5),
                participants_count=random.randint(3, 15),
                docs_generated=random.randint(0, 5),
                file_type=random.choice(['mp4', 'wav', 'pdf', 'docx']),
                uploaded_by=fake.name(),
                uploaded_by_email=fake.email(),
            )
            meetings.append(meeting)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(meetings)} meetings'))
        
        # Create 50 Participant records
        self.stdout.write('Creating participants...')
        participants = []
        departments = ['HR', 'Finance', 'Tech', 'Sales', 'Marketing', 'Operations']
        roles = ['HR', 'Finance', 'Tech', 'Manager', 'Lead', 'Intern']
        
        for i in range(50):
            participant = Participant.objects.create(
                participant_id=f'PART_{i+1:03d}',
                meeting=random.choice(meetings),
                participant_name=fake.name(),
                participant_email=fake.email(),
                role=random.choice(roles),
                department=random.choice(departments),
                speaking_time=random.randint(0, 60),
                summary_sent=random.choice([True, False]),
                summary_sent_time=timezone.now() if random.choice([True, False]) else None,
            )
            participants.append(participant)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(participants)} participants'))
        
        # Create 50 Task records
        self.stdout.write('Creating tasks...')
        tasks = []
        priorities = ['High', 'Medium', 'Low']
        
        for i in range(50):
            task = Task.objects.create(
                task_id=f'TASK_{i+1:03d}',
                meeting=random.choice(meetings),
                role=random.choice(roles),
                task_description=fake.paragraph(nb_sentences=3),
                assigned_to=fake.name(),
                assigned_email=fake.email(),
                priority=random.choice(priorities),
                document_link=f'https://example.com/docs/{fake.word()}.pdf' if random.choice([True, False]) else None,
            )
            tasks.append(task)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(tasks)} tasks'))
        
        # Create 50 Document records
        self.stdout.write('Creating documents...')
        doc_types = ['MOM', 'Summary', 'Report', 'Notes']
        
        documents = []
        for i in range(50):
            document = Document.objects.create(
                doc_id=f'DOC_{i+1:03d}',
                meeting=random.choice(meetings),
                document_name=f'{fake.word()}_document.pdf',
                document_type=random.choice(doc_types),
                shared_to_email=fake.email(),
            )
            documents.append(document)
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(documents)} documents'))
        
        self.stdout.write(self.style.SUCCESS('\n✓ All sample data created successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Total records created: {len(meetings) + len(participants) + len(tasks) + len(documents)}'))
