# account/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from core.models import User, Employee

class EmployeeRegisterSerializer(serializers.ModelSerializer):
    # فیلدهای مربوط به User (که جداگانه ساخته می‌شن)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    phone_number = serializers.CharField(write_only=True, max_length=20)

    # اگر می‌خوای عکس پروفایل هم از فرم ثبت‌نام بیاد (اختیاری)
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Employee
        fields = [
            # فیلدهای User
            'username',
            'password',
            'phone_number',

            # فیلدهای اصلی Employee
            'first_name',
            'last_name',
            'national_id',
            'father_name',
            'birth_date',
            'gender',
            'marital_status',
            'children_count',
            'education_level',
            'field_of_study',
            'nationality',
            'religion',
            'sect',

            # فیلدهای جدید اضافه‌شده
            'criminal_record',          # حالا TextField هست (نه بولین)
            'registration_date',        # اختیاری - خودکار پر می‌شه، ولی می‌تونی بفرستی
            'current_job',
            'religious_background',
            'disability',
            'skills',
            'profile_image',

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

            # وضعیت خدمت (مخصوص مردها)
            'military_status',
        ]

        extra_kwargs = {
            'national_id': {'validators': []},  
            'profile_image': {'required': False},
            'registration_date': {'read_only': True},  # خودکار پر می‌شه
        }

    def validate(self, attrs):
        username = attrs.get('username')
        phone_number = attrs.get('phone_number')
        national_id = attrs.get('national_id')

        # چک تکراری بودن
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "این نام کاربری قبلاً استفاده شده است."})

        if User.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError({"phone_number": "این شماره موبایل قبلاً ثبت شده است."})

        if Employee.objects.filter(national_id=national_id).exists():
            raise serializers.ValidationError({"national_id": "کارمندی با این کد ملی قبلاً ثبت‌نام کرده است."})

        return attrs

    def create(self, validated_data):
        # جدا کردن داده‌های User
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        phone_number = validated_data.pop('phone_number')

        # ساخت کاربر با وضعیت غیرفعال (تا مدیر تأیید کنه)
        user = User.objects.create_user(
            username=username,
            password=password,
            phone_number=phone_number,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=False,           # منتظر تأیید مدیر
            is_approved=False,
        )

        # ساخت پروفایل کارمند
        # اگر profile_image فرستاده شده باشه، بهش دسترسی داریم
        profile_image = validated_data.pop('profile_image', None)

        employee = Employee.objects.create(
            user=user,
            status='pending',  # یا 'در انتظار' بسته به choices
            registration_date=validated_data.get('registration_date'),  # اگر نداد خودکار پر می‌شه
            **validated_data
        )

        # اگر عکس آپلود شده بود، ذخیره کن
        if profile_image:
            employee.profile_image = profile_image
            employee.save(update_fields=['profile_image'])

        return employee

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("نام کاربری یا رمز عبور اشتباه است.")
        if not user.is_active:
            raise serializers.ValidationError("حساب شما توسط مدیر تأیید نشده است.")
        data['user'] = user
        return data

class OTPRequestSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_approved']