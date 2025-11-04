from rest_framework import viewsets, status , permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
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
        user = self.request.user
        if getattr(user, 'is_admin', False) or user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(user=user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response({"detail": "پروفایل کارمندی یافت نشد"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(employee)
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