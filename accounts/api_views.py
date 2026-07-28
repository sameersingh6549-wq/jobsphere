from rest_framework import generics, status, permissions, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from accounts.serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer,
    CustomTokenObtainPairSerializer
)
from accounts.models import Profile
from accounts.emails import send_welcome_email

class RegisterAPIView(generics.CreateAPIView):
    """
    API view to register a new User (Candidate or Recruiter).
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Trigger Welcome Email asynchronously
        send_welcome_email(user)

        user_data = UserSerializer(user).data
        return Response({
            "message": "User registered successfully.",
            "user": user_data
        }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT Token Obtain View returning access, refresh tokens, and user metadata.
    """
    serializer_class = CustomTokenObtainPairSerializer

class UserDetailAPIView(APIView):
    """
    API view to retrieve currently authenticated user details.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserProfileAPIView(APIView):
    """
    API view to retrieve and update logged in user's Profile.
    Supports multipart/form-data for photo & resume file uploads.
    """
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully.",
                "profile": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
