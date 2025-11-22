from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_admin = models.BooleanField(default=False)  
    is_approved = models.BooleanField(default=False)  
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username



class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employee_profile")

    # اطلاعات شخصی
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    national_id = models.CharField(max_length=10, unique=True)
    father_name = models.CharField(max_length=50)
    birth_date = models.DateField()
    gender = models.CharField(max_length=10, choices=[
        ("male", "مرد"),
        ("female", "زن")
    ])
    marital_status = models.CharField(max_length=15, choices=[
        ("single", "مجرد"),
        ("married", "متأهل")
    ])
    children_count = models.PositiveIntegerField(default=0)
    education_level = models.CharField(max_length=50, choices=[
        ("diploma", "دیپلم"),
        ("associate", "فوق دیپلم"),
        ("bachelor", "کارشناسی"),
        ("master", "کارشناسی ارشد"),
        ("phd", "دکتری")
    ])
    field_of_study = models.CharField(max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=50)
    religion = models.CharField(max_length=50, blank=True, null=True)
    sect = models.CharField(max_length=50, blank=True, null=True)
    criminal_record = models.TextField(blank=True, null=True)  # Added: تغییر از has_criminal_record بولین به TextField برای تطبیق با textarea در HTML (سوء پیشینه با توضیحات)
    employment_date = models.DateField(auto_now_add=True)
    registration_date = models.DateField(auto_now_add=True)  # Added: تاریخ ثبت نام (از HTML)
    current_job = models.CharField(max_length=100, blank=True, null=True)  # Added: شغل فعلی (از HTML)
    religious_background = models.TextField(blank=True, null=True)  # Added: سابقه فعالیت مذهبی (textarea در HTML)
    disability = models.TextField(blank=True, null=True)  # Added: بیماری یا معلولیت خاص (textarea در HTML)
    skills = models.TextField(blank=True, null=True)  # Added: مهارت یا تخصص (textarea در HTML)
    profile_image = models.ImageField(upload_to='employee_profiles/', blank=True, null=True)  # Added: برای آپلود تصویر پروفایل (از بخش img در HTML)

    # اطلاعات تماس
    phone = models.CharField(max_length=20)
    social_phone = models.CharField(max_length=20, blank=True, null=True)
    work_phone = models.CharField(max_length=20, blank=True, null=True)
    home_phone = models.CharField(max_length=20, blank=True, null=True)
    work_address = models.TextField(blank=True, null=True)
    home_address = models.TextField(blank=True, null=True)

    # اطلاعات معرف‌ها
    ref1_name = models.CharField(max_length=100, blank=True, null=True)  # Added: نام معرف اول (از HTML)
    ref1_phone = models.CharField(max_length=20, blank=True, null=True)  # Added: شماره معرف اول (از HTML)
    ref2_name = models.CharField(max_length=100, blank=True, null=True)  # Added: نام معرف دوم (از HTML)
    ref2_phone = models.CharField(max_length=20, blank=True, null=True)  # Added: شماره معرف دوم (از HTML)

    # اطلاعات کاری
    shift_count = models.PositiveIntegerField(default=0)
    military_status = models.CharField(max_length=30, choices=[
        ("done", "انجام شده"),
        ("exempted", "معاف"),
        ("serving", "در حال خدمت"),
        ("not_applicable", "غیر مشمول")
    ])
    
    status = models.CharField(
        max_length=10,
        choices=[
            ('pending', 'در انتظار'),
            ('approved', 'تأیید شده'),
            ('rejected', 'رد شده')
        ],
        default='pending'
    )
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_employees')  # Added: تأیید شده توسط (ForeignKey به User، از HTML)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Shift(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="shifts")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    occasion = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='created_shifts'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
            ordering = ['-start_time']

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_active:
            active_shifts = self.employee.shifts.filter(is_active=True).count()
            self.employee.shift_count = active_shifts
            self.employee.save(update_fields=['shift_count'])

    def __str__(self):
        return f"{self.employee} | {self.start_time.strftime('%Y-%m-%d %H:%M')}"


class BlogPost(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'is_admin': True}
        )
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    
    
    
# class ShiftLog(models.Model):
#     employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='shift_logs')
#     shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='logs')
#     check_in = models.DateTimeField()
#     check_out = models.DateTimeField(blank=True, null=True)
#     notes = models.TextField(blank=True, null=True)

#     def __str__(self):
#         return f"حضور {self.employee} در {self.shift}"

#     class Meta:
#         verbose_name = "ثبت حضور"
#         verbose_name_plural = "سوابق حضور"
#         ordering = ['-check_in']
