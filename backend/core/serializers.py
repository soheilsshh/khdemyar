from rest_framework import serializers
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema_field, OpenApiTypes
from .models import Employee, Shift , ShiftRequest , ShiftAssignment
from django.utils import timezone
from django.db.models.functions import ExtractMonth
from django.db.models import Count
User = get_user_model()


class UserShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id',
                  'username',
                  'email',
                  'first_name',
                  'last_name',
                  ]
        
        
class EmployeeListSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=False
    )
    total_shifts_count = serializers.IntegerField(read_only=True)

    created_at = serializers.DateTimeField(read_only=True)

    is_staff_admin = serializers.BooleanField()
    can_manage_shifts = serializers.BooleanField()
    can_manage_blog = serializers.BooleanField()
    can_approve_registrations = serializers.BooleanField()
    can_manage_khadamyaran = serializers.BooleanField()
    can_manage_site_settings = serializers.BooleanField()
    
    class Meta:
        model = Employee
        fields = ['id',
                  'user',
                  'user_id',
                  'first_name',
                  'last_name',
                  'national_id',
                  'phone',
                  'status',
                  'total_shifts_count',
                  'criminal_record',
                  'is_staff_admin',
                  'created_at',
                  'can_manage_shifts',
                  'can_manage_blog',
                  'can_approve_registrations',
                  'can_manage_khadamyaran',
                  'can_manage_site_settings',
                  ]


class EmployeeSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True,
        required=False
    )


    class Meta:
        model = Employee
        fields = [
            'id',
            'user',
            'user_id',

            # اطلاعات شخصی
            'first_name',
            'last_name',
            'national_id',
            'father_name',
            'birth_date',
            'birth_place',
            'identity_number',
            'gender',
            'marital_status',
            'children_count',
            'education_level',
            'field_of_study',
            'nationality',
            'religion',
            'sect',

            'criminal_record',           # حالا TextField هست (توضیحات سوءپیشینه)
            'current_job',               # شغل فعلی
            'religious_background',      # سابقه فعالیت مذهبی
            'disability',                # بیماری یا معلولیت خاص
            'skills',                    # مهارت‌ها و تخصص‌ها
            'profile_image',             # عکس پروفایل

            # تاریخ‌ها
            'registration_date',         # تاریخ ثبت‌نام
            'employment_date',           # تاریخ استخدام

            # اطلاعات تماس
            'phone',
            'social_phone',
            'work_phone',
            'home_phone',
            'work_address',
            'home_address',

            # معرف‌ها
            'ref1_name',
            'ref1_phone',
            'ref2_name',
            'ref2_phone',

            # وضعیت و خدمت
            'military_status',
            'status',                    # pending / approved / rejected

            # تأییدکننده (اختیاری)
            'approved_by',
            
            'is_staff_admin',
            'can_manage_shifts',
            'can_manage_blog',
            'can_approve_registrations',
            'can_manage_khadamyaran',
            'can_manage_site_settings',
            'can_manage_admins',
        ]

        read_only_fields = [
            'id',
            'user',
            'employment_date',
            'registration_date',
            'shift_count',
            'is_staff_admin',
        ]

        extra_kwargs = {
            'profile_image': {'required': False},
            'criminal_record': {'required': False},
            'current_job': {'required': False},
            'religious_background': {'required': False},
            'disability': {'required': False},
            'skills': {'required': False},
            'ref1_name': {'required': False},
            'ref1_phone': {'required': False},
            'ref2_name': {'required': False},
            'ref2_phone': {'required': False},
            'birth_place': {'required': True},
            'identity_number': {'required': True},
        }

    def create(self, validated_data):
        user_data = validated_data.pop('user', None)
        if not user_data:
            raise serializers.ValidationError({"user_id": "مشخص کردن کاربر الزامی است."})
        return Employee.objects.create(user=user_data, **validated_data)

    def update(self, instance, validated_data):
        # اگر مدیر بخواد وضعیت رو تأیید کنه، approved_by رو پر کن
        if 'status' in validated_data and validated_data['status'] == 'approved':
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                validated_data['approved_by'] = request.user

        # آپلود عکس پروفایل
        profile_image = validated_data.get('profile_image')
        if profile_image is not None:
            instance.profile_image = profile_image

        return super().update(instance, validated_data)


class ShiftListSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    current_males = serializers.IntegerField(source='current_males_count', read_only=True)
    current_females = serializers.IntegerField(source='current_females_count', read_only=True)
    is_full_male = serializers.SerializerMethodField()
    is_full_female = serializers.SerializerMethodField()
    has_requested = serializers.SerializerMethodField()  

    class Meta:
        model = Shift
        fields = [
            'id', 
            'start_time', 
            'end_time', 
            'occasion',
            'max_males', 
            'max_females',
            'current_males', 
            'current_females',
            'is_full_male', 
            'is_full_female',
            'is_active', 
            'created_by_name', 
            'created_at',
            'has_requested'
        ]

    def get_is_full_male(self, obj):
        return obj.is_full('male')

    def get_is_full_female(self, obj):
        return obj.is_full('female')

    def get_has_requested(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                employee = Employee.objects.get(user=request.user)
                return ShiftRequest.objects.filter(shift=obj, employee=employee).exists()
            except Employee.DoesNotExist:
                return False
        return False


class EmployeeDetailStatsSerializer(serializers.ModelSerializer):
    employee = EmployeeListSerializer(source='*', read_only=True)

    total_shifts_count = serializers.IntegerField(read_only=True)
    monthly_average_shifts = serializers.SerializerMethodField()
    monthly_shifts_current_year = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id',
            'user',
            'user_id',
            'employee',
            'total_shifts_count',
            'monthly_average_shifts',
            'monthly_shifts_current_year'
        ]

    @extend_schema_field(OpenApiTypes.FLOAT)
    def get_monthly_average_shifts(self, obj):
        if not obj.registration_date:
            return 0

        delta = timezone.now().date() - obj.registration_date
        months_elapsed = delta.days / 30

        if months_elapsed < 1:
            return obj.total_shifts_count

        return round(obj.total_shifts_count / months_elapsed, 2)

    @extend_schema_field(OpenApiTypes.OBJECT)
    def get_monthly_shifts_current_year(self, obj):
        """
        محاسبه تعداد شیفت‌ها برای هر ماه سال جاری
        خروجی: لیست ۱۲ تایی با تعداد شیفت هر ماه [count_month1, count_month2, ..., count_month12]
        """
        current_year = timezone.now().year

        # استفاده از Django database functions برای سازگاری با همه databaseها
        monthly_counts = (
            obj.assigned_shifts
            .filter(shift__start_time__year=current_year)
            .annotate(month=ExtractMonth('shift__start_time'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # تبدیل به دیکشنری برای دسترسی سریع
        count_dict = {item['month']: item['count'] for item in monthly_counts}

        # ایجاد لیست ۱۲ تایی (ماه ۱ تا ۱۲)
        result = [count_dict.get(month, 0) for month in range(1, 13)]

        return result


class EmployeeShiftHistorySerializer(serializers.ModelSerializer):
    """
    سریالایزر برای نمایش تاریخچه شیفت‌های کارمند
    از ShiftAssignment استفاده می‌کند تا اطلاعات تخصیص را داشته باشیم
    """
    approved_at = serializers.DateTimeField(source='assigned_at', read_only=True)
    occasion = serializers.CharField(source='shift.occasion', read_only=True)

    class Meta:
        model = ShiftAssignment
        fields = [
            'id',
            'approved_at',  # تاریخ تخصیص (معادل approved_at)
            'occasion'     # عنوان رویداد شیفت
        ]


class ShiftSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    current_males = serializers.IntegerField(source='current_males_count', read_only=True)
    current_females = serializers.IntegerField(source='current_females_count', read_only=True)

    class Meta:
        model = Shift
        fields = [
            'id',
            'start_time',
            'end_time',
            'occasion',
            'min_emp',          # جدید - کلی
            'max_emp',          # جدید - کلی
            'max_males',        # قبلی
            'max_females',      # قبلی
            'current_males',
            'current_females',
            'is_active',
            'created_by',
            'created_by_name',
            'created_at',
            'description',
        ]
        read_only_fields = ['created_by', 'created_by_name', 'created_at', 
                           'current_males', 'current_females']

    def validate(self, data):
        errors = {}
        
        min_emp = data.get('min_emp', 0)
        max_emp = data.get('max_emp', 0)
        max_males = data.get('max_males', 0)
        max_females = data.get('max_females', 0)
        
        if min_emp > max_emp:
            errors['min_emp'] = "حداقل تعداد کارکنان نمی‌تواند بیشتر از حداکثر باشد."
        

        if min_emp < 0:
            errors['min_emp'] = "حداقل تعداد کارکنان نمی‌تواند منفی باشد."
        if max_emp < 0:
            errors['max_emp'] = "حداکثر تعداد کارکنان نمی‌تواند منفی باشد."
        if max_males < 0:
            errors['max_males'] = "حداکثر مردان نمی‌تواند منفی باشد."
        if max_females < 0:
            errors['max_females'] = "حداکثر زنان نمی‌تواند منفی باشد."
        
        # چک ۳: مجموع max_males + max_females دقیقاً برابر max_emp باشه
        if max_males + max_females != max_emp:
            errors['max_emp'] = "مجموع حداکثر مردان و زنان باید دقیقاً برابر با حداکثر کل کارکنان باشد."
        
        # اگر خطایی بود، raise کن
        if errors:
            raise serializers.ValidationError(errors)
        
        return data

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)



class ShiftRequestSerializer(serializers.ModelSerializer):
    requested_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)
    employee_info = serializers.SerializerMethodField()

    def get_employee_info(self, obj):
        employee = obj.employee
        return {
            'id': employee.id,
            'first_name':employee.first_name,
            'last_name':employee.last_name,
            'phone': employee.phone,
            'criminal_record': employee.criminal_record
        }

    class Meta:
        model = ShiftRequest
        fields = [
            'id',
            'employee_info',
            'status',                 
            'requested_at',
        ]
        read_only_fields = [
            'id', 'employee', 'employee_id', 'employee_name',
            'employee_national_id', 'requested_at'
        ]


class ShiftRequestActionSerializer(serializers.Serializer):
    """
    Serializer مشترک برای approve_request و reject_request
    فقط request_id مورد نیاز است
    """
    request_id = serializers.IntegerField(
        required=True,
        help_text="ID درخواست شیفت که باید approve یا reject شود"
    )

    def validate_request_id(self, value):
        """
        Validation: بررسی اینکه request_id مثبت باشد
        """
        if value <= 0:
            raise serializers.ValidationError("request_id باید عدد مثبت باشد.")
        return value


class ShiftRequestActionResponseSerializer(serializers.Serializer):
    """
    Serializer برای پاسخ approve_request و reject_request
    """
    status = serializers.CharField(help_text="وضعیت عملیات (approved یا rejected)")


class ErrorResponseSerializer(serializers.Serializer):
    """
    Serializer برای پاسخ خطا
    """
    error = serializers.CharField(help_text="پیغام خطا")


class ShiftDetailSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    current_males = serializers.IntegerField(source='current_males_count', read_only=True)
    current_females = serializers.IntegerField(source='current_females_count', read_only=True)
    
    requests = ShiftRequestSerializer(many=True, read_only=True)  

    class Meta:
        model = Shift
        fields = [
            'id',
            'start_time',
            'end_time',
            'occasion',
            'min_emp',
            'max_emp',
            'max_males',
            'max_females',
            'current_males',
            'current_females',
            'is_active',
            'created_by',
            'created_by_name',
            'created_at',
            'description',
            'requests',  # فیلد جدید nested
        ]
        read_only_fields = ['created_by', 'created_by_name', 'created_at', 'current_males', 'current_females', 'requests']
    
    
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 
                  'username', 
                  'email', 
                  'phone_number', 
                  'date_joined'
                  ]
        read_only_fields = ['date_joined']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class AdminListSerializer(serializers.ModelSerializer):
    """
    Serializer برای لیست و جزئیات ادمین‌ها
    
    ویژگی‌ها:
    - بدون nested serializer (همه فیلدها مستقیم از مدل Employee)
    - فقط فیلدهای مورد نیاز برای نمایش لیست ادمین‌ها
    - شامل تمام فیلدهای دسترسی (can_...)
    
    استفاده:
    - GET /api/core/admin/ (list)
    - GET /api/core/admin/{id}/ (retrieve)
    """
    class Meta:
        model = Employee
        fields = [
            'id',
            'first_name',
            'last_name',
            'phone',
            'national_id',
            'can_manage_shifts',
            'can_manage_blog',
            'can_approve_registrations',
            'can_manage_khadamyaran',
            'can_manage_site_settings',
            'can_manage_admins',
        ]
        read_only_fields = fields  # همه فیلدها read-only (فقط نمایش)


