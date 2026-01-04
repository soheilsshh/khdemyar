from rest_framework import serializers
from .models import *
from dateutil.relativedelta import relativedelta


class NewsListSerializer(serializers.ModelSerializer):
    """Serializer for listing news with fewer fields"""
    class Meta:
        model = News
        fields = ['id', 'title', 'date', 'image', 'created_at']
        read_only_fields = ['created_at']


class NewsSerializer(serializers.ModelSerializer):
    """Full serializer for CRUD operations"""
    class Meta:
        model = News
        fields = [
            'id',
            'title',
            'date',
            'description',
            'image',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AboutUsSerializer(serializers.ModelSerializer):
    """Serializer for About Us content"""
    class Meta:
        model = AboutUs
        fields = [
            'id',
            'description',
            'image',
            'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


class DashboardSerializer(serializers.Serializer):
    total_employees = serializers.SerializerMethodField()
    completed_shifts = serializers.SerializerMethodField()
    this_month_visits = serializers.SerializerMethodField()
    monthly_growth = serializers.SerializerMethodField()

    def get_total_employees(self, obj):
        return Employee.objects.count()

    def get_completed_shifts(self, obj):
        now = timezone.now()
        return Shift.objects.filter(end_time__lt=now).count()  

    def get_this_month_visits(self, obj):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return Visit.objects.filter(created_at__gte=month_start).count()

    def get_monthly_growth(self, obj):
        now = timezone.now()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # ماه قبل
        prev_month_start = this_month_start - relativedelta(months=1)
        prev_month_end = this_month_start - relativedelta(seconds=1)  # پایان ماه قبل
        
        this_month_count = Visit.objects.filter(created_at__gte=this_month_start).count()
        prev_month_count = Visit.objects.filter(
            created_at__gte=prev_month_start,
            created_at__lte=prev_month_end
        ).count()
        
        if prev_month_count == 0:
            return 0  
        growth = ((this_month_count - prev_month_count) / prev_month_count) * 100
        return round(growth, 2)


class VisitCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ['path', 'ip_address']
        read_only_fields = ['created_at']  

    def create(self, validated_data):

        recent = Visit.objects.filter(
            ip_address=validated_data.get('ip_address'),
            created_at__gte=timezone.now() - timezone.timedelta(minutes=5)
        ).exists()
        
        if recent:
            return None  
        
        return super().create(validated_data)


class VisitStatsSerializer(serializers.Serializer):
    """آمار بازدیدها برای داشبورد"""
    total_visits = serializers.IntegerField(read_only=True)
    this_month_visits = serializers.IntegerField(read_only=True)
    monthly_growth = serializers.FloatField(read_only=True)