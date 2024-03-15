"""
Definition of views.
"""
from contextvars import Token
from datetime import datetime, date
from django.shortcuts import render
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse
from .models import Countries, Event, Guest,VenueDetails
from .serializers import CountriesSerializer, EventSerializer, EventUpdateSerializer, MyTokenObtainPairSerializer, VenueDetailsSerializer
from .models import Users
from .serializers import UsersSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.contrib.auth import authenticate
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth.hashers import BCryptSHA256PasswordHasher  #password hasher (sn)
from django.contrib.auth.hashers import check_password, make_password #sn for login validation 
from django.views.decorators.csrf import csrf_exempt #sn for the create event api call
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
 
import re
import logging

class UsersViewSet(viewsets.ViewSet):
    """
    API endpoint for interacting with users.
    """
    def list(self, request):
        """
        Return a list of all users.
        """
        queryset = users.objects.all()
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
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = users.objects.all()
    serializer = UsersSerializer(users, many=True)
    return JsonResponse(serializer.data, safe=False)
 
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
 
@authentication_classes([JWTAuthentication])
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
                'message': 'View Login successful',
                'userId': user.userId,  
                'email': user.email,
                'token': str(token.access_token)  # Include JWT token in response
            })
        else:
            # Passwords don't match, login failed
            return Response({'error': 'Invalid details'}, status=status.HTTP_401_UNAUTHORIZED)
 
    else:
        # Handle other HTTP methods
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
 
def events(request):
    events = Event.objects.all()
    # Serialize all objects
    serializer = EventSerializer(events, many=True)
    # Return serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)


##this function should have date time formating and have business rules for the date 
##the rules should be the respond has to come before the date of event and the event cannot be made in the past or today 
##this function doesnt extract the host id from the token 
#@api_view(['POST'])
#@authentication_classes([JWTAuthentication])
#@permission_classes([IsAuthenticated])
#def create_event(request):
#    logger = logging.getLogger(__name__)
 
#    logger.info('Received request to create event')
 
#    if request.method == 'POST':
#        logger.debug('Extracting data from request...')
#        # Extract data from request
#        event_data = request.data.get('event')
 
#        # Check if 'time' and 'date' fields are present
#        if 'time' not in event_data or 'date' not in event_data:
#            logger.error('Time and date fields are required')
#            return Response({'error': 'Time and date fields are required'}, status=status.HTTP_400_BAD_REQUEST)
 
#        # Validate time and date formats
#        time_format = '%H:%M:%S'
#        date_format = '%Y-%m-%d'
#        time_str = event_data['time']
 
#        # Add seconds if not provided
#        if len(time_str.split(':')) == 2:
#            time_str += ':00'
 
#        date_str = event_data['date']
#        if not time_str.strip() or not date_str.strip():
#            logger.error('Time and date fields cannot be empty')
#            return Response({'error': 'Time and date fields cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
 
#        try:
#            datetime.strptime(time_str, time_format)
#            event_data['time'] = datetime.strptime(time_str, time_format).time()
#            event_date = datetime.strptime(date_str, date_format).date()
#        except ValueError as e:
#            logger.error(f'Invalid time or date format: {e}')
#            return Response({'error': 'Invalid time or date format'}, status=status.HTTP_400_BAD_REQUEST)
 
#        # Ensure date is not today or in the past
#        if event_date <= date.today():
#            logger.error('Event date must be in the future')
#            return Response({'error': 'Event date must be in the future'}, status=status.HTTP_400_BAD_REQUEST)
 
#        # Check if respondByDate comes after the date
#        respond_by_date_str = event_data.get('respondByDate')
#        if respond_by_date_str:
#            try:
#                respond_by_date = datetime.strptime(respond_by_date_str, date_format).date()
#                if respond_by_date > event_date:
#                    logger.error('Respond by date cannot come after the event date')
#                    return Response({'error': 'Respond by date cannot come after the event date'}, status=status.HTTP_400_BAD_REQUEST)
#            except ValueError as e:
#                logger.error(f'Invalid respond by date format: {e}')
#                return Response({'error': 'Invalid respond by date format'}, status=status.HTTP_400_BAD_REQUEST)
 
#        # Get venueDetailsID and hostID from request data
#        venue_details_id = event_data.pop('venue', None)
#        host_id = event_data.pop('host_id', None)
 
#        # Add venueDetailsID and hostID to event_data dictionary
#        event_data['venueDetailsID'] = venue_details_id
#        event_data['hostID'] = host_id
 
#        logger.debug('Creating event instance...')
#        # Create event instance
#        event_serializer = EventSerializer(data=event_data)
#        if event_serializer.is_valid():
#            # Save event instance
#            event_instance = event_serializer.save()
 
#            logger.info('Event created successfully')
#            return Response({
#                'message': 'Event created successfully',
#                'event_id': event_instance.pk,
#            }, status=status.HTTP_201_CREATED)
#        else:
#            logger.error(f'Error creating event: {event_serializer.errors}')
#            return Response({'error': 'Error creating event', 'errors': event_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
 
#    else:
#        logger.warning('Method not allowed')
#        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

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
    
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_event(request, event_id):
    try:
        event = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    if event.hostID != request.user.id:
        return Response({'error': 'You are not allowed to edit this event'}, status=status.HTTP_403_FORBIDDEN)

    venue_name = request.data.get('venue')
    if venue_name:
        try:
            venue_details = VenueDetails.objects.get(name=venue_name)
        except VenueDetails.DoesNotExist:
            return Response({'error': 'Venue details not found'}, status=status.HTTP_400_BAD_REQUEST)
        # Update event with new venue details
        event.venueDetailsID = venue_details

    if request.method == 'PUT':
        serializer = EventUpdateSerializer(event, data=request.data)
    else:
        serializer = EventUpdateSerializer(event, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def events(request):
    # Fetch all events along with their associated venue details
    events = Event.objects.select_related('venueDetailsID').all()
    
    # Serialize the events along with their venue details
    serialized_events = EventSerializer(events, many=True).data
    
    return Response(serialized_events)
 
 
 

 

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