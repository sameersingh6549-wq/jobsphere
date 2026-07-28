from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.api_views import (
    RegisterAPIView,
    CustomTokenObtainPairView,
    UserDetailAPIView,
    UserProfileAPIView
)

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='api_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='api_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='api_token_refresh'),
    path('me/', UserDetailAPIView.as_view(), name='api_user_detail'),
    path('profile/', UserProfileAPIView.as_view(), name='api_user_profile'),
]
