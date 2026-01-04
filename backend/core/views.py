from rest_framework import viewsets, status , permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters


from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db.models import Count, Q

from .models import Employee, Shift
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
    
    @action(detail=False, methods=['get'], url_path='active-emp')
    def active_emp(self, request):
        now = timezone.now()
        active_employees = Employee.objects.filter(
            assigned_shifts__start_time__lte=now,
            assigned_shifts__end_time__gte=now,
            assigned_shifts__shift__is_active=True  
        ).select_related('user').annotate(
            total_shifts_count=Count('assigned_shifts')
        ).distinct()

        serializer = EmployeeListSerializer(active_employees, many=True)
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


class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]

    
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

    
    
class AdminManagementViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()   
    permission_classes = [IsSuperAdmin]


    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return EmployeeListSerializer
        return EmployeeSerializer   


    def get_queryset(self):
        if self.request.user.is_superuser:
            return Employee.objects.select_related('user').all()
        return Employee.objects.none()


    @action(detail=True, methods=['post'], url_path='promote')
    def promote(self, request, pk=None):
        employee = get_object_or_404(Employee, pk=pk)

        if employee.user.is_superuser:
            return Response({"error": "سوپرادمین را نمی‌توان ویرایش کرد"}, status=403)

        if employee.is_staff_admin:
            return Response({"error": "این کاربر قبلاً ادمین است"}, status=400)


        employee.is_staff_admin = True
        employee.user.is_staff = True   
        employee.user.save()
        employee.save()

        return Response({"message": f"{employee} به ادمین تبدیل شد"}, status=200)


    @action(detail=True, methods=['post'], url_path='demote')
    def demote(self, request, pk=None):
        employee = get_object_or_404(Employee, pk=pk)

        if employee.user.is_superuser:
            return Response({"error": "نمی‌توان سوپرادمین را حذف کرد"}, status=403)

        if not employee.is_staff_admin:
            return Response({"error": "این کاربر ادمین نیست"}, status=400)

        employee.is_staff_admin = False
        employee.user.is_staff = False
        employee.user.save()
        employee.save()

        return Response({"message": f"{employee} از لیست ادمین‌ها حذف شد"}, status=200)

