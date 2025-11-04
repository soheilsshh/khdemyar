from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Employee
from .serializers import EmployeeSerializer , EmployeeListSerializer
from .permissions import IsAdminOrSelf

User = get_user_model()


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    Endpoints:
      - GET /api/core/employees/         -> لیست کارمندان (فقط مدیر)
      - GET /api/core/employees/{id}/    -> مشاهده جزئیات (مدیر یا خود کارمند)
      - PATCH /api/core/employees/{id}/  -> ویرایش جزئیات (مدیر یا خود کارمند)
      - DELETE /api/core/employees/{id}/ -> حذف (فقط مدیر)
      - GET /api/core/employees/me/      -> پروفایل کارمند لاگین‌شده
    """
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
        """پروفایل کاربر فعلی را نمایش می‌دهد"""
        user = request.user
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response({"detail": "پروفایل کارمندی یافت نشد"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(employee)
        return Response(serializer.data)
