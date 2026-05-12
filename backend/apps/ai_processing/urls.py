from django.urls import path
from . import views

urlpatterns = [
    path('copilot/', views.copilot_chat, name='copilot-chat'),
    path('meetings/<uuid:meeting_id>/summarize/', views.summarize_meeting, name='meeting-summarize'),
]
