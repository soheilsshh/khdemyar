from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Employee

User = get_user_model()


class UserShortSerializer(serializers.ModelSerializer):
    shift_count = serializers.IntegerField(source='employee.shift_count', read_only=True)
    has_criminal_record = serializers.BooleanField(source='employee.has_criminal_record', read_only=True)

    class Meta:
        model = User
        fields = ['id',
                  'username',
                  'email',
                  'first_name',
                  'last_name',
                  'shift_count',
                  'has_criminal_record'
                  ]


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
