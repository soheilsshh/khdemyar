from django.db import models
from core.models import User
from django.utils import timezone


class News(models.Model):
    title = models.CharField(max_length=200, verbose_name="عنوان")
    date = models.DateField(verbose_name="تاریخ")
    description = models.TextField(verbose_name="توضیحات")
    image = models.ImageField(upload_to="news/", verbose_name="تصویر")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "خبر"
        verbose_name_plural = "اخبار"
        ordering = ['-date']

    def __str__(self):
        return self.title


class AboutUs(models.Model):
    """Singleton model for About Us content"""
    description = models.TextField(verbose_name="توضیحات")
    image = models.ImageField(upload_to="about/", verbose_name="تصویر")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")

    class Meta:
        verbose_name = "درباره ما"
        verbose_name_plural = "درباره ما"

    def __str__(self):
        return "درباره ما"

    @classmethod
    def get_instance(cls):
        """Get or create the single AboutUs instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class Visit(models.Model):
    """
    مدل ثبت بازدید صفحات توسط کاربران
    استفاده برای page view tracking از سمت فرانت‌اند
    """
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="آدرس IP")
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="کاربر"
    )
    path = models.CharField(max_length=255, verbose_name="مسیر صفحه")
    user_agent = models.TextField(null=True, blank=True, verbose_name="User Agent")
    created_at = models.DateTimeField(default=timezone.now, verbose_name="زمان بازدید")

    class Meta:
        verbose_name = "بازدید"
        verbose_name_plural = "بازدیدها"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['ip_address', 'created_at']),
            models.Index(fields=['path', 'created_at']),
        ]

    def __str__(self):
        return f"بازدید از {self.path} در {self.created_at}"


class Feedback(models.Model):
    """
    مدل بازخورد کاربران
    کاربران می‌توانند بازخورد خود را ارسال کنند
    مدیریت بازخوردها فقط برای ادمین‌ها امکان‌پذیر است
    """
    STATUS_CHOICES = [
        ('new', 'جدید'),
        ('read', 'خوانده شده'),
        ('replied', 'پاسخ داده شده'),
    ]
    
    name = models.CharField(max_length=100, verbose_name="نام")
    last_name = models.CharField(max_length=100, verbose_name="نام خانوادگی")
    phone_number = models.CharField(max_length=20, blank=True, null=True, verbose_name="شماره تلفن")
    email = models.EmailField(blank=True, null=True, verbose_name="ایمیل")
    message = models.TextField(verbose_name="پیام")
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='new',
        verbose_name="وضعیت"
    )
    is_read = models.BooleanField(default=False, verbose_name="خوانده شده")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    
    class Meta:
        verbose_name = "بازخورد"
        verbose_name_plural = "بازخوردها"
        ordering = ['-created_at']
        # Index برای بهبود queryهای فیلتر شده بر اساس status و created_at
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['is_read', 'created_at']),
        ]
    
    def __str__(self):
        return f"بازخورد از {self.name} {self.last_name} - {self.get_status_display()}"


class ContactInfo(models.Model):
    """
    مدل Singleton برای اطلاعات تماس با ما
    فقط یک رکورد در دیتابیس وجود دارد (singleton pattern)
    استفاده از get_instance() برای دسترسی به رکورد واحد
    """
    address = models.TextField(blank=True, null=True, verbose_name="آدرس")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="تلفن")
    email = models.EmailField(blank=True, null=True, verbose_name="ایمیل")
    website = models.URLField(blank=True, null=True, verbose_name="وب‌سایت")
    telegram = models.CharField(max_length=100, blank=True, null=True, verbose_name="تلگرام")
    instagram = models.CharField(max_length=100, blank=True, null=True, verbose_name="اینستاگرام")
    whatsapp = models.CharField(max_length=20, blank=True, null=True, verbose_name="واتساپ")
    working_hours = models.TextField(blank=True, null=True, verbose_name="ساعات کاری")
    map_embed = models.TextField(blank=True, null=True, verbose_name="کد embed نقشه")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")
    
    class Meta:
        verbose_name = "اطلاعات تماس"
        verbose_name_plural = "اطلاعات تماس"
    
    def __str__(self):
        return "اطلاعات تماس با ما"
    
    @classmethod
    def get_instance(cls):
        """
        متد کلاس برای دریافت/ایجاد رکورد واحد ContactInfo
        استفاده از get_or_create با pk=1 برای اطمینان از singleton بودن
        """
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class SubtitleQuerySet(models.QuerySet):
    """
    Custom QuerySet برای مدل Subtitle
    متدهای مفید برای query کردن زیرنویس‌ها
    """
    def active(self):
        """
        برگرداندن زیرنویس فعال (فقط یکی باید وجود داشته باشد)
        """
        return self.filter(is_active=True)
    
    def inactive(self):
        """
        برگرداندن تمام زیرنویس‌های غیرفعال
        """
        return self.filter(is_active=False)


class SubtitleManager(models.Manager):
    """
    Custom Manager برای مدل Subtitle
    اضافه کردن متدهای مفید برای دسترسی به زیرنویس‌ها
    """
    def get_queryset(self):
        """
        استفاده از SubtitleQuerySet به جای QuerySet معمولی
        """
        return SubtitleQuerySet(self.model, using=self._db)
    
    def active(self):
        """
        متد کلاس برای گرفتن زیرنویس فعال
        استفاده: Subtitle.objects.active()
        """
        return self.get_queryset().active()
    
    def inactive(self):
        """
        متد کلاس برای گرفتن زیرنویس‌های غیرفعال
        استفاده: Subtitle.objects.inactive()
        """
        return self.get_queryset().inactive()
    
    def get_active(self):
        """
        گرفتن زیرنویس فعال (اولین مورد)
        در صورت عدم وجود، None برمی‌گرداند
        استفاده: Subtitle.objects.get_active()
        """
        return self.get_queryset().active().first()


class Subtitle(models.Model):
    """
    مدل زیرنویس صفحه اصلی
    
    ویژگی‌ها:
    - چندین زیرنویس می‌تواند وجود داشته باشد
    - فقط یکی می‌تواند فعال (is_active=True) باشد
    - هنگام فعال کردن یکی، بقیه خودکار غیرفعال می‌شوند (در view/serializer مدیریت می‌شود)
    
    استفاده از Custom Manager برای دسترسی آسان به زیرنویس فعال:
    - Subtitle.objects.active() → QuerySet زیرنویس‌های فعال
    - Subtitle.objects.get_active() → زیرنویس فعال (اولین مورد)
    - Subtitle.objects.inactive() → QuerySet زیرنویس‌های غیرفعال
    """
    text = models.TextField(max_length=500, verbose_name="متن زیرنویس")
    is_active = models.BooleanField(default=False, verbose_name="فعال")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="تاریخ بروزرسانی")
    
    # استفاده از Custom Manager
    objects = SubtitleManager()
    
    class Meta:
        verbose_name = "زیرنویس"
        verbose_name_plural = "زیرنویس‌ها"
        ordering = ['-created_at']
        # Index برای بهبود performance در queryهای فیلتر شده بر اساس is_active
        indexes = [
            models.Index(fields=['is_active', 'created_at']),
        ]
    
    def __str__(self):
        status = "فعال" if self.is_active else "غیرفعال"
        return f"{self.text[:50]}... ({status})"