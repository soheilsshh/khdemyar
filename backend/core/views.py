from rest_framework import viewsets, status , permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters


from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

from .models import BlogPost, Employee, Shift
from .serializers import (BlogPostSerializer, 
                          EmployeeSerializer , 
                          EmployeeListSerializer, 
                          ShiftListSerializer, 
                          ShiftRequestSerializer, 
                          ShiftSerializer, 
                          UserShortSerializer)
from .permissions import IsAdminOrSelf
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
        return EmployeeSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action in ['list', 'retrieve', 'me']:
            queryset = queryset.annotate(
                total_shifts_count=Count('shifts')
            )
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
    
    @action(detail=False, methods=['get'], url_path='active-emp')
    def active_emp(self, request):
        now = timezone.now()
        active_employees = Employee.objects.filter(
            shifts__start_time__lte=now,
            shifts__end_time__gte=now,
            shifts__is_active=True
        ).select_related('user').annotate(
                total_shifts_count=Count('shifts')
            ).distinct()

        serializer = EmployeeListSerializer(active_employees, many=True)
        return Response(serializer.data)

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]

    
    def get_serializer_class(self):
        if self.action == ['list']:
            return ShiftListSerializer        
        if self.action in ['get_requests' , 'request_shift']:
            return ShiftRequestSerializer
        return ShiftSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 
                           'partial_update', 'destroy', 
                           'get_requests', 'approve_request', 
                           'reject_request']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    permission_classes = [permissions.IsAuthenticated]

    
    def get_serializer_class(self):
        if self.action == ['list']:
            return ShiftListSerializer        
        if self.action in ['get_requests' , 'request_shift']:
            return ShiftRequestSerializer
        return ShiftSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 
                           'partial_update', 'destroy', 
                           'get_requests', 'approve_request', 
                           'reject_request']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Shift.objects.select_related(
            'created_by'
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

    @action(detail=True, methods=['post'], url_path='approve_request')
    def approve_request(self, request, pk=None):
        shift = self.get_object()
        request_id = request.data.get('request_id')
        try:
            shift_request = shift.requests.get(id=request_id)
            shift_request.approve()
            return Response({'status': 'approved'})
        except ShiftRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=404)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=True, methods=['post'], url_path='reject_request')
    def reject_request(self, request, pk=None):
        shift = self.get_object()
        request_id = request.data.get('request_id')
        try:
            shift_request = shift.requests.get(id=request_id)
            shift_request.reject()
            return Response({'status': 'rejected'})
        except ShiftRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=404)

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

    @action(detail=True, methods=['post'], url_path='approve_request')
    def approve_request(self, request, pk=None):
        shift = self.get_object()
        request_id = request.data.get('request_id')
        try:
            shift_request = shift.requests.get(id=request_id)
            shift_request.approve()
            return Response({'status': 'approved'})
        except ShiftRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=404)
        except ValueError as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=True, methods=['post'], url_path='reject_request')
    def reject_request(self, request, pk=None):
        shift = self.get_object()
        request_id = request.data.get('request_id')
        try:
            shift_request = shift.requests.get(id=request_id)
            shift_request.reject()
            return Response({'status': 'rejected'})
        except ShiftRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=404)

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


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related('author').all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]  
        return [permissions.IsAdminUser()] 

    def get_queryset(self):
        if self.request.user.is_authenticated and (self.request.user.is_admin or self.request.user.is_staff):
            return super().get_queryset()
        return super().get_queryset().filter(is_published=True)
    
    
# فقط سوپرادمین می‌تونه ادمین اضافه یا حذف کنه
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_admin=True)
    serializer_class = UserShortSerializer  # یا یک سریالایزر اختصاصی
    permission_classes = [permissions.IsAdminUser]  # فقط سوپرادمین

    def get_queryset(self):

        if self.request.user.is_superuser:
            return User.objects.filter(is_admin=True)
        return User.objects.none()

    @action(detail=False, methods=['post'], url_path='create-admin')
    def create_admin(self, request):
        if not request.user.is_superuser:
            return Response({"error": "فقط سوپرادمین می‌تواند ادمین بسازد"}, status=403)

        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        phone_number = request.data.get('phone_number', '')

        if User.objects.filter(username=username).exists():
            return Response({"error": "این نام کاربری قبلاً وجود دارد"}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            phone  =phone_number,
            is_admin=True,       
            is_staff=True,       
        )
        return Response({
            "message": "ادمین با موفقیت ساخته شد",
            "user_id": user.id,
            "username": user.username
        }, status=201)