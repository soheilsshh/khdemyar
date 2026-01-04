from django.contrib import admin
from .models import * 


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

@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    """
    Admin interface for Visit model
    نمایش بازدیدهای صفحات
    """
    list_display = ['path', 'ip_address', 'user', 'created_at']
    list_filter = ['created_at', 'path']
    search_fields = ['path', 'ip_address', 'user__username']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    # محدود کردن نمایش فیلدها در detail view
    fields = ['path', 'ip_address', 'user', 'user_agent', 'created_at']
    
    def has_add_permission(self, request):
        """
        غیرفعال کردن امکان افزودن دستی Visit
        Visitها فقط از طریق API ثبت می‌شوند
        """
        return False
