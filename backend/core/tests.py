import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Employee, Shift, ShiftRequest, ShiftAssignment

User = get_user_model()


class TestEmployeeManagement(APITestCase):
    """Test employee management"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            username='admin',
            phone_number='09129876543',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        self.admin_employee = Employee.objects.create(
            user=self.admin,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True
        )

        # Create regular user
        self.regular_user = User.objects.create_user(
            username='regularuser',
            phone_number='09123456789',
            password='userpass123',
            first_name='Regular',
            last_name='User'
        )
        self.regular_employee = Employee.objects.create(
            user=self.regular_user,
            first_name='Regular',
            last_name='User',
            national_id='1234567890',
            phone='09123456789',
            status='approved'
        )

    def test_list_employees_admin(self):
        """Test listing employees as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('employee-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_list_employees_regular_user(self):
        """Test listing employees as regular user (should only see themselves)"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('employee-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)  # Only themselves

    def test_get_employee_profile(self):
        """Test getting employee profile"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('employee-detail', args=[self.regular_employee.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], '09123456789')

    def test_update_employee_profile(self):
        """Test updating employee profile"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('employee-detail', args=[self.regular_employee.id])
        data = {
            'phone': '09129999999',
            'address': 'Updated address'
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], '09129999999')

    def test_employee_me_endpoint(self):
        """Test getting current user's profile"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('employee-me')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], '09123456789')

    def test_employee_detailed_view(self):
        """Test getting detailed employee view with shift count"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('employee-detailed', args=[self.regular_employee.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_shifts_count', response.data)

    def test_change_password(self):
        """Test changing employee password"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('employee-change-password', args=[self.regular_employee.id])
        data = {'new_password': 'newpass123'}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.regular_user.refresh_from_db()
        self.assertTrue(self.regular_user.check_password('newpass123'))


class TestShiftManagement(APITestCase):
    """Test shift management"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            username='admin',
            phone_number='09129876543',
            password='adminpass123'
        )
        self.admin_employee = Employee.objects.create(
            user=self.admin,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True,
            can_manage_shifts=True
        )

        # Create regular employee
        self.employee = User.objects.create_user(
            username='employee',
            phone_number='09123456789',
            password='userpass123'
        )
        self.employee_profile = Employee.objects.create(
            user=self.employee,
            first_name='Test',
            last_name='Employee',
            national_id='1234567890',
            phone='09123456789',
            status='approved',
            gender='male'
        )

        # Create a shift
        self.shift = Shift.objects.create(
            start_time=timezone.now() + timezone.timedelta(days=1),
            end_time=timezone.now() + timezone.timedelta(days=1, hours=8),
            occasion='Test Event',
            min_emp=1,
            max_emp=5,
            max_males=3,
            max_females=2,
            created_by=self.admin_employee
        )

    def test_list_shifts(self):
        """Test listing shifts"""
        url = reverse('shift-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_get_current_shifts(self):
        """Test getting current active shifts"""
        # Create a current shift
        current_shift = Shift.objects.create(
            start_time=timezone.now() - timezone.timedelta(hours=1),
            end_time=timezone.now() + timezone.timedelta(hours=7),
            occasion='Current Event',
            min_emp=1,
            max_emp=3,
            created_by=self.admin_employee
        )

        url = reverse('shift-current')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_shift_admin(self):
        """Test creating shift as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('shift-list')
        data = {
            'start_time': (timezone.now() + timezone.timedelta(days=2)).isoformat(),
            'end_time': (timezone.now() + timezone.timedelta(days=2, hours=6)).isoformat(),
            'occasion': 'New Test Event',
            'min_emp': 2,
            'max_emp': 4,
            'max_males': 2,
            'max_females': 2
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['occasion'], 'New Test Event')

    def test_create_shift_regular_user(self):
        """Test that regular users cannot create shifts"""
        self.client.force_authenticate(user=self.employee)
        url = reverse('shift-list')
        data = {
            'start_time': (timezone.now() + timezone.timedelta(days=2)).isoformat(),
            'end_time': (timezone.now() + timezone.timedelta(days=2, hours=6)).isoformat(),
            'occasion': 'Unauthorized Event',
            'min_emp': 1,
            'max_emp': 2
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_request_shift(self):
        """Test requesting to join a shift"""
        self.client.force_authenticate(user=self.employee)
        url = reverse('shift-request', args=[self.shift.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(ShiftRequest.objects.filter(
            shift=self.shift,
            employee=self.employee_profile
        ).exists())

    def test_get_shift_requests(self):
        """Test getting shift requests as admin"""
        # Create a request first
        ShiftRequest.objects.create(
            shift=self.shift,
            employee=self.employee_profile
        )

        self.client.force_authenticate(user=self.admin)
        url = reverse('shift-requests', args=[self.shift.id])

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

    def test_approve_shift_request(self):
        """Test approving shift request as admin"""
        # Create a request
        shift_request = ShiftRequest.objects.create(
            shift=self.shift,
            employee=self.employee_profile
        )

        self.client.force_authenticate(user=self.admin)
        url = reverse('shift-approve-request', args=[self.shift.id])
        data = {'request_id': shift_request.id}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        shift_request.refresh_from_db()
        self.assertEqual(shift_request.status, 'approved')
        self.assertTrue(ShiftAssignment.objects.filter(
            shift=self.shift,
            employee=self.employee_profile
        ).exists())

    def test_reject_shift_request(self):
        """Test rejecting shift request as admin"""
        # Create a request
        shift_request = ShiftRequest.objects.create(
            shift=self.shift,
            employee=self.employee_profile
        )

        self.client.force_authenticate(user=self.admin)
        url = reverse('shift-reject-request', args=[self.shift.id])
        data = {'request_id': shift_request.id}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        shift_request.refresh_from_db()
        self.assertEqual(shift_request.status, 'rejected')

    def test_duplicate_shift_request(self):
        """Test preventing duplicate shift requests"""
        # Create first request
        ShiftRequest.objects.create(
            shift=self.shift,
            employee=self.employee_profile
        )

        # Try to create another request
        self.client.force_authenticate(user=self.employee)
        url = reverse('shift-request', args=[self.shift.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestAdminManagement(APITestCase):
    """Test admin management (Super admin only)"""

    def setUp(self):
        # Create super admin
        self.super_admin = User.objects.create_superuser(
            phone='09121111111',
            password='superpass123',
            username='superadmin'
        )

        # Create admin user
        self.admin = User.objects.create_user(
            phone='09129876543',
            password='adminpass123'
        )
        self.admin_employee = Employee.objects.create(
            user=self.admin,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True,
            can_manage_shifts=True
        )

        # Create regular employee
        self.regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.regular_employee = Employee.objects.create(
            user=self.regular_user,
            first_name='Regular',
            last_name='Employee',
            national_id='1234567890',
            phone='09123456789',
            status='approved'
        )

    def test_list_admins_super_admin(self):
        """Test listing admins as super admin"""
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should include the admin employee

    def test_list_admins_regular_admin(self):
        """Test that regular admin cannot list admins"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('admin-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_admin(self):
        """Test creating new admin"""
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-list')
        data = {
            'employee_id': self.regular_employee.id,
            'can_manage_shifts': True,
            'can_manage_blog': True,
            'can_approve_registrations': False
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.regular_employee.refresh_from_db()
        self.assertTrue(self.regular_employee.can_manage_shifts)
        self.assertTrue(self.regular_employee.can_manage_blog)
        self.assertFalse(self.regular_employee.can_approve_registrations)

    def test_create_admin_duplicate(self):
        """Test creating admin for already admin employee"""
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-list')
        data = {
            'employee_id': self.admin_employee.id,
            'can_manage_blog': True
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_admin(self):
        """Test updating admin permissions"""
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-detail', args=[self.admin_employee.id])
        data = {
            'can_manage_blog': True,
            'can_manage_site_settings': True
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.admin_employee.refresh_from_db()
        self.assertTrue(self.admin_employee.can_manage_blog)
        self.assertTrue(self.admin_employee.can_manage_site_settings)

    def test_update_admin_no_permissions(self):
        """Test updating admin with no permissions (should fail)"""
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-detail', args=[self.admin_employee.id])
        data = {
            'can_manage_shifts': False,
            'can_manage_blog': False,
            'can_approve_registrations': False
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_admin(self):
        """Test deleting admin (removing all permissions)"""
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-detail', args=[self.admin_employee.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.admin_employee.refresh_from_db()
        self.assertFalse(self.admin_employee.can_manage_shifts)
        self.assertFalse(self.admin_employee.is_staff_admin)

    def test_create_admin_invalid_employee(self):
        """Test creating admin with invalid employee_id"""
        self.client.force_authenticate(user=self.super_admin)
        url = reverse('admin-list')
        data = {
            'employee_id': 99999,  # Non-existent employee
            'can_manage_shifts': True
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)