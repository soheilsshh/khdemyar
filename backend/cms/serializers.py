from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from dateutil.relativedelta import relativedelta
from django.core.validators import EmailValidator
from .models import *
from core.models import Employee, Shift


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
        instance موجود را برمی‌گرداند (silent fail)
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
        ).first()

        if recent_visit:
            # Silent fail: در صورت تکراری بودن، instance موجود را برمی‌گردانیم
            # این کار باعث می‌شود که DRF خطا ندهد و منطق silent fail حفظ شود
            return recent_visit

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


class FeedbackCreateSerializer(serializers.ModelSerializer):
    """
    Serializer برای ایجاد بازخورد جدید از سمت کاربران
    فقط فیلدهای مورد نیاز برای ایجاد بازخورد
    Validation: حداقل طول پیام و حداقل یکی از فیلدهای تماس باید پر باشد
    """
    class Meta:
        model = Feedback
        fields = ['name', 'last_name', 'phone_number', 'email', 'message']
        # فیلدهای status و is_read فقط توسط ادمین‌ها قابل تنظیم است
        read_only_fields = ['status', 'is_read', 'created_at']
    
    def validate_message(self, value):
        """
        Validation: حداقل طول پیام 10 کاراکتر
        جلوگیری از ارسال پیام‌های خیلی کوتاه
        """
        if len(value.strip()) < 10:
            raise serializers.ValidationError("پیام باید حداقل 10 کاراکتر باشد.")
        if len(value) > 5000:
            raise serializers.ValidationError("پیام نمی‌تواند بیشتر از 5000 کاراکتر باشد.")
        return value
    
    def validate(self, attrs):
        """
        Validation: حداقل یکی از فیلدهای تماس (phone_number یا email) باید پر باشد
        این کار برای امکان تماس مجدد با کاربر ضروری است
        """
        phone_number = attrs.get('phone_number', '').strip() if attrs.get('phone_number') else ''
        email = attrs.get('email', '').strip() if attrs.get('email') else ''
        
        if not phone_number and not email:
            raise serializers.ValidationError({
                'phone_number': 'حداقل یکی از فیلدهای شماره تلفن یا ایمیل باید پر باشد.',
                'email': 'حداقل یکی از فیلدهای شماره تلفن یا ایمیل باید پر باشد.'
            })
        
        return attrs


class FeedbackSerializer(serializers.ModelSerializer):
    """
    Serializer کامل برای نمایش و مدیریت بازخوردها (برای ادمین‌ها)
    شامل تمام فیلدها شامل status و is_read
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Feedback
        fields = [
            'id',
            'name',
            'last_name',
            'phone_number',
            'email',
            'message',
            'status',
            'status_display',
            'is_read',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_message(self, value):
        """
        Validation: حداقل طول پیام 10 کاراکتر
        """
        if len(value.strip()) < 10:
            raise serializers.ValidationError("پیام باید حداقل 10 کاراکتر باشد.")
        if len(value) > 5000:
            raise serializers.ValidationError("پیام نمی‌تواند بیشتر از 5000 کاراکتر باشد.")
        return value
    
    def validate(self, attrs):
        """
        Validation: حداقل یکی از فیلدهای تماس باید پر باشد
        """
        # اگر instance موجود باشد، از داده‌های موجود استفاده می‌کنیم
        phone_number = attrs.get('phone_number') or (self.instance.phone_number if self.instance else '')
        email = attrs.get('email') or (self.instance.email if self.instance else '')
        
        phone_number = phone_number.strip() if phone_number else ''
        email = email.strip() if email else ''
        
        if not phone_number and not email:
            raise serializers.ValidationError({
                'phone_number': 'حداقل یکی از فیلدهای شماره تلفن یا ایمیل باید پر باشد.',
                'email': 'حداقل یکی از فیلدهای شماره تلفن یا ایمیل باید پر باشد.'
            })
        
        return attrs


class ContactInfoSerializer(serializers.ModelSerializer):
    """
    Serializer برای اطلاعات تماس با ما (singleton)
    شامل تمام فیلدهای مورد نیاز برای نمایش و ویرایش
    """
    class Meta:
        model = ContactInfo
        fields = [
            'id',
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
        read_only_fields = ['id', 'updated_at']


class SubtitleSerializer(serializers.ModelSerializer):
    """
    Serializer برای مدیریت زیرنویس‌ها
    
    ویژگی‌ها:
    - شامل تمام فیلدها برای CRUD
    - Validation: طول متن زیرنویس
    - read_only برای created_at و updated_at
    
    نکته مهم:
    - منطق "فقط یکی active" در view مدیریت می‌شود (نه در serializer)
    - این کار باعث می‌شود که validation ساده‌تر و قابل نگهداری‌تر باشد
    - منطق business در view قرار می‌گیرد که مناسب‌تر است
    """
    class Meta:
        model = Subtitle
        fields = [
            'id',
            'text',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate_text(self, value):
        """
        Validation: بررسی طول متن زیرنویس
        - نباید خالی باشد (blank=False در مدل)
        - حداکثر 500 کاراکتر (max_length در مدل)
        - حداقل 1 کاراکتر (چک strip)
        """
        text = value.strip()
        if not text:
            raise serializers.ValidationError("متن زیرنویس نمی‌تواند خالی باشد.")
        if len(text) > 500:
            raise serializers.ValidationError("متن زیرنویس نمی‌تواند بیشتر از 500 کاراکتر باشد.")
        return text


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