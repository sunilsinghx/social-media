from django.contrib import admin
from .models import MyUser,Post
from django.contrib.auth.admin import UserAdmin


admin.site.register(Post)
admin.site.register(MyUser)

