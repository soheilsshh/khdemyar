import os
import django
from django.conf import settings

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'khademyar.settings')
django.setup()

import pytest
from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from core.models import Employee, Shift
from cms.models import News, Feedback, Subtitle
from accounts.models import OTPCode

User = get_user_model()


@pytest.fixture
def api_client():
    """API client fixture for testing"""
    return APIClient()


@pytest.fixture
def regular_user():
    """Create a regular user"""
    user = User.objects.create_user(
        username='testuser',
        phone='09123456789',
        password='testpass123',
        email='test@example.com'
    )
    return user


@pytest.fixture
def employee(regular_user):
    """Create an employee profile"""
    employee = Employee.objects.create(
        user=regular_user,
        first_name='Test',
        last_name='User',
        national_id='1234567890',
        phone='09123456789',
        status='approved'
    )
    return employee


@pytest.fixture
def admin_user():
    """Create an admin user"""
    user = User.objects.create_user(
        username='admin',
        phone='09129876543',
        password='adminpass123',
        email='admin@example.com'
    )
    employee = Employee.objects.create(
        user=user,
        first_name='Admin',
        last_name='User',
        national_id='0987654321',
        phone='09129876543',
        status='approved',
        is_staff_admin=True,
        can_manage_shifts=True,
        can_manage_blog=True
    )
    return user


@pytest.fixture
def super_admin():
    """Create a super admin user"""
    user = User.objects.create_superuser(
        username='superadmin',
        phone='09121111111',
        password='superpass123',
        email='super@example.com'
    )
    return user


@pytest.fixture
def shift(admin_user):
    """Create a test shift"""
    employee = Employee.objects.get(user=admin_user)
    shift = Shift.objects.create(
        start_time='2026-01-05T09:00:00Z',
        end_time='2026-01-05T17:00:00Z',
        occasion='Test Event',
        min_emp=2,
        max_emp=5,
        created_by=employee
    )
    return shift


@pytest.fixture
def news(admin_user):
    """Create a test news"""
    news = News.objects.create(
        title='Test News',
        content='Test content for news',
        is_active=True
    )
    return news


@pytest.fixture
def feedback():
    """Create a test feedback"""
    feedback = Feedback.objects.create(
        name='Test User',
        last_name='Feedback',
        email='feedback@example.com',
        phone_number='09123456789',
        message='This is a test feedback message with more than 10 characters.'
    )
    return feedback


@pytest.fixture
def subtitle():
    """Create a test subtitle"""
    subtitle = Subtitle.objects.create(
        text='Test subtitle for homepage',
        is_active=True
    )
    return subtitle


@pytest.fixture
def authenticated_client(api_client, regular_user):
    """API client authenticated with regular user"""
    refresh = RefreshToken.for_user(regular_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """API client authenticated with admin user"""
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def super_admin_client(api_client, super_admin):
    """API client authenticated with super admin user"""
    refresh = RefreshToken.for_user(super_admin)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client
