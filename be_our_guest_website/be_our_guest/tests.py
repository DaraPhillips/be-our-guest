"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".
"""


import datetime
import json
from datetime import datetime, timedelta
from unittest.mock import patch

import jwt
from be_our_guest.models import (County, Event, User, Venue, VenueType,
                                 WeddingType)
from be_our_guest.serializers import MyTokenObtainPairSerializer
from be_our_guest.views import (create_event, events, get_venues,
                                 register_user,
                                send_password_email, update_event)
from be_our_guest.views import (
    events, create_event, update_event, get_venues, send_password_email
)
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

from rest_framework import permissions
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from be_our_guest import views

import django
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.test import Client, SimpleTestCase, TestCase
from django.urls import resolve, reverse
from django.utils import timezone
from django.utils.timezone import datetime, timedelta

# TODO: Configure your database in settings.py and sync before running tests.

schema_view = get_schema_view(
    openapi.Info(
        title="API",
        default_version='v1',
        description="API Documentation",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Create your tests here.

#--------------URL TESTS---------------------
class TestUrls(SimpleTestCase): 
    
    def test_register_url_is_resolved(self):
        url = reverse('register')
        self.assertEqual(resolve(url).func, register_user)
    
    def test_events_url_is_resolved(self):
        url = reverse('events')
        self.assertEqual(resolve(url).func, events)
        
    def test_create_event_url_is_resolved(self):
        url = reverse('create_event')
        self.assertEqual(resolve(url).func, create_event)
        
    def test_update_event_url_is_resolved(self):
        url = reverse('update_event', kwargs={'event_id': 1})
        self.assertEqual(resolve(url).func, update_event)

    def test_users_url_is_resolved(self):
        url = reverse('users')
        self.assertEqual(resolve(url).func, views.get_users)
    
    def test_login_with_validation_url_is_resolved(self):
        url = reverse('login_with_validation')
        self.assertEqual(resolve(url).func, views.login)
    
    def test_venues_url_is_resolved(self):
        url = reverse('venues')
        self.assertEqual(resolve(url).func, get_venues)
    
    def test_send_password_email_url_is_resolved(self):
        url = reverse('send_password_email')
        self.assertEqual(resolve(url).func, send_password_email)
    
    def test_token_obtain_pair_url_is_resolved(self):
        url = reverse('token_obtain_pair')
        self.assertEqual(resolve(url).func.__name__, TokenObtainPairView.as_view().__name__)
    
    def test_token_refresh_url_is_resolved(self):
        url = reverse('token_refresh')
        self.assertEqual(resolve(url).func.__name__, TokenRefreshView.as_view().__name__)
           
#--------------VIEWS TESTS---------------------       
class TestUserViews(TestCase):
    def setUp(self):
        self.client = Client()

    def test_get_users(self):
        response = self.client.get(reverse('users'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_venues(self):
        response = self.client.get(reverse('venues'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_send_password_email(self):
        data = {
            'email': 'test@example.com'
        }
        response = self.client.post(reverse('send_password_email'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_register_user(self):
        # Data to be sent in the POST request
        data = {
            'id': 1,  # Assuming 'id' is an auto-generated field
            'password': 'test_password123',
            'last_login': timezone.now().isoformat(),  # Assuming 'last_login' is automatically set to the current time
            'is_superuser': False,  # Assuming 'is_superuser' defaults to False
            'first_name': 'testname',
            'last_name': 'testlastname',
            'is_staff': False,  # Assuming 'is_staff' defaults to False
            'is_active': True,  # Assuming 'is_active' defaults to True
            'date_joined': timezone.now().isoformat(),  # Assuming 'date_joined' is automatically set to the current time
            'email': 'test@example.com',
            'user_image': 'path/to/image.jpg',  # Assuming 'user_image' is a file field
            # Add more fields here as needed
            }

        # Make a POST request to register_user endpoint
        response = self.client.post(reverse('register'), data=data)
    
        # Assert that the response status code is 201 (Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Assert that the response data contains the expected message
        self.assertEqual(response.data, {"message": "User registered successfully"})
           
        
#--------------API TESTS---------------------       
class TestUserViewsApi(APITestCase):
    def test_login_with_validation(self):
        url = reverse('login_with_validation')
        data = { 'first_name':'testname',
            'last_name': 'testlastname',
            'email': 'test@example.com', 
            'password': 'password123#'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
class AuthenticationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(first_name='testname',last_name= 'testlastname', email='test@example.com', password='password123#')

    def test_user_registration(self):
        url = reverse('register')
        data = {'first_name': 'testfirstname','last_name': 'testlastname', 'email': 'newuser@example.com', 'password': 'newpassword123#'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('token' in response.data)

    def test_user_login(self):
        # Create a user for testing purposes
        user = User.objects.create_user(username='testuser', email='test2@example.com', password='testpassword')
    
        # Data for user login
        url = reverse('token_obtain_pair')
        data = {'email': user.email, 'password': 'testpassword'}

        # Send POST request to obtain tokens
        response = self.client.post(url, data, format='json')

        # Check if the response is successful and contains access and refresh tokens
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.data)
        self.assertTrue('refresh' in response.data)
    
class TokenAuthenticationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(first_name='testname',last_name= 'testlastname', email='test@example.com', password='password123#')

    def test_token_refresh(self):
       
        refresh = RefreshToken.for_user(self.user)
        url = reverse('token_refresh')
        data = {
            'refresh': str(refresh)
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_invalid_refresh_token(self):
        # Attempt to refresh with an invalid refresh token
        url = reverse('token_refresh')
        data = {
            'refresh': 'invalid_refresh_token'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        
#--------------EVENT CREATION TESTS---------------------    

User = get_user_model() 
class MockToken:
    def __init__(self, user_id, email):
        self.user_id = user_id
        self.email = email

    def decode(self, encoding):
        # Mock decoding of the token
        return f"Mocked token for user {self.user_id} with email {self.email}"
    
class EventCreationTestCase(TestCase):
    def setUp(self):
        self.venue_type = VenueType.objects.create(name="Hotel")
        self.county = County.objects.create(name="Clare")
        self.user = User.objects.create_user(first_name='testname',last_name= 'testlastname', email='test@example.com', password='password123#')
        self.wedding_type = WeddingType.objects.create(name='Civil')
        self.client = APIClient()
        self.create_event_url = reverse('create_event')
        self.token = self.generate_jwt_token(self.user)
        print("JWT Token:", self.token)
        user_id = 123  
        email = "test@example.com"
        self.mock_token = MockToken(user_id=user_id, email=email)

        # Create Venue instance with all required fields
        self.venue = Venue.objects.create(
            name="Sample Venue",
            address1="123 Sample St",
            address2="",
            address3="",
            zipcode="12345",
            venue_type=self.venue_type,
            county=self.county  # Make sure to provide a valid county instance
        )
        
    def generate_jwt_token(self, user):
        """Generate JWT token for the user."""
        payload = {
            'username': user.username,
            'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
        }
        token_bytes = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        token_str = token_bytes.decode('utf-8')  # Convert bytes to string
        return token_str
    
    def test_authenticated_request_with_jwt_token(self):
        url = reverse('create_event')  # Replace 'create_event' with the actual endpoint name
        token_str = self.token  # Use token string directly
        headers = {'HTTP_AUTHORIZATION': 'Bearer ' + token_str}  # Pass token string directly
        data = {'example_key': 'example_value'}  # Your request data
        response = self.client.post(url, data, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_create_event(self):
        # Create necessary objects
        wedding_type = WeddingType.objects.create(name='Wedding')
        
        venue = Venue.objects.create(
            name='Sample Venue',
            address1='123 Sample St',
            address2='',
            address3='',
            zipcode='12345',
            venue_type=VenueType.objects.first(),  # Assuming you have VenueType objects already created
            county=County.objects.first()  # Assuming you have County objects already created
        )

        # Test data
        event_data = {
            'date': timezone.now().date(),
            'host_user': self.user,
            'respond_by_date': timezone.now().date(),
            'venue_1': venue,
            'venue_1_time': timezone.now().time(),
            'wedding_type': wedding_type
        }

        # Create the event
        event = Event.objects.create(**event_data)

        # Perform assertions as needed
        self.assertEqual(Event.objects.count(), 1)
        self.assertEqual(event.date, event_data['date'])
        # Add more assertions as needed

    #create event in the past
    def test_create_event_in_past(self):
            past_date = datetime.now() - timedelta(days=1)
            event_data = {
            'host_user': self.user.id,
            'wedding_type': 'Wedding',
            'venue_1': self.venue.id,
            'venue_1_time': '12:00:00', 
            'date': past_date.strftime('%Y-%m-%d'),  
            'respond_by_date': '2024-12-01'  
        }
    
            with self.assertRaises(ValueError):
                Event.objects.create(**event_data)
            
    # Test for respondByDate after event date
    def test_respond_by_date_after_event_date(self):      
        event_date = datetime.now() + timedelta(days=7)
        respond_by_date = event_date + timedelta(days=1)
        event_data = {
            'host_user': self.user.id,
            'eventType': 'Wedding',
           'venue_1': self.venue.id,
            'time': '12:00:00',
            # Event date in future
            'date': event_date.strftime('%Y-%m-%d'),  
            # RespondByDate after event date
            'respondByDate': respond_by_date.strftime('%Y-%m-%d')  
        }

        # Attempt to create the event
        with self.assertRaises(ValueError):
            Event.objects.create(**event_data)

    #test for valid event creation
    def test_valid_event_creation(self):       
        future_date = datetime.now() + timedelta(days=7)
        respond_by_date = future_date - timedelta(days=1)   
        wedding_type = WeddingType.objects.create(name='Civil')      
        fixed_venue_1_time = datetime.strptime('12:00:00', '%H:%M:%S').time()
        
        event_data = {
            'date': future_date,
            'host_user': self.user,
            'respond_by_date': respond_by_date,
            'venue_1': self.venue,  # Pass the venue instance directly
            'venue_1_time': fixed_venue_1_time,
            'wedding_type': wedding_type,  # Use the ID of the created WeddingType instance
        }

        # Attempt to create the event
        event = Event.objects.create(**event_data)

        # Check if the event was created successfully
        self.assertIsNotNone(event)
        self.assertEqual(event.host_user_id, self.user.id)
        self.assertEqual(event.date.strftime('%Y-%m-%d'), future_date.strftime('%Y-%m-%d'))
        self.assertEqual(event.respond_by_date.strftime('%Y-%m-%d'), respond_by_date.strftime('%Y-%m-%d'))
        self.assertEqual(event.venue_1_id, self.venue.id)
        self.assertEqual(event.venue_1_time.strftime('%H:%M:%S'), fixed_venue_1_time.strftime('%H:%M:%S'))  # Use strftime on venue_1_time
        self.assertEqual(event.wedding_type_id, wedding_type.id)
       
    def test_different_locations(self):      
        # Create two Venue instances
        venue1 = Venue.objects.create(
            name="Venue 1",
            address1="123 Venue St",
            address2="",
            address3="",
            zipcode="12345",
            venue_type=self.venue_type,
            county=self.county
        )

        venue2 = Venue.objects.create(
            name="Venue 2",
            address1="456 Venue St",
            address2="",
            address3="",
            zipcode="54321",
            venue_type=self.venue_type,
            county=self.county
        )

        respond_by_date = timezone.now().date() + timedelta(days=1)
        wedding_type = WeddingType.objects.create(name='Civil')

    # Create two Event instances with different venues and respond_by_dates
        event1 = Event.objects.create(
            venue_1=venue1,
            host_user=self.user,
            respond_by_date=respond_by_date,
            date=timezone.now().date(),
            venue_1_time=timezone.now().time(),  # Default time
            wedding_type = wedding_type
        )
        event2 = Event.objects.create(
            venue_1=venue2,
            host_user=self.user,
            respond_by_date=respond_by_date,
            date=timezone.now().date(),
            venue_1_time=timezone.now().time(),  # Default time
            wedding_type = wedding_type
        )

        # Assert that the venues are different
        self.assertNotEqual(event1.venue_1, event2.venue_1)
        
    def test_create_venue(self):
        # Ensure CountySetUp is called before creating the venue
        self.county_set_up()  
        venue = Venue.objects.create(**self.venue_data)
        self.assertIsNotNone(venue)
        self.assertEqual(venue.name, self.venue_data['name'])
        self.assertEqual(venue.address1, self.venue_data['address1'])
        self.assertEqual(venue.address2, self.venue_data['address2'])
        self.assertEqual(venue.address3, self.venue_data['address3'])
        self.assertEqual(venue.zipcode, self.venue_data['zipcode'])
        self.assertEqual(venue.venue_type, self.venue_data['venue_type'])

    def test_venue_string_representation(self): 
        self.county_set_up()  
        venue = Venue.objects.create(**self.venue_data)
        expected_str = f"Venue ID: {venue.id}, Name: {venue.name}, County: {venue.county}"
        self.assertEqual(str(venue), expected_str)

    def county_set_up(self):
        self.county = County.objects.create(name='Test County')  
        self.venue_type = VenueType.objects.create(name='Test Type')  
        self.venue_data = {
            'county': self.county,
            'name': 'Test Venue',
            'address1': '123 Test St',
            'address2': 'Suite 100',
            'address3': 'Land',
            'zipcode': '12345',
            'venue_type': self.venue_type,
        }
        
    def test_rsvp_after_event_date(self):
        event_data = {
            "event": {
                "time": "12:00:00",
                "date": "2024-04-10",
                "respondByDate": "2024-04-12"  # RSVP date after event date
                # Add other required fields
            }
        }
        response = self.client.post(self.create_event_url, event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_rsvp_date_past_event_date(self):
        event_data = {
            "event": {
                "time": "12:00:00",
                "date": "2024-04-10",
                "respondByDate": "2024-04-09"  # RSVP date before event date
                # Add other required fields
            }
        }
        response = self.client.post(self.create_event_url, event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test scenario: SQL injection in wedding title
    def test_sql_injection_in_wedding_title(self):
        event_data = {
            "event": {
                "title": "My Wedding'); DROP TABLE my_table; --",
                # Add other required fields
            }
        }
        response = self.client.post(self.create_event_url, event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)    

    def test_create_event_with_numbers_in_wedding_title(self):
        """Test scenario: Create event with numbers in wedding title"""
        url = reverse('create_event')
        data = {
            "event": {
                "title": "Wedding 123",
                "date": "2024-04-15",
                "time": "18:00:00",
            }
        }
        my_token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE0Mzg5OTI1LCJpYXQiOjE3MTQzODcyMjUsImp0aSI6IjAwZjdhNDc2MGViNzRmZmM5N2E1ZWUxNWZiNTlkYjRhIiwiaWQiOjE0fQ.k9dyFIoPsG6BlWsd_zBvw2RoNo7euKFUM9HacmFfgOc"
        headers = {'Authorization': 'Bearer ' + my_token}
        print(url)
        response = self.client.post(url, data, format='json', **headers)

        print("Request headers:", headers)
        print(response.data)
        print(response.status_code)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_event_with_hotel_in_church_id(self):
        event_data = {
            "event": {
                "venue1ID": "hotel",  # Assuming 'hotel' is mistakenly input as church ID
                # Add other required fields
            }
        }
        response = self.client.post(self.create_event_url, event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test scenario: Church time after hotel time
    def test_church_time_after_hotel_time(self):
        event_data = {
            "event": {
                "venue1Time": "15:00:00",  # Church time
                "venue2Time": "12:00:00",  # Hotel time
                # Add other required fields
            }
        }
        response = self.client.post(self.create_event_url, event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test scenario: Create event with no RSVP date, Event date, Hotel Time
    def test_create_event_with_missing_fields(self):
        event_data = {
            "event": {
                # Missing RSVP date, Event date, and Hotel Time
                # Add other required fields
            }
        }
        response = self.client.post(self.create_event_url, event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Test scenario: Create event with church selected but no time
    def test_create_event_with_church_selected_no_time(self):
        event_data = {
            "event": {
                "venue1ID": "church",  # Assuming 'church' is selected
                # Missing church time
                # Add other required fields
            }
        }
        response = self.client.post(self.create_event_url, event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)