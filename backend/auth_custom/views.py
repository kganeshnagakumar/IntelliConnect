from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def save_user(request):
    """
    Saves or updates user info after successful Google login.
    In a production app, we would verify the token here using the client_secret.
    """
    email = request.data.get('email')
    name = request.data.get('name')
    avatar_url = request.data.get('avatar_url')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user, created = User.objects.get_or_create(email=email, defaults={'username': email})
    
    if created or user.first_name != name:
        user.first_name = name
        user.save()
        
    return Response({
        'message': 'User synced successfully',
        'is_new': created,
        'user': {
            'email': user.email,
            'name': user.first_name
        }
    }, status=status.HTTP_200_OK)
