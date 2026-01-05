from rest_framework import viewsets, status, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters

from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from django.db import transaction

from drf_spectacular.utils import extend_schema

from .models import Employee, Shift, ShiftRequest
from .serializers import *
from .permissions import *
from .filters import EmployeeFilter
from .pagination import PersianPagination

User = get_user_model()


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('user').all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAdminOrSelf]
    pagination_class = PersianPagination
    
    filter_backends = [
            DjangoFilterBackend,
            filters.OrderingFilter,
        ]
    filterset_class = EmployeeFilter
    ordering_fields = ['first_name', 'last_name', 'user__date_joined', 'total_shifts_count']
    ordering = ['first_name']
    
    def get_serializer_class(self):
        if self.action in ['list', 'me']:
            return EmployeeListSerializer
        if self.action == 'active-emp':
            return ActiveEmployeeListSerializer
        if self.action == 'change_password':
            return ChangePasswordSerializer
        if self.action == 'detailed':
            return EmployeeDetailStatsSerializer
        return EmployeeSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action in ['list', 'retrieve', 'me', 'detailed']:
            queryset = queryset.annotate(total_shifts_count=Count('assigned_shifts'))
        if not (self.request.user.is_admin or self.request.user.is_staff):
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response({"detail": "پروفایل کارمندی یافت نشد"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(employee)
        return Response(serializer.data)
    
    @extend_schema(
        responses={200: ActiveEmployeeListSerializer(many=True)},
        description="لیست کارمندان فعال (کارمندانی که در شیفت‌های فعال امروز حضور دارند) با pagination",
        summary="کارمندان فعال امروز"
    )
    @action(detail=False, methods=['get'], url_path='active-emp')
    def active_emp(self, request):
        """
        نمایش لیست کارمندان فعال (کارمندانی که در شیفت‌های فعال امروز حضور دارند)

        تعریف کارمند فعال:
        - کارمندی که در تاریخ امروز حداقل در یک شیفت فعال حضور دارد
        - شیفت فعال: شیفتی که تاریخ امروز بین start_time و end_time آن قرار دارد
        """
        today = timezone.now().date()

        # فیلتر کارمندانی که در شیفت‌های فعال امروز حضور دارند
        active_employees = (
            Employee.objects
            .filter(
                # کارمند باید assignment در شیفت‌های فعال امروز داشته باشد
                assigned_shifts__shift__start_time__date__lte=today,
                assigned_shifts__shift__end_time__date__gte=today,
                assigned_shifts__shift__is_active=True
            )
            .annotate(total_shifts_count=Count('assigned_shifts'))
            .distinct()
            .order_by('first_name', 'last_name')
        )

        # اعمال pagination
        page = self.paginate_queryset(active_employees)
        if page is not None:
            serializer = ActiveEmployeeListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ActiveEmployeeListSerializer(active_employees, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='me/change-password')
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get('old_password')):
                return Response({"old_password": ["پسورد فعلی اشتباه است."]}, status=status.HTTP_400_BAD_REQUEST)
                
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({"message": "پسورد با موفقیت تغییر کرد."}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=True, methods=['get'], url_path='detailed')
    def detailed(self, request, pk=None):
        employee = self.get_queryset().prefetch_related('assigned_shifts__shift').get(pk=pk)
        serializer = EmployeeDetailStatsSerializer(employee)
        return Response(serializer.data)

    @extend_schema(
        responses={200: EmployeeShiftHistorySerializer(many=True)},
        description="لیست شیفت‌های تخصیص‌یافته به کارمند با pagination",
        summary="تاریخچه شیفت‌های کارمند"
    )
    @action(detail=True, methods=['get'], url_path='shifts')
    def shifts(self, request, pk=None):
        """
        نمایش لیست paginated شیفت‌های تخصیص‌یافته به کارمند
        دسترسی: ادمین یا خود کاربر (IsAdminOrSelf)
        مرتب‌سازی: بر اساس assigned_at نزولی
        """
        employee = self.get_object()

        # گرفتن شیفت‌های تخصیص‌یافته با مرتب‌سازی نزولی بر اساس زمان تخصیص
        assignments = employee.assigned_shifts.select_related('shift').order_by('-assigned_at')

        # اعمال pagination خودکار توسط ViewSet
        page = self.paginate_queryset(assignments)
        if page is not None:
            serializer = EmployeeShiftHistorySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = EmployeeShiftHistorySerializer(assignments, many=True)
        return Response(serializer.data)


class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PersianPagination

    
    def get_serializer_class(self):
        if self.action == ['list']:
            return ShiftListSerializer        
        if self.action in ['get_requests' , 'request_shift']:
            return ShiftRequestSerializer
        if self.action == 'retrieve':  
            return ShiftDetailSerializer
        return ShiftSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsActiveAdmin(), CanManageShifts()]  
        
        if self.action in ['get_requests', 'approve_request', 'reject_request']:
            return [IsActiveAdmin(), CanManageShifts()]
        
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Shift.objects.select_related(
            'created_by'
        ).filter(is_active=True)

        employee_id = self.request.query_params.get('employee')
        if employee_id:
            queryset = queryset.filter(assignments__employee_id=employee_id)
            queryset = queryset.filter(assignments__employee_id=employee_id)

        return queryset

    @action(detail=False, methods=['get'], url_path='current')
    def current(self, request):
        now = timezone.now()
        queryset = self.get_queryset().filter(start_time__lte=now, end_time__gte=now)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='requests')
    def get_requests(self, request, pk=None):
        shift = self.get_object()
        requests = shift.requests.all()
        serializer = ShiftRequestSerializer(requests, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=ShiftRequestActionSerializer,
        responses={
            200: ShiftRequestActionResponseSerializer,
            400: ErrorResponseSerializer,
            404: ErrorResponseSerializer
        },
        description="تایید درخواست شیفت. request_id درخواست مورد نظر را ارسال کنید.",
        summary="تایید درخواست شیفت"
    )
    @action(detail=True, methods=['post'], url_path='approve_request')
    def approve_request(self, request, pk=None):
        """
        تایید درخواست شیفت
        
        Body:
            {
                "request_id": 123
            }
        
        Response:
            {
                "status": "approved"
            }
        """
        serializer = ShiftRequestActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        shift = self.get_object()
        request_id = serializer.validated_data['request_id']
        
        try:
            shift_request = shift.requests.get(id=request_id)
            shift_request.approve(approved_by=request.user)
            return Response({'status': 'approved'}, status=status.HTTP_200_OK)
        except ShiftRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=ShiftRequestActionSerializer,
        responses={
            200: ShiftRequestActionResponseSerializer,
            400: ErrorResponseSerializer,
            404: ErrorResponseSerializer
        },
        description="رد درخواست شیفت. request_id درخواست مورد نظر را ارسال کنید.",
        summary="رد درخواست شیفت"
    )
    @action(detail=True, methods=['post'], url_path='reject_request')
    def reject_request(self, request, pk=None):
        """
        رد درخواست شیفت
        
        Body:
            {
                "request_id": 123
            }
        
        Response:
            {
                "status": "rejected"
            }
        """
        serializer = ShiftRequestActionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        shift = self.get_object()
        request_id = serializer.validated_data['request_id']
        
        try:
            shift_request = shift.requests.get(id=request_id)
            shift_request.reject()
            return Response({'status': 'rejected'}, status=status.HTTP_200_OK)
        except ShiftRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='request')
    def request_shift(self, request, pk=None):
        shift = self.get_object()
        try:
            employee = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee profile not found'}, status=404)
        if ShiftRequest.objects.filter(shift=shift, employee=employee).exists():
            return Response({'error': 'Already requested'}, status=400)
        if shift.is_full(employee.gender):
            return Response({'error': 'Shift is full for your gender'}, status=400)
        ShiftRequest.objects.create(shift=shift, employee=employee)
        return Response({'status': 'requested'})

    
    
class AdminManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet برای مدیریت ادمین‌های سیستم

    قابلیت‌ها:
    - List: نمایش لیست ادمین‌ها (کارمندانی که حداقل یکی از can_... فیلدها true است)
    - Retrieve: نمایش جزئیات یک ادمین
    - Create: ایجاد ادمین جدید (تبدیل کارمند به ادمین با تنظیم دسترسی‌ها)
    - Update/Patch: بروزرسانی دسترسی‌های ادمین
    - Delete: حذف ادمین (همه دسترسی‌ها false + is_staff=False)

    Permission:
    - CanManageAdmins: فقط کاربرانی که can_manage_admins=True دارند (یا سوپرادمین)

    منطق:
    - فقط کارمندانی که حداقل یکی از فیلدهای can_... true دارند در لیست نمایش داده می‌شوند
    - هنگام ایجاد: employee_id + فیلدهای دسترسی ارسال می‌شود
    - هنگام بروزرسانی: فقط فیلدهای دسترسی قابل تغییر هستند
    - هنگام حذف: همه دسترسی‌ها false می‌شوند و is_staff=False می‌شود
    """
    permission_classes = [CanManageAdmins]
    pagination_class = PersianPagination
    
    def get_queryset(self):
        """
        QuerySet برای لیست ادمین‌ها
        فقط کارمندانی که حداقل یکی از فیلدهای can_... true دارند
        مرتب‌سازی: اول بر اساس first_name سپس last_name
        """
        queryset = Employee.objects.select_related('user').filter(
            Q(can_manage_shifts=True) |
            Q(can_manage_blog=True) |
            Q(can_approve_registrations=True) |
            Q(can_manage_khadamyaran=True) |
            Q(can_manage_site_settings=True) |
            Q(can_manage_admins=True)
        ).order_by('first_name', 'last_name')
        
        return queryset
    
    def get_serializer_class(self):
        """
        انتخاب سریالایزر مناسب بر اساس action
        - list, retrieve: AdminListSerializer (نمایش ساده)
        - create, update, partial_update: AdminCreateSerializer (ورودی دسترسی‌ها)
        """
        if self.action in ['list', 'retrieve']:
            return AdminListSerializer
        return AdminCreateSerializer
    
    def _has_any_permission(self, employee):
        """
        Helper method: بررسی اینکه آیا کارمند حداقل یک دسترسی ادمینی دارد
        """
        return any([
            employee.can_manage_shifts,
            employee.can_manage_blog,
            employee.can_approve_registrations,
            employee.can_manage_khadamyaran,
            employee.can_manage_site_settings,
            employee.can_manage_admins,
        ])
    
    def _update_permissions(self, employee, validated_data):
        """
        Helper method: بروزرسانی فیلدهای دسترسی کارمند
        """
        permission_fields = [
            'can_manage_shifts',
            'can_manage_blog',
            'can_approve_registrations',
            'can_manage_khadamyaran',
            'can_manage_site_settings',
            'can_manage_admins',
        ]
        
        for field in permission_fields:
            if field in validated_data:
                setattr(employee, field, validated_data[field])
        
        employee.save()
    
    @extend_schema(
        responses={200: AdminListSerializer(many=True)},
        description="لیست تمام ادمین‌های سیستم (کارمندانی که حداقل یک دسترسی ادمینی دارند)",
        summary="لیست ادمین‌ها"
    )
    def list(self, request, *args, **kwargs):
        """
        لیست ادمین‌ها
        فقط کارمندانی که حداقل یکی از فیلدهای can_... true دارند
        """
        return super().list(request, *args, **kwargs)
    
    @extend_schema(
        responses={200: AdminListSerializer},
        description="جزئیات یک ادمین",
        summary="جزئیات ادمین"
    )
    def retrieve(self, request, *args, **kwargs):
        """
        نمایش جزئیات یک ادمین
        """
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        request=AdminCreateSerializer,
        responses={201: AdminListSerializer, 400: ErrorResponseSerializer},
        description="ایجاد ادمین جدید. employee_id کارمند موجود + فیلدهای دسترسی را ارسال کنید.",
        summary="ایجاد ادمین جدید"
    )
    def create(self, request, *args, **kwargs):
        """
        ایجاد ادمین جدید (تبدیل کارمند به ادمین)
        
        Body:
            {
                "employee_id": 5,
                "can_manage_shifts": true,
                "can_manage_blog": false,
                ...
            }
        
        منطق:
        - بررسی اینکه employee وجود داشته باشد (validation در serializer)
        - بررسی اینکه employee قبلاً ادمین نباشد (حداقل یک دسترسی true داشته باشد)
        - تنظیم فیلدهای دسترسی
        - تنظیم is_staff=True برای user مرتبط
        """
        serializer = AdminCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        employee = validated_data['employee_id']
        
        # بررسی اینکه employee قبلاً ادمین نباشد
        if self._has_any_permission(employee):
            return Response(
                {'error': 'این کارمند قبلاً ادمین است. از PATCH برای بروزرسانی استفاده کنید.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # بروزرسانی دسترسی‌ها
        with transaction.atomic():
            self._update_permissions(employee, validated_data)
            
            # تنظیم is_staff=True برای user مرتبط (اگر قبلاً نبود)
            if not employee.user.is_staff:
                employee.user.is_staff = True
                employee.user.save()
        
        # برگرداندن employee با AdminListSerializer
        response_serializer = AdminListSerializer(employee)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @extend_schema(
        request=AdminCreateSerializer,
        responses={200: AdminListSerializer, 400: ErrorResponseSerializer},
        description="بروزرسانی کامل دسترسی‌های ادمین (PUT)",
        summary="بروزرسانی کامل ادمین"
    )
    def update(self, request, *args, **kwargs):
        """
        بروزرسانی کامل دسترسی‌های ادمین (PUT)
        employee_id قابل تغییر نیست (read-only)
        """
        return self.partial_update(request, *args, **kwargs)
    
    @extend_schema(
        request=AdminCreateSerializer,
        responses={200: AdminListSerializer, 400: ErrorResponseSerializer},
        description="بروزرسانی جزئی دسترسی‌های ادمین (PATCH). فقط فیلدهای دسترسی قابل تغییر هستند.",
        summary="بروزرسانی جزئی ادمین"
    )
    def partial_update(self, request, *args, **kwargs):
        """
        بروزرسانی جزئی دسترسی‌های ادمین (PATCH)
        
        Body:
            {
                "can_manage_shifts": false,
                "can_manage_blog": true,
                ...
            }
        
        منطق:
        - فقط فیلدهای دسترسی قابل تغییر هستند
        - employee_id قابل تغییر نیست (read-only)
        - اگر همه دسترسی‌ها false شوند، is_staff=False می‌شود
        """
        instance = self.get_object()
        
        # ساخت serializer بدون employee_id (چون در update نباید ارسال شود)
        serializer_data = request.data.copy()
        serializer_data.pop('employee_id', None)  # حذف employee_id اگر ارسال شده
        
        serializer = AdminCreateSerializer(data=serializer_data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        
        # گرفتن مقادیر فعلی برای فیلدهایی که ارسال نشده‌اند
        permission_fields = [
            'can_manage_shifts',
            'can_manage_blog',
            'can_approve_registrations',
            'can_manage_khadamyaran',
            'can_manage_site_settings',
            'can_manage_admins',
        ]
        
        # اگر partial=True، فقط فیلدهای ارسال شده را تغییر می‌دهیم
        # برای فیلدهای ارسال نشده، از مقادیر فعلی استفاده می‌کنیم
        final_data = {}
        for field in permission_fields:
            if field in validated_data:
                final_data[field] = validated_data[field]
            else:
                final_data[field] = getattr(instance, field)
        
        # بررسی اینکه حداقل یک دسترسی true باشد
        if not any(final_data.values()):
            return Response(
                {'error': 'حداقل یکی از دسترسی‌های ادمینی باید فعال باشد.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # بروزرسانی دسترسی‌ها
        with transaction.atomic():
            for field, value in final_data.items():
                setattr(instance, field, value)
            instance.save()
            
            # بررسی اینکه آیا هنوز دسترسی دارد یا نه
            if not self._has_any_permission(instance):
                # اگر همه دسترسی‌ها false شدند، is_staff=False می‌کنیم
                instance.user.is_staff = False
                instance.user.save()
            else:
                # اگر حداقل یک دسترسی دارد، is_staff=True
                if not instance.user.is_staff:
                    instance.user.is_staff = True
                    instance.user.save()
        
        response_serializer = AdminListSerializer(instance)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    @extend_schema(
        responses={204: None, 403: ErrorResponseSerializer},
        description="حذف ادمین. همه دسترسی‌ها false می‌شوند و is_staff=False می‌شود.",
        summary="حذف ادمین"
    )
    def destroy(self, request, *args, **kwargs):
        """
        حذف ادمین
        
        منطق:
        - همه فیلدهای دسترسی (can_...) false می‌شوند
        - is_staff=False می‌شود
        - رکورد Employee حذف نمی‌شود، فقط دسترسی‌ها غیرفعال می‌شوند
        """
        instance = self.get_object()
        
        # بررسی اینکه سوپرادمین نباشد
        if instance.user.is_superuser:
            return Response(
                {'error': 'نمی‌توان سوپرادمین را حذف کرد.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # غیرفعال کردن همه دسترسی‌ها
        with transaction.atomic():
            instance.can_manage_shifts = False
            instance.can_manage_blog = False
            instance.can_approve_registrations = False
            instance.can_manage_khadamyaran = False
            instance.can_manage_site_settings = False
            instance.can_manage_admins = False
            instance.save()
            
            # تنظیم is_staff=False
            instance.user.is_staff = False
            instance.user.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

