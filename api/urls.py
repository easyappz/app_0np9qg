from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    HelloView,
    RegisterView,
    LoginView,
    LogoutView,
    CurrentUserView,
    UserProfileView,
    UserDetailView,
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    
    # Authentication endpoints
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
    path("auth/profile/", UserProfileView.as_view(), name="user-profile"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    
    # User endpoints
    path("users/<int:id>/", UserDetailView.as_view(), name="user-detail"),
]
