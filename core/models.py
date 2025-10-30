from django.db import models
from django.contrib.auth.models import User



class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    is_admin = models.BooleanField(default=False, help_text="اگر True باشد، کاربر مدیر است")

    # اطلاعات شخصی
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    national_code = models.CharField(max_length=10, unique=True)
    father_name = models.CharField(max_length=50)
    birth_date = models.DateField()
    
    gender_choices = [
        ('male', 'مرد'),
        ('female', 'زن'),
        ('other', 'سایر'),
    ]
    gender = models.CharField(max_length=10, choices=gender_choices)


    military_status_choices = [
        ('done', 'انجام شده'),
        ('exempted', 'معاف'),
        ('in_progress', 'در حال انجام'),
        ('not_applicable', 'غیرمشمول'),
    ]
    military_status = models.CharField(max_length=20, choices=military_status_choices, blank=True, null=True)

    marital_status_choices = [
        ('single', 'مجرد'),
        ('married', 'متأهل'),
        ('divorced', 'طلاق گرفته'),
        ('widowed', 'بیوه'),
    ]
    marital_status = models.CharField(max_length=20, choices=marital_status_choices, blank=True, null=True)
    children_count = models.PositiveIntegerField(default=0)

    education_level_choices = [
        ('diploma', 'دیپلم'),
        ('associate', 'کاردانی'),
        ('bachelor', 'کارشناسی'),
        ('master', 'کارشناسی ارشد'),
        ('phd', 'دکتری'),
        ('other', 'سایر'),
    ]
    education_level = models.CharField(max_length=20, choices=education_level_choices, blank=True, null=True)
    field_of_study = models.CharField(max_length=100, blank=True, null=True)

    # تماس و مشخصات شغلی
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    join_date = models.DateField(auto_now_add=True)
    shift_count = models.PositiveIntegerField(default=0)
    has_criminal_record = models.BooleanField(default=False, help_text="آیا دارای سوءپیشینه است؟")

    # اطلاعات تکمیلی
    nationality = models.CharField(max_length=50, blank=True, null=True)
    religion = models.CharField(max_length=50, blank=True, null=True)
    sect = models.CharField(max_length=50, blank=True, null=True)
    social_media_number = models.CharField(max_length=50, blank=True, null=True)
    current_job = models.CharField(max_length=100, blank=True, null=True)
    work_address = models.CharField(max_length=200, blank=True, null=True)
    work_phone = models.CharField(max_length=15, blank=True, null=True)
    home_phone = models.CharField(max_length=15, blank=True, null=True)
    home_address = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        verbose_name = "کارمند"
        verbose_name_plural = "کارمندان"
        ordering = ['last_name', 'first_name']


class Shift(models.Model):
    employees = models.ManyToManyField(Employee, related_name='shifts')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    occasion = models.CharField(max_length=100, blank=True, null=True, help_text="مثلاً شب یلدا، عید فطر، ...")
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='created_shifts')

    def __str__(self):
        return f"شیفت {self.occasion or self.start_time.date()}"

    class Meta:
        verbose_name = "شیفت"
        verbose_name_plural = "شیفت‌ها"
        ordering = ['-start_time']


class ShiftLog(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='shift_logs')
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='logs')
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"حضور {self.employee} در {self.shift}"

    class Meta:
        verbose_name = "ثبت حضور"
        verbose_name_plural = "سوابق حضور"
        ordering = ['-check_in']

