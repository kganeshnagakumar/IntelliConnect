import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'intelliconnect_backend.settings')
django.setup()

from django.db import connection

queries = [
    "ALTER TABLE meetings_participant DROP CONSTRAINT IF EXISTS meetings_participant_meeting_id_4a769a34_fk_meetings_meeting_id;",
    "ALTER TABLE meetings_participant ADD CONSTRAINT meetings_participant_meeting_id_4a769a34_fk_meetings_meeting_id FOREIGN KEY (meeting_id) REFERENCES meetings_meeting(id) ON DELETE CASCADE;",
    
    "ALTER TABLE meetings_task DROP CONSTRAINT IF EXISTS meetings_task_meeting_id_b421a81f_fk_meetings_meeting_id;",
    "ALTER TABLE meetings_task ADD CONSTRAINT meetings_task_meeting_id_b421a81f_fk_meetings_meeting_id FOREIGN KEY (meeting_id) REFERENCES meetings_meeting(id) ON DELETE CASCADE;",
    
    "ALTER TABLE meetings_transcriptsegment DROP CONSTRAINT IF EXISTS meetings_transcriptsegment_meeting_id_51ba6437_fk_meetings_meeting_id;",
    "ALTER TABLE meetings_transcriptsegment ADD CONSTRAINT meetings_transcriptsegment_meeting_id_51ba6437_fk_meetings_meeting_id FOREIGN KEY (meeting_id) REFERENCES meetings_meeting(id) ON DELETE CASCADE;"
]

try:
    with connection.cursor() as cursor:
        for q in queries:
            cursor.execute(q)
    print("Successfully updated database constraints to ON DELETE CASCADE.")
except Exception as e:
    print("Error:", e)
