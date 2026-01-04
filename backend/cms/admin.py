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


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    """
    Admin interface for Feedback model
    نمایش و مدیریت بازخوردهای کاربران
    """
    list_display = ['name', 'last_name', 'phone_number', 'email', 'status', 'is_read', 'created_at']
    list_filter = ['status', 'is_read', 'created_at']
    search_fields = ['name', 'last_name', 'phone_number', 'email', 'message']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    # فیلدها در detail view
    fields = ['name', 'last_name', 'phone_number', 'email', 'message', 'status', 'is_read', 'created_at']
    
    # Actions برای مدیریت سریع بازخوردها
    actions = ['mark_as_read', 'mark_as_new', 'mark_as_replied']
    
    def mark_as_read(self, request, queryset):
        """علامت‌گذاری بازخوردهای انتخاب شده به عنوان خوانده شده"""
        queryset.update(is_read=True, status='read')
        self.message_user(request, f'{queryset.count()} بازخورد به عنوان خوانده شده علامت‌گذاری شد.')
    mark_as_read.short_description = "علامت‌گذاری به عنوان خوانده شده"
    
    def mark_as_new(self, request, queryset):
        """علامت‌گذاری بازخوردهای انتخاب شده به عنوان جدید"""
        queryset.update(status='new', is_read=False)
        self.message_user(request, f'{queryset.count()} بازخورد به عنوان جدید علامت‌گذاری شد.')
    mark_as_new.short_description = "علامت‌گذاری به عنوان جدید"
    
    def mark_as_replied(self, request, queryset):
        """علامت‌گذاری بازخوردهای انتخاب شده به عنوان پاسخ داده شده"""
        queryset.update(status='replied', is_read=True)
        self.message_user(request, f'{queryset.count()} بازخورد به عنوان پاسخ داده شده علامت‌گذاری شد.')
    mark_as_replied.short_description = "علامت‌گذاری به عنوان پاسخ داده شده"


@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    """
    Admin interface for ContactInfo model (singleton)
    مدیریت اطلاعات تماس با ما
    """
    list_display = ['__str__', 'phone', 'email', 'updated_at']
    readonly_fields = ['updated_at']
    
    fields = [
        'address',
        'phone',
        'email',
        'website',
        'telegram',
        'instagram',
        'whatsapp',
        'working_hours',
        'map_embed',
        'updated_at'
    ]
    
    def has_add_permission(self, request):
        """
        جلوگیری از افزودن رکورد جدید
        ContactInfo یک singleton است و فقط یک رکورد باید وجود داشته باشد
        """
        return not ContactInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        """
        جلوگیری از حذف رکورد ContactInfo
        رکورد ContactInfo نباید حذف شود
        """
        return False


@admin.register(Subtitle)
class SubtitleAdmin(admin.ModelAdmin):
    """
    Admin interface for Subtitle model
    مدیریت زیرنویس‌های صفحه اصلی
    """
    list_display = ['text_short', 'is_active', 'created_at', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['text']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    fields = ['text', 'is_active', 'created_at', 'updated_at']
    
    def text_short(self, obj):
        """
        نمایش خلاصه متن زیرنویس در list_display
        """
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_short.short_description = 'متن زیرنویس'
    
    # Actions برای مدیریت سریع زیرنویس‌ها
    actions = ['activate_selected', 'deactivate_selected']
    
    def activate_selected(self, request, queryset):
        """
        فعال کردن زیرنویس‌های انتخاب شده
        فقط اولین مورد فعال می‌شود و بقیه غیرفعال می‌شوند
        """
        if queryset.exists():
            # فقط اولین مورد را فعال می‌کنیم
            first = queryset.first()
            # غیرفعال کردن تمام زیرنویس‌های دیگر
            Subtitle.objects.exclude(pk=first.pk).update(is_active=False)
            # فعال کردن اولین مورد
            first.is_active = True
            first.save(update_fields=['is_active'])
            self.message_user(request, f'زیرنویس "{first.text[:30]}..." فعال شد و بقیه غیرفعال شدند.')
    activate_selected.short_description = "فعال کردن انتخاب شده (فقط یکی)"
    
    def deactivate_selected(self, request, queryset):
        """
        غیرفعال کردن زیرنویس‌های انتخاب شده
        """
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} زیرنویس غیرفعال شد.')
    deactivate_selected.short_description = "غیرفعال کردن انتخاب شده"
