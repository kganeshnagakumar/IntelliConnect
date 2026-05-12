from django.urls import path
from .views import MeView, VerifyTokenView

urlpatterns = [
    path('me', MeView.as_view(), name='auth-me'),
    path('verify-token', VerifyTokenView.as_view(), name='auth-verify-token'),
]
