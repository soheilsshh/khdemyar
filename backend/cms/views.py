from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone

from drf_spectacular.utils import extend_schema

from core.permissions import IsActiveAdmin, CanManageBlog
from .models import *
from .serializers import *

from dateutil.relativedelta import relativedelta
from datetime import timedelta


class NewsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing News content.
    Only users with can_manage_blog=True can perform CRUD operations.
    """
    queryset = News.objects.all().order_by('-date')
    serializer_class = NewsSerializer

    def get_permissions(self):
        """All CRUD operations require IsAuthenticated, IsActiveAdmin, and CanManageBlog"""
        return [IsAuthenticated(), IsActiveAdmin(), CanManageBlog()]

    def get_serializer_class(self):
        """Use NewsListSerializer for list action, NewsSerializer for others"""
        if self.action == 'list':
            return NewsListSerializer
        return NewsSerializer


class AboutUsView(APIView):
    """
    API View for managing About Us content (singleton).
    GET: Retrieve the single AboutUs record
    PATCH/PUT: Update the AboutUs record
    """
    permission_classes = [IsAuthenticated, IsActiveAdmin, CanManageBlog]
    
    @extend_schema(
        responses={200: AboutUsSerializer},
        description="Retrieve the single AboutUs record"
    )
    def get(self, request):
        """Get the single AboutUs record, create if it doesn't exist"""
        about_us = AboutUs.get_instance()
        serializer = AboutUsSerializer(about_us)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=AboutUsSerializer,
        responses={200: AboutUsSerializer},
        description="Partially update the AboutUs record"
    )
    def patch(self, request):
        """Partially update the AboutUs record"""
        about_us = AboutUs.get_instance()
        serializer = AboutUsSerializer(about_us, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=AboutUsSerializer,
        responses={200: AboutUsSerializer},
        description="Full update of the AboutUs record"
    )
    def put(self, request):
        """Full update of the AboutUs record"""
        about_us = AboutUs.get_instance()
        serializer = AboutUsSerializer(about_us, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsActiveAdmin]  

    def get(self, request):
        """دریافت آمار داشبورد"""
        serializer = DashboardSerializer({})  
        return Response(serializer.data, status=status.HTTP_200_OK)

class VisitTrackView(APIView):
    """
    API View برای ثبت بازدید صفحات از سمت فرانت‌اند
    
    این endpoint توسط فرانت‌اند بعد از لود صفحه فراخوانی می‌شود.
    IP و user_agent به صورت خودکار از request استخراج می‌شوند.
    
    ویژگی‌ها:
    - بدون احراز هویت (AllowAny)
    - Rate limiting: 60 ثانیه برای جلوگیری از اسپم
    - Silent fail: در صورت تکراری بودن، خطا نمی‌دهد
    - پاسخ سریع: 204 No Content برای کاهش payload
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=VisitCreateSerializer,
        responses={
            204: None,
            400: 'Bad Request'
        },
        description="ثبت بازدید صفحه از سمت فرانت‌اند. IP و user_agent به صورت خودکار استخراج می‌شوند.",
        summary="ثبت بازدید صفحه"
    )
    def post(self, request):
        """
        ثبت بازدید جدید
        
        Input: فقط path (مسیر صفحه)
        Output: 204 No Content (بدون body)
        
        اگر بازدید در 60 ثانیه گذشته ثبت شده باشد، 
        به صورت silent fail عمل می‌کند (204 برمی‌گرداند)
        """
        serializer = VisitCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            visit = serializer.save()
            # Silent fail: اگر visit None باشد (تکراری)، 
            # همچنان 204 برمی‌گردانیم بدون body
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        # در صورت validation error، 400 برمی‌گردانیم
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisitStatsView(APIView):
    """
    API View برای دریافت آمار بازدیدها
    
    فقط برای ادمین‌ها قابل دسترسی (IsActiveAdmin)
    آمار شامل:
    - تعداد کل بازدیدها
    - بازدیدهای ماه جاری
    - بازدیدهای امروز
    - بازدیدهای دیروز
    - درصد رشد ماهانه
    """
    permission_classes = [permissions.IsAuthenticated, IsActiveAdmin]

    @extend_schema(
        responses={200: VisitStatsSerializer},
        description="دریافت آمار بازدیدها. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="آمار بازدیدها"
    )
    def get(self, request):
        """
        دریافت آمار بازدیدها
        
        شامل:
        - total_visits: تعداد کل
        - this_month_visits: ماه جاری
        - today_visits: امروز
        - yesterday_visits: دیروز
        - monthly_growth: درصد رشد ماهانه (با مدیریت تقسیم بر صفر)
        """
        now = timezone.now()
        
        # محاسبه تاریخ‌های مهم
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)
        yesterday_end = today_start - timedelta(seconds=1)
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # ماه قبل
        prev_month_start = this_month_start - relativedelta(months=1)
        prev_month_end = this_month_start - timedelta(seconds=1)
        
        # Queryهای بهینه با aggregation
        queryset = Visit.objects.all()
        
        total_visits = queryset.count()
        this_month_count = queryset.filter(created_at__gte=this_month_start).count()
        today_count = queryset.filter(created_at__gte=today_start).count()
        yesterday_count = queryset.filter(
            created_at__gte=yesterday_start,
            created_at__lte=yesterday_end
        ).count()
        
        # محاسبه رشد ماهانه
        prev_month_count = queryset.filter(
            created_at__gte=prev_month_start,
            created_at__lte=prev_month_end
        ).count()
        
        # مدیریت تقسیم بر صفر
        if prev_month_count > 0:
            monthly_growth = round(((this_month_count - prev_month_count) / prev_month_count) * 100, 2)
        else:
            monthly_growth = 0.0
        
        data = {
            "total_visits": total_visits,
            "this_month_visits": this_month_count,
            "today_visits": today_count,
            "yesterday_visits": yesterday_count,
            "monthly_growth": monthly_growth
        }
        
        serializer = VisitStatsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)