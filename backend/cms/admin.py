from django.contrib import admin
from .models import News


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'created_at', 'updated_at']
    list_filter = ['date', 'created_at']
    search_fields = ['title', 'description']
    date_hierarchy = 'date'
    ordering = ['-date']
