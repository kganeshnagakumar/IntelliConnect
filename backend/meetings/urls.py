from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeetingViewSet, TaskViewSet, ParticipantViewSet

router = DefaultRouter()
router.register(r'meetings', MeetingViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'participants', ParticipantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
