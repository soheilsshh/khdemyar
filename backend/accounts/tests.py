import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class TestAuthSystem(APITestCase):
    """Test authentication system"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            phone_number='09123456789',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_login_success(self):
        """Test successful login"""
        url = reverse('auth-login')
        data = {
            'phone_number': '09123456789',
            'password': 'testpass123'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_wrong_password(self):
        """Test login with wrong password"""
        url = reverse('auth-login')
        data = {
            'phone_number': '09123456789',
            'password': 'wrongpass'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        url = reverse('auth-login')
        data = {
            'phone_number': '09129999999',
            'password': 'testpass123'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


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