class AdminCreateSerializer(serializers.Serializer):
    """
    Serializer برای ایجاد/بروزرسانی ادمین
    
    ویژگی‌ها:
    - employee_id: شناسه کارمند موجود که باید به ادمین تبدیل شود
    - فیلدهای دسترسی: می‌توانند true/false باشند
    - Validation: حداقل یک دسترسی باید true باشد
    - Validation: employee_id باید معتبر باشد
    
    استفاده:
    - POST /api/core/admin/ (create)
    - PATCH /api/core/admin/{id}/ (update)
    """
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        required=False,  # برای partial_update (update) نیاز نیست
        help_text="شناسه کارمند موجود که باید به ادمین تبدیل شود (فقط برای create)"
    )
    can_manage_shifts = serializers.BooleanField(required=False, default=False)
    can_manage_blog = serializers.BooleanField(required=False, default=False)
    can_approve_registrations = serializers.BooleanField(required=False, default=False)
    can_manage_khadamyaran = serializers.BooleanField(required=False, default=False)
    can_manage_site_settings = serializers.BooleanField(required=False, default=False)
    can_manage_admins = serializers.BooleanField(required=False, default=False)
    
    def validate(self, attrs):
        """
        Validation: 
        - برای create: employee_id الزامی است و حداقل یک دسترسی باید true باشد
        - برای update: employee_id نیاز نیست و validation در view انجام می‌شود
        """
        # اگر employee_id ارسال شده (create)، بررسی می‌کنیم
        if 'employee_id' in attrs:
            employee_id = attrs['employee_id']
        else:
            # در update، employee_id نیاز نیست
            employee_id = None
        
        permission_fields = [
            'can_manage_shifts',
            'can_manage_blog',
            'can_approve_registrations',
            'can_manage_khadamyaran',
            'can_manage_site_settings',
            'can_manage_admins',
        ]
        
        # بررسی اینکه حداقل یکی از فیلدهای دسترسی true باشد
        # فقط برای create (وقتی employee_id وجود دارد) این validation انجام می‌شود
        # برای update، validation در view انجام می‌شود (با در نظر گرفتن مقادیر فعلی)
        if employee_id:
            has_permission = any(
                attrs.get(field, False) for field in permission_fields
            )
            
            if not has_permission:
                raise serializers.ValidationError({
                    'permissions': 'حداقل یکی از دسترسی‌های ادمینی باید فعال باشد.'
                })
        
        return attrs
    
    def validate_employee_id(self, value):
        """
        Validation: بررسی اینکه employee وجود داشته باشد
        همچنین بررسی اینکه employee مربوط به سوپرادمین نباشد
        """
        if value.user.is_superuser:
            raise serializers.ValidationError("نمی‌توان سوپرادمین را به ادمین تبدیل کرد.")
        return value