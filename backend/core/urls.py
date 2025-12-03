from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (EmployeeViewSet, 
                    ShiftViewSet, 
                    BlogPostViewSet , 
                    AdminUserViewSet
                    )

router = DefaultRouter()
router.register('employees', EmployeeViewSet, basename='employee')
router.register('shifts', ShiftViewSet, basename='shift')
router.register('blog', BlogPostViewSet, basename='blog')
router.register(r'admins', AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('', include(router.urls)),
]