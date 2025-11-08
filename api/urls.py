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
    CategoryListView,
    ListingListView,
    ListingDetailView,
    ListingCreateView,
    ListingUpdateView,
    ListingDeleteView,
    MyListingsView,
    AdminStatsView,
    AdminListingsView,
    AdminModerationView,
    AdminUsersListView,
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
    
    # Category endpoints
    path("categories/", CategoryListView.as_view(), name="category-list"),
    
    # Listing endpoints
    path("listings/", ListingListView.as_view(), name="listing-list"),
    path("listings/my/", MyListingsView.as_view(), name="my-listings"),
    path("listings/<int:id>/", ListingDetailView.as_view(), name="listing-detail"),
    path("listings/create/", ListingCreateView.as_view(), name="listing-create"),
    path("listings/<int:id>/update/", ListingUpdateView.as_view(), name="listing-update"),
    path("listings/<int:id>/delete/", ListingDeleteView.as_view(), name="listing-delete"),
    
    # Admin endpoints
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("admin/listings/", AdminListingsView.as_view(), name="admin-listings"),
    path("admin/listings/<int:id>/moderate/", AdminModerationView.as_view(), name="admin-moderate"),
    path("admin/users/", AdminUsersListView.as_view(), name="admin-users"),
]
