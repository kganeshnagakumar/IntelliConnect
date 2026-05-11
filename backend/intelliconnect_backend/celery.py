import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "intelliconnect_backend.settings")

app = Celery("intelliconnect_backend")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
