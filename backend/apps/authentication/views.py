from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserProfileSerializer

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

class VerifyTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # The SupabaseJWTAuthentication already verified the token
        return Response({"status": "valid", "user": UserProfileSerializer(request.user).data})
