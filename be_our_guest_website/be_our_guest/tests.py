"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".
"""

import django
from django.test import TestCase

from django.contrib.auth.models import User
from .models import Guest, User, Event, County, Venue
from datetime import datetime, timedelta

from django.urls import reverse


# TODO: Configure your database in settings.py and sync before running tests.

class ViewTest(TestCase):
    """Tests for the application views."""

    if django.VERSION[:2] >= (1, 7):
        # Django 1.7 requires an explicit setup() when running tests in PTVS
        @classmethod
        def setUpClass(cls):
            super(ViewTest, cls).setUpClass()
            django.setup()

    def test_home(self):
        """Tests the home page."""
        response = self.client.get('/')
        self.assertContains(response, 'Home Page', 1, 200)

    def test_contact(self):
        """Tests the contact page."""
        response = self.client.get('/contact')
        self.assertContains(response, 'Contact', 3, 200)

    def test_about(self):
        """Tests the about page."""
        response = self.client.get('/about')
        self.assertContains(response, 'About', 3, 200)

# Create your tests here.
class LoginTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.username = 'testuser'
        self.password = 'testpassword'
        self.user = User.objects.create_user(username=self.username, password=self.password)

    def test_login_success(self):
        # Attempt to login with correct credentials
        response = self.client.post(reverse('login'), {'username': self.username, 'password': self.password}, follow=True)
        
        # Check if the login was successful
        self.assertTrue(response.context['user'].is_authenticated)
        self.assertEqual(response.status_code, 200)  # Assuming login redirects to a page with status code 200 on success

    def test_login_failure(self):
        # Attempt to login with incorrect password
        response = self.client.post(reverse('login'), {'username': self.username, 'password': 'wrongpassword'}, follow=True)
        
        # Check if the login failed
        self.assertFalse(response.context['user'].is_authenticated)
        self.assertEqual(response.status_code, 200)  # Assuming login page returns status code 200 on failure

////////////////////////////////////////////////////////////////////

"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".
"""

import django
from django.test import TestCase

from django.contrib.auth.models import User
from .models import Guest, User, Event, County, Venue
from datetime import datetime, timedelta


# TODO: Configure your database in settings.py and sync before running tests.

class ViewTest(TestCase):
    """Tests for the application views."""

    if django.VERSION[:2] >= (1, 7):
        # Django 1.7 requires an explicit setup() when running tests in PTVS
        @classmethod
        def setUpClass(cls):
            super(ViewTest, cls).setUpClass()
            django.setup()

    def test_home(self):
        """Tests the home page."""
        response = self.client.get('/')
        self.assertContains(response, 'Home Page', 1, 200)

    def test_contact(self):
        """Tests the contact page."""
        response = self.client.get('/contact')
        self.assertContains(response, 'Contact', 3, 200)

    def test_about(self):
        """Tests the about page."""
        response = self.client.get('/about')
        self.assertContains(response, 'About', 3, 200)

        #/////////////////////////////////////////////////////////////
        
class EventCreationTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create(username='testuser')

        # Create a test venue(needs to be changed to county)
        self.country = countries.objects.create(countryName='Test Country')
        self.venue = Venue.objects.create(name='Test Venue', address='123 Test St', zipcode='12345', countriesID=self.country)

    def test_create_event(self):
        # Test data
        event_data = {
            'hostID': self.user.id,
            'eventType': 'Wedding',
            'venueDetailsID': self.venue.id,
            'time': '12:00:00',
            'date': '2024-12-31',
            'respondByDate': '2024-12-01'
        }

        # Create the event
        event = Event.objects.create(**event_data)

        # Check if the event was created successfully
        self.assertIsNotNone(event)
        self.assertEqual(event.host_user, self.user.id)
        self.assertEqual(event.event_type, 'Wedding')
        self.assertEqual(event.venue, self.venue.id)
        self.assertEqual(str(event.time), '12:00:00')
        self.assertEqual(str(event.date), '2024-12-31')
        self.assertEqual(str(event.respondByDate), '2024-12-01')

class EventCreationTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create(username='testuser')

        # Create a test venue(needs to be changed to country)
        self.country = County.objects.create(countryName='Test Country')
        self.venue = Venue.objects.create(name='Test Venue', address='123 Test St', zipcode='12345', countriesID=self.country)

    def test_create_event_in_past(self):
        # Test data for event in the past
        past_date = datetime.now() - timedelta(days=1)
        event_data = {
            'hostID': self.user.id,
            'eventType': 'Wedding',
            'venueDetailsID': self.venue.id,
            'time': '12:00:00',
            'date': past_date.strftime('%Y-%m-%d'),  # Event in the past
            'respondByDate': '2024-12-01'
        }

        # Attempt to create the event
        with self.assertRaises(ValueError):
            Event.objects.create(**event_data)

    def test_respond_by_date_after_event_date(self):
        # Test data for respondByDate after event date
        event_date = datetime.now() + timedelta(days=7)
        respond_by_date = event_date + timedelta(days=1)
        event_data = {
            'hostID': self.user.id,
            'eventType': 'Wedding',
            'venueDetailsID': self.venue.id,
            'time': '12:00:00',
            'date': event_date.strftime('%Y-%m-%d'),  # Event date in future
            'respondByDate': respond_by_date.strftime('%Y-%m-%d')  # RespondByDate after event date
        }

        # Attempt to create the event
        with self.assertRaises(ValueError):
            Event.objects.create(**event_data)

    def test_valid_event_creation(self):
        # Test data for valid event creation
        future_date = datetime.now() + timedelta(days=7)
        respond_by_date = future_date - timedelta(days=1)
        event_data = {
            'hostID': self.user.id,
            'eventType': 'Wedding',
            'venueDetailsID': self.venue.id,
            'time': '12:00:00',
            'date': future_date.strftime('%Y-%m-%d'),  # Event date in future
            'respondByDate': respond_by_date.strftime('%Y-%m-%d')  # RespondByDate before event date
        }

class EventTestCase(TestCase):
    def test_different_locations(self):
        location1 = "Location A"  # Example location for first event
        location2 = "Location B"  # Example location for second event
        # Create two events with different locations
        event1 = Event.objects.create(location=location1)
        event2 = Event.objects.create(location=location2)
        # Assert that both events are created successfully
        self.assertIsNotNone(event1)
        self.assertIsNotNone(event2)

    def new_method(self):
        return ...

class EventTestCase(TestCase):
    def test_same_start_time(self):
        start_time = datetime(2024, 5, 15, 12, 0, 0)  # Example start time
        # Create an event with the start time
        Event.objects.create(start_time=start_time)
        # Attempt to create another event with the same start time
        with self.assertRaises(Exception):  # Adjust exception type as per your implementation
            Event.objects.create(start_time=start_time)

class EventTestCase(TestCase):
    def test_different_start_times(self):
        start_time1 = datetime(2024, 5, 15, 12, 0, 0)  # Example start time for first event
        start_time2 = datetime(2024, 5, 16, 12, 0, 0)  # Example start time for second event
        # Create two events with different start times
        event1 = Event.objects.create(start_time=start_time1)
        event2 = Event.objects.create(start_time=start_time2)
        # Assert that both events are created successfully
        self.assertIsNotNone(event1)
        self.assertIsNotNone(event2)


        # Create the event
        event = Event.objects.create(**event_data)

        # Check if the event was created successfully
        self.assertIsNotNone(event)

