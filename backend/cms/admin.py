from django.contrib import admin
from .models import News, AboutUs


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'created_at', 'updated_at']
    list_filter = ['date', 'created_at']
    search_fields = ['title', 'description']
    date_hierarchy = 'date'
    ordering = ['-date']


@admin.register(AboutUs)
class AboutUsAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'updated_at']
    readonly_fields = ['updated_at']
    
    def has_add_permission(self, request):
        """Prevent adding multiple AboutUs instances"""
        return not AboutUs.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deleting the AboutUs instance"""
        return False
