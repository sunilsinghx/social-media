from rest_framework import serializers
from .models import MyUser, Post

# Serializer for user registration
class UserRegisterSerializer(serializers.ModelSerializer):

    # Password is write-only, meaning it will not be included in serialized output
    password = serializers.CharField(write_only=True)

    class Meta:
        # Specify the model to use and the fields to include in serialization
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

    def create(self, validated_data):
        # Create a new user instance with validated data, excluding password for now
        user = MyUser(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        # Set the user's password (password is hashed using set_password)
        user.set_password(validated_data['password'])
        # Save the user to the database
        user.save()
        return user

# Serializer for retrieving and displaying user profile data
class MyUserProfileSerializer(serializers.ModelSerializer):

    # Dynamically calculate follower and following counts
    follower_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = MyUser
        # Include the following fields in the serialized output
        fields = ['username', 'bio', 'profile_image', 'follower_count', 'following_count']

    # Method to get the follower count for a user
    def get_follower_count(self, obj):
        # obj refers to the current user instance; count how many users follow them
        return obj.followers.count()
    
    # Method to get the following count for a user
    def get_following_count(self, obj):
        # Count how many users the current user is following
        return obj.following.count()

# Serializer for displaying posts with additional info like username and like count
class PostSerializer(serializers.ModelSerializer):

    # Dynamically get the username of the user who created the post
    username = serializers.SerializerMethodField()
    # Dynamically get the count of likes for the post
    like_count = serializers.SerializerMethodField()
    # Format the date when the post was created
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Post
        # Include fields for post ID, description, formatted date, likes, and like count
        fields = ['id', 'username', 'description', 'formatted_date', 'likes', 'like_count']

    # Method to get the username of the user who posted
    def get_username(self, obj):
        # Access the user who created the post and return their username
        return obj.user.username
    
    # Method to get the like count for the post
    def get_like_count(self, obj):
        # Return the count of users who have liked the post
        return obj.likes.count()
    
    # Method to format the created_at timestamp to a readable string
    def get_formatted_date(self, obj):
        # Return the creation date formatted as "DD MMM YY"
        return obj.created_at.strftime("%d %b %y")

# Serializer for displaying user data in various contexts (e.g., user profile view)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        # Include essential user details like username, bio, email, etc.
        fields = ['username', 'bio', 'email', 'profile_image', 'first_name', 'last_name']
