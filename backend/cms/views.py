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
    ثبت بازدید جدید توسط فرانت‌اند
    اجازه دسترسی بدون احراز هویت (AllowAny)
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VisitCreateSerializer(data=request.data)
        if serializer.is_valid():
            visit = serializer.save()
            if visit is None:
                return Response(
                    {"detail": "بازدید تکراری در بازه زمانی کوتاه"},
                    status=status.HTTP_202_ACCEPTED
                )
            return Response({"status": "registered"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VisitStatsView(APIView):
    """
    آمار بازدیدها برای داشبورد
    فقط برای ادمین‌ها قابل دسترسی
    """
    permission_classes = [permissions.IsAuthenticated, IsActiveAdmin]  # یا هر permission دلخواه

    def get(self, request):
        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # ماه جاری
        this_month_start = month_start
        this_month_count = Visit.objects.filter(created_at__gte=this_month_start).count()
        
        # ماه قبل
        prev_month_start = this_month_start - relativedelta(months=1)
        prev_month_end = this_month_start - relativedelta(seconds=1)
        prev_month_count = Visit.objects.filter(
            created_at__gte=prev_month_start,
            created_at__lte=prev_month_end
        ).count()
        
        # محاسبه رشد
        growth = 0
        if prev_month_count > 0:
            growth = ((this_month_count - prev_month_count) / prev_month_count) * 100
        
        data = {
            "total_visits": Visit.objects.count(),
            "this_month_visits": this_month_count,
            "monthly_growth": round(growth, 2)
        }
        
        serializer = VisitStatsSerializer(data)
        return Response(serializer.data)