from rest_framework import serializers
from django.contrib.auth import authenticate
from core.models import User, Employee


# برای نمایش در لیست درخواست‌ها (pending / rejected)
class RegistrationRequestListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    phone_number = serializers.CharField(source='user.phone_number', read_only=True)
    full_name = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(source='user.date_joined', read_only=True, format='%Y-%m-%d %H:%M')

    class Meta:
        model = Employee
        fields = [
            'id',
            'username',
            'phone_number',
            'first_name',
            'last_name',
            'full_name',
            'national_id',
            'phone',
            'status',
            'created_at',
        ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()



class ApprovalActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject'], write_only=True)


class EmployeeRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    phone_number = serializers.CharField(write_only=True, max_length=20)
    profile_image = serializers.ImageField(required=False, allow_null=True)

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
            'criminal_record', 
            'current_job', 
            'religious_background', 
            'disability', 
            'skills',
            'profile_image', 
            
            'phone', 
            'social_phone', 
            'work_phone', 
            'home_phone',
            'work_address', 
            'home_address',
             
            'ref1_name', 
            'ref1_phone', 
            'ref2_name', 
            'ref2_phone',
            
            'military_status',
        ]
        extra_kwargs = {
            'national_id': {'validators': []},
            'profile_image': {'required': False},
        }

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "این نام کاربری قبلاً استفاده شده است."})
        if User.objects.filter(phone_number=attrs['phone_number']).exists():
            raise serializers.ValidationError({"phone_number": "این شماره موبایل قبلاً ثبت شده است."})
        if Employee.objects.filter(national_id=attrs['national_id']).exists():
            raise serializers.ValidationError({"national_id": "کارمندی با این کد ملی قبلاً ثبت‌نام کرده است."})
        return attrs

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        phone_number = validated_data.pop('phone_number')
        profile_image = validated_data.pop('profile_image', None)

        user = User.objects.create_user(
            username=username,
            password=password,
            phone_number=phone_number,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_active=False,
            is_approved=False,
        )

        employee = Employee.objects.create(user=user, status='pending', **validated_data)
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
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_active', 
            'is_approved'
            ]