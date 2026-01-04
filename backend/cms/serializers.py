from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from .models import *


class NewsListSerializer(serializers.ModelSerializer):
    """Serializer for listing news with fewer fields"""
    class Meta:
        model = News
        fields = ['id', 'title', 'date', 'image', 'created_at']
        read_only_fields = ['created_at']


class NewsSerializer(serializers.ModelSerializer):
    """Full serializer for CRUD operations"""
    class Meta:
        model = News
        fields = [
            'id',
            'title',
            'date',
            'description',
            'image',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AboutUsSerializer(serializers.ModelSerializer):
    """Serializer for About Us content"""
    class Meta:
        model = AboutUs
        fields = [
            'id',
            'description',
            'image',
            'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


class DashboardSerializer(serializers.Serializer):
    total_employees = serializers.SerializerMethodField()
    completed_shifts = serializers.SerializerMethodField()
    this_month_visits = serializers.SerializerMethodField()
    monthly_growth = serializers.SerializerMethodField()

    def get_total_employees(self, obj):
        return Employee.objects.count()

    def get_completed_shifts(self, obj):
        now = timezone.now()
        return Shift.objects.filter(end_time__lt=now).count()  

    def get_this_month_visits(self, obj):
        """
        محاسبه بازدیدهای ماه جاری
        استفاده از منطق مشابه VisitStatsView برای هماهنگی
        """
        now = timezone.now()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return Visit.objects.filter(created_at__gte=this_month_start).count()

    def get_monthly_growth(self, obj):
        """
        محاسبه درصد رشد ماهانه
        منطق هماهنگ با VisitStatsView برای سازگاری
        مدیریت تقسیم بر صفر: در صورت صفر بودن ماه قبل، 0.0 برمی‌گرداند
        """
        now = timezone.now()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # ماه قبل
        prev_month_start = this_month_start - relativedelta(months=1)
        prev_month_end = this_month_start - timedelta(seconds=1)
        
        # Queryهای بهینه
        queryset = Visit.objects.all()
        this_month_count = queryset.filter(created_at__gte=this_month_start).count()
        prev_month_count = queryset.filter(
            created_at__gte=prev_month_start,
            created_at__lte=prev_month_end
        ).count()
        
        # مدیریت تقسیم بر صفر - هماهنگ با VisitStatsView
        if prev_month_count > 0:
            monthly_growth = round(((this_month_count - prev_month_count) / prev_month_count) * 100, 2)
        else:
            monthly_growth = 0.0
        
        return monthly_growth


class VisitCreateSerializer(serializers.ModelSerializer):
    """
    Serializer برای ثبت بازدید جدید از سمت فرانت‌اند
    IP و user_agent به صورت خودکار از request گرفته می‌شوند
    Rate limiting: 60 ثانیه برای جلوگیری از اسپم
    """
    class Meta:
        model = Visit
        fields = ['path']
        read_only_fields = ['ip_address', 'user_agent', 'user', 'created_at']

    def create(self, validated_data):
        """
        ایجاد Visit با دریافت IP و user_agent از request
        Rate limiting: اگر بازدید مشابه در 60 ثانیه گذشته وجود داشته باشد، 
        به صورت silent fail (None برمی‌گرداند)
        """
        request = self.context.get('request')
        ip_address = self._get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        path = validated_data.get('path')
        user = request.user if request.user.is_authenticated else None

        # Rate limiting: بررسی بازدید مشابه در 60 ثانیه گذشته
        # استفاده از IP و path برای جلوگیری از اسپم
        recent_visit = Visit.objects.filter(
            ip_address=ip_address,
            path=path,
            created_at__gte=timezone.now() - timedelta(seconds=60)
        ).exists()

        if recent_visit:
            # Silent fail: در صورت تکراری بودن، None برمی‌گردانیم
            return None

        # ایجاد Visit جدید
        visit = Visit.objects.create(
            ip_address=ip_address,
            user_agent=user_agent,
            path=path,
            user=user
        )
        return visit

    def _get_client_ip(self, request):
        """
        دریافت IP کاربر از request
        در نظر گرفتن proxy headers برای دقت بیشتر
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # اگر از proxy رد شده باشد، اولین IP واقعی کاربر است
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class VisitStatsSerializer(serializers.Serializer):
    """
    Serializer برای آمار بازدیدها
    شامل آمار کلی، ماهانه، روزانه و رشد
    """
    total_visits = serializers.IntegerField(
        read_only=True,
        help_text="تعداد کل بازدیدها"
    )
    this_month_visits = serializers.IntegerField(
        read_only=True,
        help_text="بازدیدهای ماه جاری"
    )
    monthly_growth = serializers.FloatField(
        read_only=True,
        help_text="درصد رشد ماهانه نسبت به ماه قبل"
    )
    today_visits = serializers.IntegerField(
        read_only=True,
        help_text="بازدیدهای امروز"
    )
    yesterday_visits = serializers.IntegerField(
        read_only=True,
        help_text="بازدیدهای دیروز"
    )