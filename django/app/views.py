"""
Definition of views.
"""
import logging
import re
from contextvars import Token
from datetime import date, datetime

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import jwt
from rest_framework import status, viewsets
from rest_framework.decorators import (action, api_view,
                                       authentication_classes,
                                       permission_classes)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import \
    BCryptSHA256PasswordHasher  # password hasher (sn)
from django.contrib.auth.hashers import (  # sn for login validation
    check_password, make_password)
from django.http import HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import \
    csrf_exempt  # sn for the create event api call
import random
import string
from django.core.mail import send_mail
from django.http import HttpResponse

from .models import Countries, Event, Guest, Users, VenueDetails
from .serializers import (CountriesSerializer, EventSerializer,
                          EventUpdateSerializer, MyTokenObtainPairSerializer,
                          UsersSerializer, VenueDetailsSerializer)


class UsersViewSet(viewsets.ViewSet):
    """
    API endpoint for interacting with users.
    """
    def list(self, request):
        """
        Return a list of all users.
        """
        queryset = Users.objects.all()
        serializer = UsersSerializer(queryset, many=True)
        return Response(serializer.data)
    
class EventViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for interacting with your API.
    """
    def list(self, request):
        """
        Return a list of all events.
        """
        queryset = Event.objects.all()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)
    
def guests(request):
    guests = Guest.objects.all()
    # Serialize all objects
    serializer = GuestSerializer(guests, many=True)
    # Return serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_all_users(request):
    users = Users.objects.all()
    serializer = UsersSerializer(users, many=True)
    response = JsonResponse(serializer.data, safe=False)
    response["Access-Control-Allow-Origin"] = "http://localhost:5173"
    return response

@api_view(['GET'])
def get_users(request):
    token = request.GET.get('token')
    if token:
        try:
            # Decode the token to get the user_id
            decoded_token = jwt.decode(token, 'f1bd2a4b-eaff-48c7-a492-b32c0ed11766', algorithms=['HS256'])
            user_id = decoded_token['userId']
            # Retrieve the user based on the user_id
            user = get_object_or_404(Users, pk=user_id)
            # Serialize and return the user data
            return Response({'id': user.userId, 'firstName': user.firstName, 'email': user.email})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # If no token is provided, return all users
        users = Users.objects.all()
        data = [{'id': user.id, 'firstName': user.firstName, 'email': user.email} for user in users]
        return Response(data)

@api_view(['POST'])
def send_password_email(request):
    if request.method == 'POST':
        # Extract recipient data from the request data
        recipient_emails = request.data.get('recipients', [])  # Expect a list of dictionaries

        # Validate data structure
        if not isinstance(recipient_emails, list):
            return Response({'error': 'Invalid request format: "recipients" list expected'}, status=400)

        successful_emails = []  # Track successfully sent emails for the response

        for recipient in recipient_emails:
            email = recipient.get('email')
            first_name = recipient.get('firstName')
            last_name = recipient.get('lastName')

            if not email or not first_name or not last_name:
                return Response({'error': 'Missing required fields: email, firstName, lastName'}, status=400)

            # Generate a random password
            password = generate_password()

            # Validate the generated password before using it
            is_valid_password, password_error = validate_password(password)
            if not is_valid_password:
                return Response({'error': f'Generated password failed validation: {password_error}'}, status=400)

            hashed_password = make_password(password)
            
            # Prepare user data with the generated password
            user_data = {
                'email': email,
                'password': hashed_password,  # Placeholder for hashed password
                'firstName': first_name,
                'lastName': last_name,
            }

            # Create a new user account using the serializer
            serializer = UsersSerializer(data=user_data)
            if serializer.is_valid():
                serializer.save()  # This will hash the password before saving the user
                successful_emails.append(email)
            else:
                # Handle potential serializer errors (optional)
                return Response(serializer.errors, status=400)

            try:
                # Send the email regardless of user creation (informational)
                send_mail(
                    'Your New Password',
                    f'Your new password is: "{password}"',
                    'beourguest48@gmail.com',
                    [email],  # Use the individual email address
                    fail_silently=False,
                )
            except Exception as e:
                # Handle potential errors (e.g., sending failure)
                return Response({'error': f'Failed to send email to {email}: {e}'}, status=500)

        # Return a success message with details on sent emails
        message = f'Password email(s) sent successfully to: {", ".join(successful_emails)}'
        return Response({'message': message}, status=200)

# @api_view(['POST'])
# def send_password_email(request):
#     if request.method == 'POST':
#         # Extract recipient data from the request data
#         recipient_emails = request.data.get('recipients', [])  # Expect a list of dictionaries

#         # Validate data structure
#         if not isinstance(recipient_emails, list):
#             return Response({'error': 'Invalid request format: "recipients" list expected'}, status=400)

#         successful_emails = []  # Track successfully sent emails for the response

#         for recipient in recipient_emails:
#             email = recipient.get('email')
#             first_name = recipient.get('firstName')
#             last_name = recipient.get('lastName')

#             if not email or not first_name or not last_name:
#                 return Response({'error': 'Missing required fields: email, firstName, lastName'}, status=400)

#             # Generate a random password (unchanged logic)
#             password = generate_password()
#             is_valid_password, password_error = validate_password(password)
#             if not is_valid_password:
#                 return Response({'error': f'Generated password failed validation: {password_error}'}, status=400)

#             hashed_password = make_password(password)

#             # Prepare user data (unchanged logic)
#             user_data = {
#                 'email': email,
#                 'password': hashed_password,  # Placeholder for hashed password
#                 'firstName': first_name,
#                 'lastName': last_name,
#             }

#             # Create a new user account using the serializer (unchanged logic)
#             serializer = UsersSerializer(data=user_data)
#             if serializer.is_valid():
#                 user = serializer.save()  # Save the user instance
#                 successful_emails.append(email)

#                 # Create a GuestRsvp entry for the user and event (new logic)
#                 event_id = request.data.get('event_id')  # Assuming event ID is provided in the request
#                 if event_id:
#                     try:
#                         event = Event.objects.get(pk=event_id)
#                         GuestRsvp.objects.create(guest=user, event=event)
#                     except (Event.DoesNotExist, IntegrityError) as e:
#                         # Handle potential errors (e.g., event not found, duplicate entry)
#                         return Response({'error': f'Failed to create RSVP: {e}'}, status=400)

#             else:
#                 # Handle potential serializer errors (optional)
#                 return Response(serializer.errors, status=400)

#             try:
#                 # Send the email regardless of user creation (unchanged logic)
#                 send_mail(
#                     'Your New Password',
#                     f'Your new password is: "{password}"',
#                     'sender@example.com',
#                     [email],  # Use the individual email address
#                     fail_silently=False,
#                 )
#             except Exception as e:
#                 # Handle potential errors (e.g., sending failure)
#                 return Response({'error': f'Failed to send email to {email}: {e}'}, status=500)

#         # Return a success message with details on sent emails (unchanged logic)
#         message = f'Password email(s) sent successfully to: {", ".join(successful_emails)}'
#         return Response({'message': message}, status=200)

def generate_password(length=10):
    # Define sets of characters to choose from
    lowercase_letters = string.ascii_lowercase
    uppercase_letters = string.ascii_uppercase
    digits = string.digits
    special_characters = string.punctuation

    # Ensure at least one character from each category
    guaranteed_characters = [
        random.choice(lowercase_letters),
        random.choice(uppercase_letters),
        random.choice(digits),
        random.choice(special_characters),
    ]

    # Calculate the remaining length for lowercase letters
    remaining_length = length - len(guaranteed_characters)

    # Generate the remaining characters with a preference for lowercase letters
    password_characters = guaranteed_characters + random.choices(
        lowercase_letters, k=remaining_length, weights=[1] * len(lowercase_letters)  # Use a weight of 1 for each lowercase letter
    )

    # Shuffle the characters to ensure randomness
    random.shuffle(password_characters)

    # Concatenate the characters to form the password
    password = ''.join(password_characters)
    return password

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            # Retrieve the password from the serializer data
            password = serializer.validated_data['password']
            # Validate the password
            is_valid_password, password_error = validate_password(password)
            if not is_valid_password:
                return Response({'error': password_error}, status=status.HTTP_400_BAD_REQUEST)
            # Hash the password using make_password
            hashed_password = make_password(password)
            # Update the serializer data with the hashed password
            serializer.validated_data['password'] = hashed_password
            # Save the user with the hashed password
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        # Extract email and password from the request data
        email = request.data.get('email')
        password = request.data.get('password')
 
        # Check if email and password are provided
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
 
        try:
            # Retrieve the user from the database or return a 404 if not found
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
 
        # Check if the provided password matches the hashed password in the database
        if check_password(password, user.password):
            # Passwords match, generate JWT token
            serializer = MyTokenObtainPairSerializer()
            token = serializer.get_token(user)
            # Return success response with JWT token
            return Response({
                'message': 'Login successful',
                'userId': user.userId,
                'email': user.email,
                'real password': password,
                'real password hs': make_password(password),
                'real password hs1': make_password(password),
                'token': str(token.access_token)  # Include JWT token in response
            })
        else:
            # Passwords don't match, login failed
            return Response({'error': 'Invalid details',
                'userId': user.userId,
                'password': user.password, 
                'real password': password,
                'real password hs': make_password(password),
                'real password hs1': make_password(password),
                
                
                'email': user.email,}, status=status.HTTP_401_UNAUTHORIZED)
 
    else:
        # Handle other HTTP methods
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def events(request):
    events = Event.objects.all()
    # Serialize all objects
    serializer = EventSerializer(events, many=True)
    # Return serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    logger = logging.getLogger(__name__)
    logger.info('Received request to create event')
    if request.method == 'POST':
        logger.debug('Extracting data from request...')
        # Extract data from request
        event_data = request.data.get('event')
        # Check if 'time' and 'date' fields are present
        if 'time' not in event_data or 'date' not in event_data:
            logger.error('Time and date fields are required')
            return Response({'error': 'Time and date fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        # Validate time and date formats
        time_format = '%H:%M:%S'
        date_format = '%Y-%m-%d'
        time_str = event_data['time']
        # Add seconds if not provided
        if len(time_str.split(':')) == 2:
            time_str += ':00'
        date_str = event_data['date']
        if not time_str.strip() or not date_str.strip():
            logger.error('Time and date fields cannot be empty')
            return Response({'error': 'Time and date fields cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            datetime.strptime(time_str, time_format)
            event_data['time'] = datetime.strptime(time_str, time_format).time()
            event_date = datetime.strptime(date_str, date_format).date()
        except ValueError as e:
            logger.error(f'Invalid time or date format: {e}')
            return Response({'error': 'Invalid time or date format'}, status=status.HTTP_400_BAD_REQUEST)
        # Ensure date is not today or in the past
        if event_date <= date.today():
            logger.error('Event date must be in the future')
            return Response({'error': 'Event date must be in the future'}, status=status.HTTP_400_BAD_REQUEST)
        # Check if respondByDate comes after the date
        respond_by_date_str = event_data.get('respondByDate')
        if respond_by_date_str:
            try:
                respond_by_date = datetime.strptime(respond_by_date_str, date_format).date()
                if respond_by_date > event_date:
                    logger.error('Respond by date cannot come after the event date')
                    return Response({'error': 'Respond by date cannot come after the event date'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError as e:
                logger.error(f'Invalid respond by date format: {e}')
                return Response({'error': 'Invalid respond by date format'}, status=status.HTTP_400_BAD_REQUEST)
        # Get venueDetailsID from request data
        venue_details_id = event_data.pop('venue', None)
        # Retrieve host ID from authenticated user
        host_id = request.user.userId  # Assuming the host ID is stored in the user object
        # Add venueDetailsID and hostID to event_data dictionary
        event_data['venueDetailsID'] = venue_details_id
        event_data['hostID'] = host_id
        logger.debug('Creating event instance...')
        # Create event instance
        event_serializer = EventSerializer(data=event_data)
        if event_serializer.is_valid():
            # Save event instance
            event_instance = event_serializer.save()
            logger.info('Event created successfully')
            return Response({
                'message': 'Event created successfully',
                'event_id': event_instance.pk,
            }, status=status.HTTP_201_CREATED)
        else:
            logger.error(f'Error creating event: {event_serializer.errors}')
            return Response({'error': 'Error creating event', 'errors': event_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    else:
        logger.warning('Method not allowed')
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
# Newer model version
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_event(request):
#     logger = logging.getLogger(__name__)
#     logger.info('Received request to create event')

#     if request.method == 'POST':
#         logger.debug('Extracting data from request...')
#         # Extract data from request
#         event_data = request.data.get('event')

#         # Check for required fields
#         required_fields = ['time', 'date', 'event_type', 'wedding_type']
#         missing_fields = [field for field in required_fields if field not in event_data]
#         if missing_fields:
#             logger.error(f'Missing required fields: {", ".join(missing_fields)}')
#             return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

#         # Validate time and date formats (same logic applies)
#         time_format = '%H:%M:%S'
#         date_format = '%Y-%m-%d'
#         time_str = event_data['time']
#         # Add seconds if not provided
#         if len(time_str.split(':')) == 2:
#             time_str += ':00'
#         date_str = event_data['date']
#         if not time_str.strip() or not date_str.strip():
#             logger.error('Time and date fields cannot be empty')
#             return Response({'error': 'Time and date fields cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             datetime.strptime(time_str, time_format)
#             event_data['venue_time_1'] = datetime.strptime(time_str, time_format).time()
#             event_date = datetime.strptime(date_str, date_format).date()
#         except ValueError as e:
#             logger.error(f'Invalid time or date format: {e}')
#             return Response({'error': 'Invalid time or date format'}, status=status.HTTP_400_BAD_REQUEST)

#         # Ensure date is not today or in the past (same logic applies)
#         if event_date <= date.today():
#             logger.error('Event date must be in the future')
#             return Response({'error': 'Event date must be in the future'}, status=status.HTTP_400_BAD_REQUEST)

#         # Check respondByDate (same logic applies)
#         respond_by_date_str = event_data.get('respondByDate')
#         if respond_by_date_str:
#             try:
#                 respond_by_date = datetime.strptime(respond_by_date_str, date_format).date()
#                 if respond_by_date > event_date:
#                     logger.error('Respond by date cannot come after the event date')
#                     return Response({'error': 'Respond by date cannot come after the event date'}, status=status.HTTP_400_BAD_REQUEST)
#             except ValueError as e:
#                 logger.error(f'Invalid respond by date format: {e}')
#                 return Response({'error': 'Invalid respond by date format'}, status=status.HTTP_400_BAD_REQUEST)

#         # Get venue details from request data (adjusted based on model)
#         venue_1_id = event_data.pop('venue', None)

#         # Retrieve host ID from authenticated user (same logic applies)
#         host_id = request.user.userId

#         # Get wedding type from request data (adjusted based on model)
#         wedding_type_id = event_data.pop('wedding_type', None)

#         # Create event instance with new model fields
#         event_data['host_user_id'] = host_id
#         event_data['venue_1_id'] = venue_1_id
#         event_data['wedding_type_id'] = wedding_type_id
#         event_serializer = EventSerializer(data=event_data)
#         if event_serializer.is_valid():
#             event_instance = event_serializer.save()
#             logger.info('Event created successfully')
#             return Response({
#                 'message': 'Event created successfully',
#                 'event_id': event_instance.pk,
#             }, status=status.HTTP_201_CREATED)
#         else:
#             logger.error(f'Error creating event: {event_serializer.errors}')


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_event(request, event_id):
    logger = logging.getLogger(__name__)
    logger.info('Received request to update event')

    try:
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    if event.host_user_id != request.user.id:  # Adjusted the field name
        return Response({'error': 'You are not allowed to edit this event'}, status=status.HTTP_403_FORBIDDEN)

    # Handle venue details updates (adjusted for multiple venues)
    venue_data = request.data.get('venues')
    if venue_data:
        venue_ids = []
        for venue_index in range(1, 4):  # Handle up to 3 venues
            venue_name = venue_data.get(f'venue_{venue_index}')
            if venue_name:
                try:
                    venue_details = VenueDetails.objects.get(name=venue_name)
                    venue_ids.append(venue_details.id)  # Store venue IDs for later
                except VenueDetails.DoesNotExist:
                    return Response({'error': 'Venue details not found'}, status=status.HTTP_400_BAD_REQUEST)
        # Assign venue IDs to corresponding fields
        event.venue_1_id = venue_ids[0] if venue_ids else None
        event.venue_2_id = venue_ids[1] if len(venue_ids) > 1 else None
        event.venue_3_id = venue_ids[2] if len(venue_ids) > 2 else None

    # Get wedding type ID from request data (adjusted based on model)
    wedding_type_id = request.data.pop('wedding_type', None)
    if wedding_type_id:
        event.wedding_type_id = wedding_type_id

    if request.method == 'PUT':
        serializer = EventUpdateSerializer(event, data=request.data)
    else:
        serializer = EventUpdateSerializer(event, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        logger.info('Event updated successfully')
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        logger.error(f'Error updating event: {serializer.errors}')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# def delete_event(request, event_id):
#     logger = logging.getLogger(__name__)
#     logger.info(f'Received request to delete event with ID: {event_id}')

#     try:
#         event = Event.objects.get(pk=event_id)
#     except Event.DoesNotExist:
#         return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

#     if event.host_user_id != request.user.id:  # Adjusted the field name
#         return Response({'error': 'You are not allowed to delete this event'}, status=status.HTTP_403_FORBIDDEN)

#     event.delete()
#     logger.info(f'Event with ID: {event_id} deleted successfully')
#     return Response({'message': 'Event deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_countries(request):
    countries = Countries.objects.all()
    serializer = CountriesSerializer(countries, many=True)
    return JsonResponse(serializer.data, safe=False)
 
 
@api_view(['GET'])
def get_venues(request):
    venues = VenueDetails.objects.all()
    serializer = VenueDetailsSerializer(venues, many=True)
    return JsonResponse(serializer.data, safe=False)
 
 

def home(request):
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        {
            'title':'Home Page',
            'year':datetime.now().year,
        }
    )
def contact(request):
    """Renders the contact page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/contact.html',
        {
            'title':'Contact',
            'message':'Your contact page.',
            'year':datetime.now().year,
        }
    )
def about(request):
    """Renders the about page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/about.html',
        {
            'title':'About',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )
# Custom password validation function
def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search("[A-Z]", password):
        return False, "Password must contain at least one capital letter."
    if not re.search("[0-9]", password):
        return False, "Password must contain at least one digit."
    if not re.search("[!@#$%^&*()_+=\-[\]{};':\"|,.<>?]", password):
        return False, "Password must contain at least one special character."
    return True, None


@api_view(['GET'])
def get_venues_by_country(request, country_id):
    venues = VenueDetails.objects.filter(countriesId=country_id)
    serializer = VenueDetailsSerializer(venues, many=True)
    return JsonResponse(serializer.data, safe=False)



def dashboard(request):
    # Retrieve the event from the database (assuming you have a model named Event)
    event = Event.objects.first()  # You may need to modify this query to get the correct event

    if event:
        # Calculate the time remaining until the event
        current_time = datetime.now()
        time_remaining = event.date - current_time

        # Pass the time remaining to the dashboard template
        return render(request, 'app/dashboard.html', {'time_remaining': time_remaining})
    else:
        # Handle case where there are no events
        return render(request, 'app/dashboard.html', {'time_remaining': None})