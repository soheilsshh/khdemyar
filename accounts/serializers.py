# account/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from core.models import User, Employee

class EmployeeRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True)

    class Meta:
        model = Employee
        fields = [
            'username',
            'password',
            'phone_number',
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
            'has_criminal_record',
            'phone', 
            'social_phone', 
            'work_phone', 
            'home_phone',
            'work_address', 
            'home_address', 
            'military_status'
        ]
        extra_kwargs = {
            'national_id': {'validators': []},  
        }
    def validate(self, data):
        username = data['username']
        phone_number = data['phone_number']
        national_id = data['national_id']

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "این نام کاربری قبلاً استفاده شده است."})
        if User.objects.filter(phone_number=phone_number).exists():
            raise serializers.ValidationError({"phone_number": "این شماره موبایل قبلاً ثبت شده است."})
        if Employee.objects.filter(national_id=national_id).exists():
            raise serializers.ValidationError({"national_id": "کارمندی با این کد ملی قبلاً ثبت‌نام کرده است."})

        return data

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        phone_number = validated_data.pop('phone_number')

        user = User.objects.create_user(
            username=username,
            password=password,
            phone_number=phone_number,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=False
        )

        employee = Employee.objects.create(
            user=user,
            status='pending',
            **validated_data
        )

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