import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import OTPCode

User = get_user_model()


class TestOTPSystem(APITestCase):
    """Test OTP sending and verification"""

    def test_send_otp_success(self):
        """Test successful OTP sending"""
        url = reverse('auth-otp-send')
        data = {'phone': '09123456789'}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertTrue(OTPCode.objects.filter(phone='09123456789').exists())

    def test_send_otp_invalid_phone(self):
        """Test OTP sending with invalid phone"""
        url = reverse('auth-otp-send')
        data = {'phone': 'invalid_phone'}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_otp_success(self):
        """Test successful OTP verification and registration"""
        # First send OTP
        otp_obj = OTPCode.objects.create(
            phone='09123456789',
            otp_code='123456'
        )

        url = reverse('auth-otp-verify')
        data = {
            'phone': '09123456789',
            'otp_code': '123456',
            'first_name': 'علی',
            'last_name': 'احمدی',
            'national_id': '1234567890',
            'email': 'ali@example.com'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertTrue(User.objects.filter(phone='09123456789').exists())

    def test_verify_otp_wrong_code(self):
        """Test OTP verification with wrong code"""
        # Create OTP with correct code
        otp_obj = OTPCode.objects.create(
            phone='09123456789',
            otp_code='123456'
        )

        url = reverse('auth-otp-verify')
        data = {
            'phone': '09123456789',
            'otp_code': '654321',  # Wrong code
            'first_name': 'علی',
            'last_name': 'احمدی',
            'national_id': '1234567890',
            'email': 'ali@example.com'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestAuthSystem(APITestCase):
    """Test authentication system"""

    def setUp(self):
        self.user = User.objects.create_user(
            phone='09123456789',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_login_success(self):
        """Test successful login"""
        url = reverse('auth-login')
        data = {
            'phone': '09123456789',
            'password': 'testpass123'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])

    def test_login_wrong_password(self):
        """Test login with wrong password"""
        url = reverse('auth-login')
        data = {
            'phone': '09123456789',
            'password': 'wrongpass'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        url = reverse('auth-login')
        data = {
            'phone': '09129999999',
            'password': 'testpass123'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TestProfileManagement(APITestCase):
    """Test profile management"""

    def setUp(self):
        self.user = User.objects.create_user(
            phone='09123456789',
            password='testpass123',
            first_name='Test',
            last_name='User',
            email='test@example.com'
        )
        self.client.force_authenticate(user=self.user)

    def test_get_profile(self):
        """Test getting user profile"""
        url = reverse('auth-profile')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], '09123456789')
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')

    def test_update_profile(self):
        """Test updating user profile"""
        url = reverse('auth-profile')
        data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'email': 'updated@example.com'
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
        self.assertEqual(response.data['last_name'], 'Name')
        self.assertEqual(response.data['email'], 'updated@example.com')

    def test_change_password(self):
        """Test changing password"""
        url = reverse('auth-change-password')
        data = {
            'old_password': 'testpass123',
            'new_password': 'newpassword123'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

        # Verify new password works
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))

    def test_change_password_wrong_old(self):
        """Test changing password with wrong old password"""
        url = reverse('auth-change-password')
        data = {
            'old_password': 'wrongpass',
            'new_password': 'newpassword123'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestRegistrationRequests(APITestCase):
    """Test registration request management (Admin only)"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            phone='09129876543',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        from core.models import Employee
        self.admin_employee = Employee.objects.create(
            user=self.admin,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True,
            can_approve_registrations=True
        )
        self.client.force_authenticate(user=self.admin)

        # Create pending registration request
        self.pending_user = User.objects.create_user(
            phone='09121111111',
            password='temppass123',
            first_name='Pending',
            last_name='User',
            is_active=False  # Pending approval
        )

    def test_list_registration_requests(self):
        """Test listing registration requests"""
        url = reverse('registration-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return pending users

    def test_approve_registration(self):
        """Test approving registration request"""
        url = reverse('registration-approve', args=[self.pending_user.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pending_user.refresh_from_db()
        self.assertTrue(self.pending_user.is_active)

    def test_reject_registration(self):
        """Test rejecting registration request"""
        url = reverse('registration-reject', args=[self.pending_user.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # User should be deleted or marked as rejected

    def test_unauthorized_access(self):
        """Test that regular users cannot access registration management"""
        # Create regular user
        regular_user = User.objects.create_user(
            phone='09122222222',
            password='regularpass123'
        )
        self.client.force_authenticate(user=regular_user)

        url = reverse('registration-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)