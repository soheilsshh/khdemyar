from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User, Employee, Shift, BlogPost

admin.site.register(User)
admin.site.register(Employee)
admin.site.register(Shift)
admin.site.register(BlogPost)