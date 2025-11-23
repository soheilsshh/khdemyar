from django.utils import timezone
from rest_framework import viewsets, status , permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from django.db.models import Count, Q

from .models import BlogPost, Employee, Shift
from .serializers import BlogPostSerializer, EmployeeSerializer , EmployeeListSerializer, ShiftSerializer
from .permissions import IsAdminOrSelf

User = get_user_model()


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('user').all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAdminOrSelf]
    
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
    permission_classes = [permissions.IsAdminUser]  

    def get_queryset(self):
        queryset = Shift.objects.select_related(
            'employee',          
            'employee__user',     
            'created_by'          
        ).filter(is_active=True)

        employee_id = self.request.query_params.get('employee')
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)

        return queryset


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