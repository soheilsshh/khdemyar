from rest_framework import serializers

from django.contrib.auth import get_user_model

from .models import BlogPost, Employee, Shift

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
    class Meta:
        model = Employee
        fields = ['id',
                  'user',
                  'user_id',
                  'first_name',
                  'last_name',
                  'national_id',
                  'phone']

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
            'shift_count',

            # تأییدکننده (اختیاری)
            'approved_by',
            'approved_by_name',
        ]

        read_only_fields = [
            'id',
            'user',
            'employment_date',
            'registration_date',
            'shift_count',
            'approved_by_name',
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

class ShiftSerializer(serializers.ModelSerializer):
    employee = EmployeeListSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(), source='employee', write_only=True
    )
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = Shift
        fields = [
            'id',
            'employee',
            'employee_id',
            'start_time',
            'end_time',
            'occasion',
            'is_active',
            'created_by_name',
            'created_at'
        ]
        read_only_fields = ['created_at', 'created_by_name']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


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