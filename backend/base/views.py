from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import MyUser, Post
from .serializers import MyUserProfileSerializer, UserRegisterSerializer, PostSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# View to check if the user is authenticated
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated to access this view
def authenticated(request):
    return Response("Authenticated!")  # Return a success message if the user is authenticated

# REGISTER
@api_view(["POST"])
def register(request):
    # Use the UserRegisterSerializer to validate the provided data
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # Save the new user to the database
        return Response(serializer.data)  # Return the serialized user data as a response
    return Response(serializer.errors)  # If validation fails, return errors

# Custom view for token generation (JWT authentication)
# LOGIN 
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            # Call the original TokenObtainPairView to get the tokens
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            
            # Extract the access and refresh tokens from the response
            access_token = tokens['access']
            refresh_token = tokens['refresh']
            username = request.data['username']
            
            # Retrieve the user details from the database
            try:
                user = MyUser.objects.get(username=username)
            except MyUser.DoesNotExist:
                return Response({"error": "User Does Not Exist"})  # Handle case where the user does not exist

            res = Response()
            
            # Include user details in the response (bio, email, etc.)
            res.data = {"success": True, "username": user.username, "bio": user.bio, "email": user.email}
            
            # Set JWT tokens in cookies for use in future requests
            res.set_cookie(key='access_token', value=access_token, httponly=True, secure=True, samesite='None', path='/')
            res.set_cookie(key='refresh_token', value=refresh_token, httponly=True, secure=True, samesite='None', path='/')
            
            return res  # Return the response with user data and cookies
        except:
            return Response({"success": False})  # Return an error if something goes wrong

# Custom view for refreshing tokens using the refresh token from cookies
# REFRSH TOKEN
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            # Get the refresh token from the cookies
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            
            # Call the original TokenRefreshView to get the new access token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            
            # Extract the new access token
            access_token = tokens['access']
            res = Response()
            
            # Return a success response with the new access token
            res.data = {"success": True}
            
            # Set the new access token in the cookies
            res.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="None", path="/")
            
            return res
        except:
            return Response({"success": False})  # Return error if something goes wrong

# View to logout the user by deleting the authentication cookies
# LOGOUT
@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before logging out
def logout(request):
    try:
        res = Response({"success": True})
        # Delete the access and refresh tokens from the cookies
        res.delete_cookie("access_token", path="/", samesite="None")
        res.delete_cookie("refresh_token", path="/", samesite="None")
        return res  # Return a success response after deleting the cookies
    except:
        return Response({"success": False})  # Return error if something goes wrong

#GET USER PROFILE DATA
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before accessing profile
def get_user_profile_data(request, pk):
    try:
        user = MyUser.objects.get(username=pk)  # Retrieve the user by their username (pk)
        serializer = MyUserProfileSerializer(user, many=False)  # Serialize user profile data
        
        # Check if the current user is following the target user
        following = request.user in user.followers.all()
        
        # Return user data with additional information like whether the user is viewing their own profile
        return Response({**serializer.data, 'is_our_profile': request.user.username == user.username, 'following': following})
    except:
        return Response({"error": "Error getting User data"})  # Return error if something goes wrong

# View to toggle follow/unfollow a user
@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before following/unfollowing
def toggleFollow(request):
    try:
        # Get the current user and the user to follow from the request
        my_user = MyUser.objects.get(username=request.user.username)
        user_to_follow = MyUser.objects.get(username=request.data['username'])
        
        # Toggle follow/unfollow the user
        if my_user in user_to_follow.followers.all():
            user_to_follow.followers.remove(my_user)  # Unfollow the user
            return Response({"now_following": False})
        else:
            user_to_follow.followers.add(my_user)  # Follow the user
            return Response({"now_following": True})
    except:
        return Response({"error": "Error following user"})  # Return error if something goes wrong

# View to get the posts of a specific user
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before viewing posts
def get_users_posts(request, pk):
    try:
        user = MyUser.objects.get(username=pk)  # Retrieve user by their username
        my_user = MyUser.objects.get(username=request.user.username)  # Get the current authenticated user
        posts = user.posts.all().order_by('-created_at')  # Get all posts by the user, ordered by creation date
        serializer = PostSerializer(posts, many=True)  # Serialize the posts data
        
        # Add a 'liked' field to each post based on whether the current user has liked the post
        data = [{"liked": my_user.username in post['likes'], **post} for post in serializer.data]
        return Response(data)
    except:
        return Response({"error": "Error fetching posts"})  # Return error if something goes wrong

# View to like/unlike a post
@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before liking/unliking a post
def toggleLike(request):
    try:
        post = Post.objects.get(id=request.data['id'])  # Retrieve post by its ID
        user = MyUser.objects.get(username=request.user.username)  # Get the current authenticated user
        
        # Toggle like/unlike on the post
        if user in post.likes.all():
            post.likes.remove(user)  # Unlike the post
            return Response({'now_liked': False})
        else:
            post.likes.add(user)  # Like the post
            return Response({'now_liked': True})
    except:
        return Response({"error": "Failed to Like Post"})  # Return error if something goes wrong

# CREATE POST
@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before creating a post
def create_post(request):
    try:
        user = MyUser.objects.get(username=request.user.username)  # Get the current authenticated user
        post = Post.objects.create(user=user, description=request.data['description'])  # Create a new post
        serializer = PostSerializer(post, many=False)  # Serialize the post data
        return Response(serializer.data)  # Return the serialized post data
    except:
        return Response({"error": "Error creating Post"})  # Return error if something goes wrong

# View to get all posts with pagination
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before fetching posts
def get_posts(request):
    try:
        posts = Post.objects.all().order_by('-created_at')  # Get all posts, ordered by creation date
        paginator = PageNumberPagination()  # Create a paginator instance
        paginator.page_size = 5  # Set the number of posts per page
        
        # Paginate the posts
        result_page = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(result_page, many=True)  # Serialize the paginated posts
        
        # Add a 'liked' field to each post based on whether the current user has liked it
        data = [{"liked": request.user.username in post['likes'], **post} for post in serializer.data]
        
        return paginator.get_paginated_response(data)  # Return the paginated response
    except:
        return Response({"error": "Error fetching posts"})  # Return error if something goes wrong

# View to search users by username
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before searching for users
def search_users(request):
    query = request.query_params.get('query', '')  # Get the search query from request parameters
    users = MyUser.objects.filter(username__icontains=query)  # Search users by username (case-insensitive)
    serializer = UserSerializer(users, many=True)  # Serialize the search results
    return Response(serializer.data)  # Return the serialized user data

# View to update the user's profile details
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated before updating their details
def update_user_details(request):
    try:
        user = MyUser.objects.get(username=request.user.username)  # Retrieve the authenticated user
        serializer = UserSerializer(user, data=request.data, partial=True)  # Use partial update for user data
        
        # If the data is valid, save the updated user details
        if serializer.is_valid():
            serializer.save()
            return Response({**serializer.data, "success": True})
        
        return Response({**serializer.errors, "success": False})  # Return errors if validation fails
    except:
        return Response({"error": "Error updating user details"})  # Return error if something goes wrong
