"""
Comprehensive test suite for all API endpoints
Run with: python -m pytest test_all_endpoints.py -v
"""

import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import OTPCode
from core.models import Employee, Shift, ShiftRequest
from cms.models import News, Feedback, Subtitle, Visit

User = get_user_model()


class TestAllEndpoints(APITestCase):
    """Comprehensive test for all API endpoints"""

    def setUp(self):
        """Setup test data"""
        # Create users
        self.super_admin = User.objects.create_superuser(
            username='superadmin',
            phone='09121111111',
            password='superpass123',
            email='super@example.com'
        )

        self.admin_user = User.objects.create_user(
            phone='09129876543',
            password='adminpass123',
            email='admin@example.com'
        )

        self.regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123',
            email='user@example.com'
        )

        # Create employee profiles
        self.super_admin_employee = Employee.objects.create(
            user=self.super_admin,
            first_name='Super',
            last_name='Admin',
            national_id='1111111111',
            phone='09121111111',
            status='approved'
        )

        self.admin_employee = Employee.objects.create(
            user=self.admin_user,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True,
            can_manage_shifts=True,
            can_manage_blog=True,
            can_approve_registrations=True,
            can_manage_admins=True
        )

        self.regular_employee = Employee.objects.create(
            user=self.regular_user,
            first_name='Regular',
            last_name='User',
            national_id='1234567890',
            phone='09123456789',
            status='approved',
            gender='male'
        )

        # Create test data
        self.shift = Shift.objects.create(
            start_time=timezone.now() + timezone.timedelta(days=1),
            end_time=timezone.now() + timezone.timedelta(days=1, hours=8),
            occasion='Test Event',
            min_emp=1,
            max_emp=5,
            created_by=self.admin_employee
        )

        self.news = News.objects.create(
            title='Test News',
            content='Test news content with enough length for validation.',
            is_active=True
        )

        self.feedback = Feedback.objects.create(
            name='Test',
            last_name='User',
            email='feedback@example.com',
            phone_number='09123456789',
            message='This is a test feedback message with more than 10 characters.'
        )

        self.subtitle = Subtitle.objects.create(
            text='Test subtitle for homepage display',
            is_active=True
        )

    def test_accounts_endpoints(self):
        """Test all accounts endpoints"""
        # Test OTP sending
        url = reverse('auth-otp-send')
        response = self.client.post(url, {'phone': '09129999999'}, format='json')
        self.assertIn(response.status_code, [200, 201])

        # Test login
        url = reverse('auth-login')
        response = self.client.post(url, {
            'phone': '09129876543',
            'password': 'adminpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test profile access (authenticated)
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('auth-profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test profile update
        response = self.client.patch(url, {'first_name': 'Updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test password change
        url = reverse('auth-change-password')
        response = self.client.post(url, {
            'old_password': 'userpass123',
            'new_password': 'newpass123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_core_endpoints(self):
        """Test all core endpoints"""
        # Test employee list (regular user - should only see themselves)
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('employee-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

        # Test employee list (admin - should see all)
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data['results']), 2)

        # Test employee detail
        url = reverse('employee-detail', args=[self.regular_employee.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test employee update
        response = self.client.patch(url, {'phone': '09129999999'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test employee me endpoint
        url = reverse('employee-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test shift list
        url = reverse('shift-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test shift creation (admin only)
        data = {
            'start_time': (timezone.now() + timezone.timedelta(days=2)).isoformat(),
            'end_time': (timezone.now() + timezone.timedelta(days=2, hours=6)).isoformat(),
            'occasion': 'New Test Event',
            'min_emp': 1,
            'max_emp': 3
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Test shift request (regular user)
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('shift-request', args=[self.shift.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test shift requests view (admin)
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('shift-requests', args=[self.shift.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test approve request
        shift_request = ShiftRequest.objects.filter(shift=self.shift).first()
        if shift_request:
            url = reverse('shift-approve-request', args=[self.shift.id])
            response = self.client.post(url, {'request_id': shift_request.id}, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cms_endpoints(self):
        """Test all CMS endpoints"""
        # Test news list (public)
        url = reverse('news-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test news creation (admin only)
        self.client.force_authenticate(user=self.admin_user)
        data = {
            'title': 'New Test News',
            'content': 'Content for new test news with enough length.',
            'is_active': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Test news update
        news_id = response.data['id']
        url = reverse('news-detail', args=[news_id])
        response = self.client.patch(url, {'title': 'Updated Title'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test feedback creation (public)
        url = reverse('feedback-list')
        data = {
            'name': 'New',
            'last_name': 'User',
            'email': 'new@example.com',
            'message': 'This is a new feedback with enough characters.'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Test feedback list (admin only)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test contact info (public)
        url = reverse('contact-info')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test contact info update (admin)
        data = {'phone': '02112345678', 'email': 'info@example.com'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test about us (public)
        url = reverse('about-us')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test about us update (admin)
        data = {'title': 'Updated About Us', 'content': 'Updated content.'}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test visit tracking (public)
        url = reverse('visit-track')
        response = self.client.post(url, {'path': '/test/'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test visit stats (admin)
        url = reverse('visit-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test dashboard (admin)
        url = reverse('dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test subtitles list (admin)
        url = reverse('subtitles-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test subtitle creation
        data = {'text': 'New subtitle', 'is_active': False}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Test toggle active
        subtitle_id = response.data['id']
        url = reverse('subtitles-toggle-active', args=[subtitle_id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_management_endpoints(self):
        """Test admin management endpoints (super admin only)"""
        # Test admin list (super admin)
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test create admin
        data = {
            'employee_id': self.regular_employee.id,
            'can_manage_shifts': True,
            'can_manage_blog': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Test update admin
        admin_id = self.admin_employee.id
        url = reverse('admin-detail', args=[admin_id])
        data = {'can_manage_site_settings': True}
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test delete admin
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_permission_checks(self):
        """Test permission restrictions"""
        # Test unauthorized access to admin endpoints
        self.client.force_authenticate(user=self.regular_user)

        # Should not access admin management
        url = reverse('admin-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Should not create news
        url = reverse('news-list')
        response = self.client.post(url, {'title': 'Test', 'content': 'Test'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Should not access visit stats
        url = reverse('visit-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_validation(self):
        """Test input validation"""
        # Test invalid feedback (short message)
        url = reverse('feedback-list')
        data = {
            'name': 'Test',
            'last_name': 'User',
            'message': 'Short'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test invalid admin creation (no permissions)
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-list')
        data = {
            'employee_id': self.regular_employee.id,
            # No permissions set
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test invalid phone number
        url = reverse('auth-otp-send')
        response = self.client.post(url, {'phone': 'invalid'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
