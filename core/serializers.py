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
        queryset=User.objects.all(), source='user', write_only=True, required=False
    )

    class Meta:
        model = Employee
        fields = [
            'id',
            'user',
            'user_id',
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
            'employment_date',
            'phone',
            'social_phone',
            'work_phone',
            'home_phone',
            'work_address',
            'home_address',
            'shift_count',
            'military_status'
        ]
        read_only_fields = ['id', 'user', 'employment_date', 'shift_count']

    def create(self, validated_data):
        user = validated_data.pop('user', None)
        if user is None:
            raise serializers.ValidationError("برای ایجاد کارمند باید user مشخص شود (user_id).")
        return Employee.objects.create(user=user, **validated_data)

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