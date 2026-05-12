# pyrefly: ignore [missing-import]
from supabase import create_client, Client
from django.conf import settings
import os

class SupabaseStorageService:
    def __init__(self):
        self.supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        self.bucket_name = 'meeting-assets'

    def upload_file(self, file_path, remote_path):
        """Uploads a local file to Supabase Storage."""
        with open(file_path, 'rb') as f:
            response = self.supabase.storage.from_(self.bucket_name).upload(
                path=remote_path,
                file=f,
                file_options={"cache-control": "3600", "upsert": "true"}
            )
        return response

    def get_public_url(self, remote_path):
        """Gets the public URL for a file in Supabase Storage."""
        return self.supabase.storage.from_(self.bucket_name).get_public_url(remote_path)

    def download_file(self, remote_path):
        """Downloads a file securely from Supabase Storage."""
        return self.supabase.storage.from_(self.bucket_name).download(remote_path)

    def delete_file(self, remote_path):
        """Deletes a file from Supabase Storage."""
        return self.supabase.storage.from_(self.bucket_name).remove([remote_path])
