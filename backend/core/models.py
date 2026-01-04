from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_admin = models.BooleanField(default=False)  
    is_approved = models.BooleanField(default=False)  
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.username



class Employee(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name="employee_profile"
        )

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
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_employees')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان ایجاد")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="زمان بروزرسانی")

    is_staff_admin = models.BooleanField(default=False, verbose_name="دسترسی به پنل مدیریت")
    can_manage_shifts = models.BooleanField(default=False, verbose_name="مدیریت شیفت‌ها")
    can_manage_blog = models.BooleanField(default=False, verbose_name="مدیریت وبلاگ")
    can_approve_registrations = models.BooleanField(default=False, verbose_name="تأیید درخواست‌های ثبت‌نام")
    can_manage_khadamyaran = models.BooleanField(default=False, verbose_name="مدیریت خادمیاران")
    can_manage_site_settings = models.BooleanField(default=False, verbose_name="مدیریت تنظیمات سایت")
    can_manage_admins = models.BooleanField(default=False, verbose_name="مدیریت مدیران")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Shift(models.Model):

    start_time = models.DateTimeField(verbose_name="زمان شروع")
    end_time = models.DateTimeField(verbose_name="زمان پایان")
    occasion = models.CharField(max_length=100, blank=True, null=True, verbose_name="مناسبت")
    max_males = models.PositiveIntegerField(default=0, verbose_name="حداکثر تعداد مردان")  # ظرفیت مردان
    max_females = models.PositiveIntegerField(default=0, verbose_name="حداکثر تعداد زنان")  # ظرفیت زنان
    min_emp = models.PositiveIntegerField(default=0, verbose_name="حداقل تعداد کارکنان")
    max_emp = models.PositiveIntegerField(default=0, verbose_name="حداکثر تعداد کارکنان")
    is_active = models.BooleanField(default=True, verbose_name="فعال")
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='created_shifts', verbose_name="ایجادکننده"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان ایجاد")
    description = models.TextField(blank=True, null=True, verbose_name="توضیحات شیفت")

    class Meta:
        ordering = ['-start_time']
        verbose_name = "shift"
        verbose_name_plural = "shifts"

    def __str__(self):
        return f"شیفت {self.start_time.strftime('%Y-%m-%d %H:%M')} - {self.occasion or 'بدون مناسبت'}"

    @property
    def current_males_count(self):
        """تعداد مردان تاییدشده در این شیفت"""
        return self.assignments.filter(employee__gender='male').count()

    @property
    def current_females_count(self):
        """تعداد زنان تاییدشده در این شیفت"""
        return self.assignments.filter(employee__gender='female').count()

    def is_full(self, gender):
        """چک ظرفیت پر بودن بر اساس جنسیت"""
        if gender == 'male':
            return self.current_males_count >= self.max_males
        elif gender == 'female':
            return self.current_females_count >= self.max_females
        return False


class ShiftRequest(models.Model):
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name="requests", verbose_name="شیفت")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="shift_requests", verbose_name="کارمند")
    status = models.CharField(
        max_length=10,
        choices=[
            ('pending', 'در انتظار'),
            ('approved', 'تایید شده'),
            ('rejected', 'رد شده')
        ],
        default='pending',
        verbose_name="وضعیت"
    )
    requested_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان درخواست")
    approved_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_shift_requests', verbose_name="تاییدکننده"
    )

    class Meta:
        unique_together = ('shift', 'employee')  
        verbose_name = "shift request"
        verbose_name_plural = "shift requests"

    def __str__(self):
        return f"درخواست {self.employee} برای {self.shift}"

    def approve(self, approved_by=None):
        """
        تایید درخواست شیفت
        
        Args:
            approved_by: کاربری که درخواست را تایید می‌کند (مدیر فعلی)
        """
        if self.shift.is_full(self.employee.gender):
            raise ValueError("ظرفیت شیفت پر شده است.")
        self.status = 'approved'
        if approved_by:
            self.approved_by = approved_by
        self.save()
        
        ShiftAssignment.objects.create(shift=self.shift, employee=self.employee)

    def reject(self):
        self.status = 'rejected'
        self.save()


class ShiftAssignment(models.Model):
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name="assignments", verbose_name="شیفت")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="assigned_shifts", verbose_name="کارمند")
    assigned_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان تخصیص")

    class Meta:
        unique_together = ('shift', 'employee')
        verbose_name = "shift assignment"
        verbose_name_plural = "shift assignments"

    def __str__(self):
        return f"تخصیص {self.employee} به {self.shift}"



    

