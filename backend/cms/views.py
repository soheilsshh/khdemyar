from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from django.utils import timezone
from django.db import transaction

from drf_spectacular.utils import extend_schema, OpenApiTypes

from core.permissions import IsActiveAdmin, CanManageBlog
from core.pagination import PersianPagination
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
    pagination_class = PersianPagination

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

    @extend_schema(
        responses={
            200: DashboardSerializer,
            401: OpenApiTypes.OBJECT,
            403: OpenApiTypes.OBJECT
        },
        description="دریافت آمار کلی داشبورد مدیریتی شامل تعداد کارمندان، شیفت‌های تکمیل شده، بازدیدهای ماه جاری و رشد ماهانه.",
        summary="آمار داشبورد مدیریتی"
    )
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
            400: OpenApiTypes.OBJECT
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


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت بازخوردهای کاربران

    قابلیت‌ها:
    - create: برای همه کاربران (AllowAny) - ثبت بازخورد جدید
    - list, retrieve, update, partial_update, destroy: فقط برای ادمین‌ها (IsActiveAdmin)

    ساختار:
    - استفاده از ModelViewSet برای CRUD کامل
    - دو سریالایزر: FeedbackCreateSerializer برای create، FeedbackSerializer برای سایر عملیات
    - مرتب‌سازی پیش‌فرض بر اساس created_at نزولی
    """
    queryset = Feedback.objects.all().order_by('-created_at')
    serializer_class = FeedbackSerializer
    pagination_class = PersianPagination
    
    def get_permissions(self):
        """
        تعیین permission‌ها بر اساس action
        - create: AllowAny (همه می‌توانند بازخورد ثبت کنند)
        - سایر عملیات: IsAuthenticated + IsActiveAdmin (فقط ادمین‌ها)
        """
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAuthenticated(), IsActiveAdmin()]
    
    def get_serializer_class(self):
        """
        انتخاب سریالایزر مناسب بر اساس action
        - create: FeedbackCreateSerializer (فقط فیلدهای لازم برای ثبت)
        - سایر عملیات: FeedbackSerializer (همه فیلدها شامل status و is_read)
        """
        if self.action == 'create':
            return FeedbackCreateSerializer
        return FeedbackSerializer
    
    @extend_schema(
        request=FeedbackCreateSerializer,
        responses={201: FeedbackCreateSerializer},
        description="ثبت بازخورد جدید. همه کاربران می‌توانند از این endpoint استفاده کنند.",
        summary="ثبت بازخورد"
    )
    def create(self, request, *args, **kwargs):
        """
        ثبت بازخورد جدید
        همه کاربران می‌توانند بازخورد ثبت کنند (AllowAny)
        """
        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        responses={200: FeedbackSerializer(many=True)},
        description="لیست تمام بازخوردها. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="لیست بازخوردها"
    )
    def list(self, request, *args, **kwargs):
        """
        لیست تمام بازخوردها
        فقط برای ادمین‌ها قابل دسترسی است
        مرتب‌سازی پیش‌فرض: جدیدترین به قدیمی‌ترین
        """
        return super().list(request, *args, **kwargs)
    
    @extend_schema(
        responses={200: FeedbackSerializer},
        description="جزئیات یک بازخورد. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="جزئیات بازخورد"
    )
    def retrieve(self, request, *args, **kwargs):
        """
        نمایش جزئیات یک بازخورد
        فقط برای ادمین‌ها قابل دسترسی است
        """
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        request=FeedbackSerializer,
        responses={200: FeedbackSerializer},
        description="ویرایش کامل بازخورد. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="ویرایش بازخورد"
    )
    def update(self, request, *args, **kwargs):
        """
        ویرایش کامل بازخورد (PUT)
        فقط برای ادمین‌ها قابل دسترسی است
        """
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        request=FeedbackSerializer,
        responses={200: FeedbackSerializer},
        description="ویرایش جزئی بازخورد (PATCH). فقط برای ادمین‌ها قابل دسترسی است.",
        summary="ویرایش جزئی بازخورد"
    )
    def partial_update(self, request, *args, **kwargs):
        """
        ویرایش جزئی بازخورد (PATCH)
        فقط برای ادمین‌ها قابل دسترسی است
        برای تغییر status و is_read استفاده می‌شود
        """
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        responses={204: None},
        description="حذف بازخورد. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="حذف بازخورد"
    )
    def destroy(self, request, *args, **kwargs):
        """
        حذف بازخورد
        فقط برای ادمین‌ها قابل دسترسی است
        """
        return super().destroy(request, *args, **kwargs)


class ContactInfoView(APIView):
    """
    API View برای مدیریت اطلاعات تماس با ما (singleton)
    
    قابلیت‌ها:
    - GET: برای همه کاربران (AllowAny) - نمایش اطلاعات تماس
    - PATCH/PUT: فقط برای ادمین‌ها (IsAuthenticated + IsActiveAdmin) - ویرایش اطلاعات
    
    ساختار:
    - استفاده از APIView برای کنترل دقیق‌تر (singleton pattern)
    - استفاده از get_instance() برای اطمینان از وجود رکورد
    - اگر رکورد وجود نداشت، خودکار ایجاد می‌شود
    - GET: AllowAny (permission_classes)
    - PUT/PATCH: بررسی دستی permission در متد
    """
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        responses={200: ContactInfoSerializer},
        description="نمایش اطلاعات تماس با ما. همه کاربران می‌توانند از این endpoint استفاده کنند.",
        summary="نمایش اطلاعات تماس"
    )
    def get(self, request):
        """
        نمایش اطلاعات تماس با ما
        برای همه کاربران قابل دسترسی است (AllowAny)
        اگر رکورد وجود نداشت، خودکار ایجاد می‌شود
        """
        contact_info = ContactInfo.get_instance()
        serializer = ContactInfoSerializer(contact_info)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def _check_admin_permission(self, request):
        """
        بررسی دسترسی ادمین برای PUT/PATCH
        بررسی IsAuthenticated و IsActiveAdmin
        """
        if not request.user.is_authenticated:
            return False
        
        # بررسی IsActiveAdmin
        admin_permission = IsActiveAdmin()
        return admin_permission.has_permission(request, self)
    
    @extend_schema(
        request=ContactInfoSerializer,
        responses={
            200: ContactInfoSerializer,
            400: OpenApiTypes.OBJECT,
            403: OpenApiTypes.OBJECT
        },
        description="ویرایش کامل اطلاعات تماس (PUT). فقط برای ادمین‌ها قابل دسترسی است.",
        summary="ویرایش کامل اطلاعات تماس"
    )
    def put(self, request):
        """
        ویرایش کامل اطلاعات تماس (PUT)
        فقط برای ادمین‌ها قابل دسترسی است
        """
        # بررسی دسترسی ادمین
        if not self._check_admin_permission(request):
            return Response(
                {'detail': 'شما مجاز به ویرایش اطلاعات تماس نیستید.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        contact_info = ContactInfo.get_instance()
        serializer = ContactInfoSerializer(contact_info, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        request=ContactInfoSerializer,
        responses={
            200: ContactInfoSerializer,
            400: OpenApiTypes.OBJECT,
            403: OpenApiTypes.OBJECT
        },
        description="ویرایش جزئی اطلاعات تماس (PATCH). فقط برای ادمین‌ها قابل دسترسی است.",
        summary="ویرایش جزئی اطلاعات تماس"
    )
    def patch(self, request):
        """
        ویرایش جزئی اطلاعات تماس (PATCH)
        فقط برای ادمین‌ها قابل دسترسی است
        """
        # بررسی دسترسی ادمین
        if not self._check_admin_permission(request):
            return Response(
                {'detail': 'شما مجاز به ویرایش اطلاعات تماس نیستید.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        contact_info = ContactInfo.get_instance()
        serializer = ContactInfoSerializer(contact_info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubtitleViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت زیرنویس‌های صفحه اصلی

    قابلیت‌ها:
    - CRUD کامل: create, list, retrieve, update, partial_update, destroy
    - تمام عملیات فقط برای ادمین‌ها (IsAuthenticated + IsActiveAdmin + CanManageBlog)
    - action سفارشی: toggle-active (فعال/غیرفعال کردن زیرنویس)

    منطق "فقط یکی active":
    - هنگام create/update/partial_update: اگر is_active=True باشد، بقیه خودکار غیرفعال می‌شوند
    - در action toggle-active: رکورد انتخاب شده فعال می‌شود و بقیه غیرفعال می‌شوند
    - استفاده از transaction برای اطمینان از atomic بودن عملیات

    ساختار:
    - استفاده از ModelViewSet برای CRUD کامل
    - استفاده از CanManageBlog برای permission (مثل NewsViewSet)
    - مرتب‌سازی پیش‌فرض بر اساس created_at نزولی
    """
    queryset = Subtitle.objects.all().order_by('-created_at')
    serializer_class = SubtitleSerializer
    pagination_class = PersianPagination
    
    def get_permissions(self):
        """
        تعیین permission‌ها برای تمام عملیات
        تمام عملیات نیاز به IsAuthenticated + IsActiveAdmin + CanManageBlog دارند
        (مثل NewsViewSet)
        """
        return [IsAuthenticated(), IsActiveAdmin(), CanManageBlog()]
    
    def _deactivate_others(self, current_instance=None):
        """
        متد helper برای غیرفعال کردن تمام زیرنویس‌های دیگر
        در صورت وجود current_instance، آن را از لیست استثنا می‌کند
        
        استفاده از transaction برای اطمینان از atomic بودن عملیات
        """
        with transaction.atomic():
            queryset = Subtitle.objects.filter(is_active=True)
            if current_instance:
                queryset = queryset.exclude(pk=current_instance.pk)
            queryset.update(is_active=False)
    
    def perform_create(self, serializer):
        """
        override perform_create برای مدیریت منطق "فقط یکی active"
        اگر is_active=True باشد، بقیه را غیرفعال می‌کنیم
        """
        instance = serializer.save()
        if instance.is_active:
            self._deactivate_others(current_instance=instance)
    
    def perform_update(self, serializer):
        """
        override perform_update برای مدیریت منطق "فقط یکی active"
        اگر is_active=True باشد، بقیه را غیرفعال می‌کنیم
        """
        instance = serializer.save()
        if instance.is_active:
            self._deactivate_others(current_instance=instance)
    
    @extend_schema(
        request=None,
        responses={200: SubtitleSerializer},
        description="فعال/غیرفعال کردن زیرنویس. زیرنویس انتخاب شده فعال می‌شود و بقیه غیرفعال می‌شوند.",
        summary="فعال/غیرفعال کردن زیرنویس"
    )
    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        """
        Action سفارشی برای فعال/غیرفعال کردن زیرنویس
        
        منطق:
        - زیرنویس انتخاب شده فعال می‌شود (is_active=True)
        - تمام زیرنویس‌های دیگر خودکار غیرفعال می‌شوند
        - استفاده از transaction برای اطمینان از atomic بودن عملیات
        
        اگر زیرنویس قبلاً فعال بود، همچنان فعال می‌ماند (toggle نیست، بلکه force activate است)
        این منطق برای UX بهتر است: کاربر می‌خواهد زیرنویس خاصی را فعال کند
        """
        subtitle = self.get_object()
        
        with transaction.atomic():
            # غیرفعال کردن تمام زیرنویس‌های دیگر
            self._deactivate_others(current_instance=subtitle)
            # فعال کردن زیرنویس انتخاب شده
            subtitle.is_active = True
            subtitle.save(update_fields=['is_active'])
        
        serializer = self.get_serializer(subtitle)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @extend_schema(
        request=SubtitleSerializer,
        responses={201: SubtitleSerializer},
        description="ایجاد زیرنویس جدید. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="ایجاد زیرنویس"
    )
    def create(self, request, *args, **kwargs):
        """
        ایجاد زیرنویس جدید
        اگر is_active=True باشد، بقیه خودکار غیرفعال می‌شوند
        """
        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        responses={200: SubtitleSerializer(many=True)},
        description="لیست تمام زیرنویس‌ها. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="لیست زیرنویس‌ها"
    )
    def list(self, request, *args, **kwargs):
        """
        لیست تمام زیرنویس‌ها
        مرتب‌سازی پیش‌فرض: جدیدترین به قدیمی‌ترین
        """
        return super().list(request, *args, **kwargs)
    
    @extend_schema(
        responses={200: SubtitleSerializer},
        description="جزئیات یک زیرنویس. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="جزئیات زیرنویس"
    )
    def retrieve(self, request, *args, **kwargs):
        """
        نمایش جزئیات یک زیرنویس
        """
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        request=SubtitleSerializer,
        responses={200: SubtitleSerializer},
        description="ویرایش کامل زیرنویس (PUT). اگر is_active=True باشد، بقیه غیرفعال می‌شوند.",
        summary="ویرایش کامل زیرنویس"
    )
    def update(self, request, *args, **kwargs):
        """
        ویرایش کامل زیرنویس (PUT)
        اگر is_active=True باشد، بقیه خودکار غیرفعال می‌شوند
        """
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        request=SubtitleSerializer,
        responses={200: SubtitleSerializer},
        description="ویرایش جزئی زیرنویس (PATCH). اگر is_active=True باشد، بقیه غیرفعال می‌شوند.",
        summary="ویرایش جزئی زیرنویس"
    )
    def partial_update(self, request, *args, **kwargs):
        """
        ویرایش جزئی زیرنویس (PATCH)
        اگر is_active=True باشد، بقیه خودکار غیرفعال می‌شوند
        """
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        responses={204: None},
        description="حذف زیرنویس. فقط برای ادمین‌ها قابل دسترسی است.",
        summary="حذف زیرنویس"
    )
    def destroy(self, request, *args, **kwargs):
        """
        حذف زیرنویس
        """
        return super().destroy(request, *args, **kwargs)