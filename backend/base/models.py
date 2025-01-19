from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom user model
class MyUser(AbstractUser):
    # Redefine the 'username' field to have a max length of 50 characters and ensure uniqueness.
    username = models.CharField(max_length=50, unique=True, primary_key=True)
    
    # A 'bio' field to store additional information about the user (up to 500 characters).
    bio = models.CharField(max_length=500)
    
    # A profile image field to allow users to upload an image for their profile.
    # The uploaded images will be saved in the 'profile_image/' directory.
    profile_image = models.ImageField(upload_to='profile_image/', blank=True, null=True)
    
    # A Many-to-Many relationship field where users can follow other users.
    # The 'symmetrical=False' argument makes it non-symmetrical, meaning if User A follows User B, User B does not automatically follow User A.
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    # A string representation of the user, returning the username.
    def __str__(self):
        return self.username

# Post model
class Post(models.Model):
    # ForeignKey field linking the post to the 'MyUser' model (each post belongs to a specific user).
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='posts')
    
    # A field to store a description for the post (max length 400 characters).
    description = models.CharField(max_length=400)
    
    # A timestamp field that automatically sets the date and time when the post is created.
    created_at = models.DateTimeField(auto_now_add=True)
    
    # A Many-to-Many relationship field for users who like the post.
    # It allows multiple users to like a post and each user can like many posts.
    likes = models.ManyToManyField(MyUser, related_name='post_likes', blank=True)

    # String representation of the Post model. This returns a string that includes:
    # 1. The username of the user who created the post.
    # 2. A preview of the post description (limited to the first 20 characters for brevity).
    def __str__(self):
        return f"Post by {self.user.username}: {self.description[:10]}..."  # Preview the description
