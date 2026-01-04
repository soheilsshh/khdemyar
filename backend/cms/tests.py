import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import News, Feedback, Subtitle, Visit

User = get_user_model()


class TestNewsManagement(APITestCase):
    """Test news management"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            username='admin',
            phone_number='09129876543',
            password='adminpass123'
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
            can_manage_blog=True
        )

        # Create news
        self.news = News.objects.create(
            title='Test News',
            content='This is test news content',
            is_active=True
        )

    def test_list_news(self):
        """Test listing news"""
        url = reverse('news-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_create_news_admin(self):
        """Test creating news as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('news-list')
        data = {
            'title': 'New Test News',
            'content': 'Content for new test news',
            'is_active': True
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Test News')
        self.assertTrue(News.objects.filter(title='New Test News').exists())

    def test_create_news_regular_user(self):
        """Test that regular users cannot create news"""
        regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('news-list')
        data = {
            'title': 'Unauthorized News',
            'content': 'This should not be created',
            'is_active': True
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_news(self):
        """Test updating news"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('news-detail', args=[self.news.id])
        data = {
            'title': 'Updated News Title',
            'is_active': False
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.news.refresh_from_db()
        self.assertEqual(self.news.title, 'Updated News Title')
        self.assertFalse(self.news.is_active)

    def test_delete_news(self):
        """Test deleting news"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('news-detail', args=[self.news.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(News.objects.filter(id=self.news.id).exists())


class TestFeedbackManagement(APITestCase):
    """Test feedback management"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            phone='09129876543',
            password='adminpass123'
        )
        from core.models import Employee
        self.admin_employee = Employee.objects.create(
            user=self.admin,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True
        )

        # Create feedback
        self.feedback = Feedback.objects.create(
            name='Test User',
            last_name='Feedback',
            email='test@example.com',
            phone_number='09123456789',
            message='This is a test feedback message with more than 10 characters.'
        )

    def test_create_feedback_public(self):
        """Test creating feedback (public access)"""
        url = reverse('feedback-list')
        data = {
            'name': 'New User',
            'last_name': 'New Feedback',
            'email': 'new@example.com',
            'phone_number': '09129876543',
            'message': 'This is a new feedback message with enough characters.'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Feedback.objects.filter(email='new@example.com').exists())

    def test_create_feedback_invalid_message(self):
        """Test creating feedback with invalid message (too short)"""
        url = reverse('feedback-list')
        data = {
            'name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'message': 'Short'  # Less than 10 characters
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_feedback_no_contact(self):
        """Test creating feedback without phone or email"""
        url = reverse('feedback-list')
        data = {
            'name': 'Test',
            'last_name': 'User',
            'message': 'This is a valid message with enough characters.'
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_feedback_admin(self):
        """Test listing feedback as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('feedback-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)

    def test_list_feedback_regular_user(self):
        """Test that regular users cannot list feedback"""
        regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('feedback-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_feedback_status(self):
        """Test updating feedback status as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('feedback-detail', args=[self.feedback.id])
        data = {
            'status': 'replied',
            'is_read': True
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.feedback.refresh_from_db()
        self.assertEqual(self.feedback.status, 'replied')
        self.assertTrue(self.feedback.is_read)


class TestContactInfoManagement(APITestCase):
    """Test contact info management"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            phone='09129876543',
            password='adminpass123'
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
            can_manage_site_settings=True
        )

    def test_get_contact_info(self):
        """Test getting contact info (public access)"""
        url = reverse('contact-info')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return contact info (creates if doesn't exist)

    def test_update_contact_info_admin(self):
        """Test updating contact info as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('contact-info')
        data = {
            'phone': '02112345678',
            'email': 'info@example.com',
            'address': 'Test address',
            'working_hours': '9 AM - 5 PM'
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['phone'], '02112345678')

    def test_update_contact_info_regular_user(self):
        """Test that regular users cannot update contact info"""
        regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('contact-info')
        data = {'phone': '02112345678'}

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestAboutUsManagement(APITestCase):
    """Test about us management"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            phone='09129876543',
            password='adminpass123'
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
            can_manage_site_settings=True
        )

    def test_get_about_us(self):
        """Test getting about us (public access)"""
        url = reverse('about-us')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_about_us_admin(self):
        """Test updating about us as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('about-us')
        data = {
            'title': 'Updated About Us Title',
            'content': 'Updated content for about us section.'
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated About Us Title')

    def test_update_about_us_regular_user(self):
        """Test that regular users cannot update about us"""
        regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('about-us')
        data = {'title': 'Unauthorized Update'}

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestVisitTracking(APITestCase):
    """Test visit tracking"""

    def test_track_visit(self):
        """Test tracking page visits"""
        url = reverse('visit-track')
        data = {'path': '/news/1/'}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Visit.objects.filter(path='/news/1/').exists())

    def test_visit_stats_admin(self):
        """Test getting visit statistics as admin"""
        # Create admin user
        admin = User.objects.create_user(
            phone='09129876543',
            password='adminpass123'
        )
        from core.models import Employee
        admin_employee = Employee.objects.create(
            user=admin,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True
        )

        # Create some visits
        Visit.objects.create(path='/news/1/', ip_address='192.168.1.1')
        Visit.objects.create(path='/about/', ip_address='192.168.1.2')

        self.client.force_authenticate(user=admin)
        url = reverse('visit-stats')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_visits', response.data)
        self.assertIn('this_month_visits', response.data)

    def test_visit_stats_regular_user(self):
        """Test that regular users cannot access visit stats"""
        regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('visit-stats')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestDashboard(APITestCase):
    """Test dashboard functionality"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            phone='09129876543',
            password='adminpass123'
        )
        from core.models import Employee
        self.admin_employee = Employee.objects.create(
            user=self.admin,
            first_name='Admin',
            last_name='User',
            national_id='0987654321',
            phone='09129876543',
            status='approved',
            is_staff_admin=True
        )

        # Create some test data
        Visit.objects.create(path='/news/1/', ip_address='192.168.1.1')
        News.objects.create(
            title='Test News',
            content='Test content',
            is_active=True
        )

    def test_get_dashboard_admin(self):
        """Test getting dashboard data as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('dashboard')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_visits', response.data)
        self.assertIn('total_news', response.data)
        self.assertIn('active_news', response.data)

    def test_get_dashboard_regular_user(self):
        """Test that regular users cannot access dashboard"""
        regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('dashboard')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TestSubtitleManagement(APITestCase):
    """Test subtitle management"""

    def setUp(self):
        # Create admin user
        self.admin = User.objects.create_user(
            username='admin',
            phone_number='09129876543',
            password='adminpass123'
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
            can_manage_blog=True
        )

        # Create subtitles
        self.subtitle1 = Subtitle.objects.create(
            text='First subtitle',
            is_active=True
        )
        self.subtitle2 = Subtitle.objects.create(
            text='Second subtitle',
            is_active=False
        )

    def test_list_subtitles_admin(self):
        """Test listing subtitles as admin"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('subtitles-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_list_subtitles_regular_user(self):
        """Test that regular users cannot list subtitles"""
        regular_user = User.objects.create_user(
            phone='09123456789',
            password='userpass123'
        )
        self.client.force_authenticate(user=regular_user)
        url = reverse('subtitles-list')

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_subtitle(self):
        """Test creating new subtitle"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('subtitles-list')
        data = {
            'text': 'New subtitle for homepage',
            'is_active': False
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Subtitle.objects.filter(text='New subtitle for homepage').exists())

    def test_toggle_active_subtitle(self):
        """Test toggling subtitle active status"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('subtitles-toggle-active', args=[self.subtitle2.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.subtitle2.refresh_from_db()
        self.assertTrue(self.subtitle2.is_active)
        # First subtitle should be deactivated
        self.subtitle1.refresh_from_db()
        self.assertFalse(self.subtitle1.is_active)

    def test_update_subtitle(self):
        """Test updating subtitle"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('subtitles-detail', args=[self.subtitle1.id])
        data = {
            'text': 'Updated subtitle text',
            'is_active': False
        }

        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.subtitle1.refresh_from_db()
        self.assertEqual(self.subtitle1.text, 'Updated subtitle text')
        self.assertFalse(self.subtitle1.is_active)

    def test_delete_subtitle(self):
        """Test deleting subtitle"""
        self.client.force_authenticate(user=self.admin)
        url = reverse('subtitles-detail', args=[self.subtitle1.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Subtitle.objects.filter(id=self.subtitle1.id).exists())