from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BlogPost, Employee, Shift , ShiftRequest

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

    # نمایش نام کامل تأییدکننده (اگر فیلد approved_by داری)
    approved_by_name = serializers.CharField(
        source='approved_by.get_full_name' if hasattr(Employee, 'approved_by') else None,
        read_only=True
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
            'approved_by_name',
            
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
            'approved_by_name',
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
            'max_males',
            'max_females',
            'current_males',
            'current_females',
            'is_active',
            'created_by',
            'created_by_name',
            'created_at',
        ]
        read_only_fields = ['created_by', 'created_by_name', 'created_at', 'current_males', 'current_females']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)



class ShiftRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.__str__', read_only=True)
    employee_national_id = serializers.CharField(source='employee.national_id', read_only=True)
    requested_at = serializers.DateTimeField(format='%Y-%m-%d %H:%M', read_only=True)

    class Meta:
        model = ShiftRequest
        fields = [
            'id',
            'employee',
            'employee_name',
            'employee_national_id',
            'status',
            'requested_at',
        ]


class BlogPostSerializer(serializers.ModelSerializer):
    author = UserShortSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_admin=True),
        source='author', write_only=True
    )

    class Meta:
        model = BlogPost
        fields = [
            'id',
            'author',
            'author_id',
            'title',
            'content',
            'image',
            'created_at',
            'updated_at',
            'is_published'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
    

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