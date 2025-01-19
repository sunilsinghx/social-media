from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

# Importing views
from .views import get_user_profile_data, CustomTokenObtainPairView, CustomTokenRefreshView, register, authenticated, toggleFollow, get_users_posts, toggleLike, create_post, get_posts, search_users, logout, update_user_details

# URL patterns for the app
urlpatterns = [
    # Path for obtaining JWT token (Login)
    path('token/', CustomTokenObtainPairView.as_view(), name='login'),
    
    # Path for refreshing the JWT token (Token Refresh)
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='refresh'),
    
    # Path for user registration
    path("register/", register),
    
    # Path for getting user profile data by primary key (pk)
    path("user_data/<str:pk>/", get_user_profile_data),
    
    # Path for checking if the user is authenticated
    path("authenticated/", authenticated),
    
    # Path for toggling the follow status between users
    path("toggle_follow/", toggleFollow),
    
    # Path for getting a user's posts by primary key (pk)
    path("posts/<str:pk>/", get_users_posts),
    
    # Path for toggling the like status on a post
    path("toggleLike/", toggleLike),
    
    # Path for creating a new post
    path("create_post/", create_post),
    
    # Path for retrieving posts (all posts )
    path("get_posts/", get_posts),
    
    # Path for searching users (e.g., by username)
    path("search/", search_users),
    
    # Path for updating user details (e.g., profile info)
    path("update_user/", update_user_details),
    
    # Path for user logout
    path("logout/", logout),
] + static(
    settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
)

