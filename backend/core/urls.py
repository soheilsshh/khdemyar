from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (AdminManagementViewSet, 
                    EmployeeViewSet, 
                    ShiftViewSet,
                    )

router = DefaultRouter()
router.register('employees', EmployeeViewSet, basename='employee')
router.register('shifts', ShiftViewSet, basename='shift')
router.register('admin', AdminManagementViewSet, basename='admin')

urlpatterns = [
    path('', include(router.urls)),
]