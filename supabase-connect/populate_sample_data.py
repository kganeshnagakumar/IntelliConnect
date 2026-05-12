#!/usr/bin/env python
"""
Direct SQL insertion script to populate Supabase with sample data.
Run this script to insert 50 records for each table.
"""

import psycopg2
from psycopg2.extras import execute_values
from faker import Faker
import random
from datetime import datetime, timedelta
import os

# Database configuration from environment or settings
DB_HOST = 'db.rcachvjnenijulfgpmbd.supabase.co'
DB_PORT = 5432
DB_NAME = 'postgres'
DB_USER = 'postgres'
DB_PASSWORD = 'Pavanmamidi1432@'

fake = Faker()

def connect_db():
    """Connect to Supabase PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        raise

def populate_meetings(conn):
    """Insert 50 meeting records"""
    print("Creating 50 meeting records...")
    cursor = conn.cursor()
    
    meetings_data = []
    meeting_ids = []
    
    for i in range(50):
        meeting_id = f'MEET_{i+1:03d}'
        meeting_ids.append(meeting_id)
        
        meetings_data.append((
            meeting_id,
            fake.sentence(nb_words=6),
            fake.date_between(start_date='-30d'),
            fake.time_object(),
            random.choice([30, 45, 60, 90, 120]),
            fake.paragraph(nb_sentences=3),
            fake.paragraph(nb_sentences=5),
            fake.paragraph(nb_sentences=5),
            fake.paragraph(nb_sentences=5),
            random.randint(3, 15),
            random.randint(0, 5),
            random.choice(['mp4', 'wav', 'pdf', 'docx']),
            fake.name(),
            fake.email(),
            datetime.now(),
        ))
    
    insert_query = """
    INSERT INTO api_meeting (
        meeting_id, meeting_title, meeting_date, meeting_time, duration_minutes,
        meeting_context, ai_summary, role_based_summary, custom_summary,
        participants_count, docs_generated, file_type, uploaded_by, uploaded_by_email,
        created_at
    ) VALUES %s
    """
    
    execute_values(cursor, insert_query, meetings_data)
    conn.commit()
    cursor.close()
    print(f"✓ Created 50 meetings")
    return meeting_ids

def populate_participants(conn, meeting_ids):
    """Insert 50 participant records"""
    print("Creating 50 participant records...")
    cursor = conn.cursor()
    
    departments = ['HR', 'Finance', 'Tech', 'Sales', 'Marketing', 'Operations']
    roles = ['HR', 'Finance', 'Tech', 'Manager', 'Lead', 'Intern']
    
    participants_data = []
    
    for i in range(50):
        participant_id = f'PART_{i+1:03d}'
        
        # Get meeting ID from database first
        cursor.execute("SELECT id FROM api_meeting WHERE meeting_id = %s LIMIT 1", (random.choice(meeting_ids),))
        result = cursor.fetchone()
        meeting_fk_id = result[0] if result else None
        
        summary_sent = random.choice([True, False])
        
        participants_data.append((
            participant_id,
            meeting_fk_id,
            fake.name(),
            fake.email(),
            random.choice(roles),
            random.choice(departments),
            random.randint(0, 60),
            summary_sent,
            datetime.now() if summary_sent else None,
        ))
    
    insert_query = """
    INSERT INTO api_participant (
        participant_id, meeting_id, participant_name, participant_email,
        role, department, speaking_time, summary_sent, summary_sent_time
    ) VALUES %s
    """
    
    execute_values(cursor, insert_query, participants_data)
    conn.commit()
    cursor.close()
    print(f"✓ Created 50 participants")

def populate_tasks(conn, meeting_ids):
    """Insert 50 task records"""
    print("Creating 50 task records...")
    cursor = conn.cursor()
    
    roles = ['HR', 'Finance', 'Tech', 'Manager', 'Lead', 'Intern']
    priorities = ['High', 'Medium', 'Low']
    
    tasks_data = []
    
    for i in range(50):
        task_id = f'TASK_{i+1:03d}'
        
        # Get meeting ID from database
        cursor.execute("SELECT id FROM api_meeting WHERE meeting_id = %s LIMIT 1", (random.choice(meeting_ids),))
        result = cursor.fetchone()
        meeting_fk_id = result[0] if result else None
        
        tasks_data.append((
            task_id,
            meeting_fk_id,
            random.choice(roles),
            fake.paragraph(nb_sentences=3),
            fake.name(),
            fake.email(),
            random.choice(priorities),
            datetime.now(),
            f'https://example.com/docs/{fake.word()}.pdf' if random.choice([True, False]) else None,
        ))
    
    insert_query = """
    INSERT INTO api_task (
        task_id, meeting_id, role, task_description, assigned_to,
        assigned_email, priority, generated_time, document_link
    ) VALUES %s
    """
    
    execute_values(cursor, insert_query, tasks_data)
    conn.commit()
    cursor.close()
    print(f"✓ Created 50 tasks")

def populate_documents(conn, meeting_ids):
    """Insert 50 document records"""
    print("Creating 50 document records...")
    cursor = conn.cursor()
    
    doc_types = ['MOM', 'Summary', 'Report', 'Notes']
    
    documents_data = []
    
    for i in range(50):
        doc_id = f'DOC_{i+1:03d}'
        
        # Get meeting ID from database
        cursor.execute("SELECT id FROM api_meeting WHERE meeting_id = %s LIMIT 1", (random.choice(meeting_ids),))
        result = cursor.fetchone()
        meeting_fk_id = result[0] if result else None
        
        documents_data.append((
            doc_id,
            meeting_fk_id,
            f'{fake.word()}_document.pdf',
            random.choice(doc_types),
            datetime.now(),
            fake.email(),
        ))
    
    insert_query = """
    INSERT INTO api_document (
        doc_id, meeting_id, document_name, document_type, generated_at, shared_to_email
    ) VALUES %s
    """
    
    execute_values(cursor, insert_query, documents_data)
    conn.commit()
    cursor.close()
    print(f"✓ Created 50 documents")

def main():
    """Main function to populate all sample data"""
    try:
        print("=" * 60)
        print("Supabase Sample Data Population Script")
        print("=" * 60)
        
        conn = connect_db()
        print("✓ Connected to Supabase database\n")
        
        meeting_ids = populate_meetings(conn)
        populate_participants(conn, meeting_ids)
        populate_tasks(conn, meeting_ids)
        populate_documents(conn, meeting_ids)
        
        conn.close()
        
        print("\n" + "=" * 60)
        print("✓ All sample data created successfully!")
        print("✓ Total records created: 200 (50 per table)")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        raise

if __name__ == '__main__':
    main()
