"""
Definition of views.
"""

from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse
from .models import Event, Guest
from .serializers import EventSerializer, GuestSerializer 
from .models import users
from .serializers import UsersSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.contrib.auth import authenticate

from django.contrib.auth.hashers import BCryptSHA256PasswordHasher  #password hasher (sn)
from django.contrib.auth.hashers import check_password, make_password #sn for login validation 
from django.views.decorators.csrf import csrf_exempt #sn for the create event api call 


class GuestViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for interacting with your API.
    """

    def list(self, request):
        """
        Return a list of all guests.
        """
        queryset = Guest.objects.all()
        serializer = GuestSerializer(queryset, many=True)
        return Response(serializer.data)
    
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
def users(request):
    users = users.objects.all()
    serializer = UsersSerializer(users, many=True)
    return JsonResponse(serializer.data, safe=False)

from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            # Retrieve the password from the serializer data
            password = serializer.validated_data['password']
            
            # Hash the password using make_password
            hashed_password = make_password(password)
            
            # Update the serializer data with the hashed password
            serializer.validated_data['password'] = hashed_password
            
            # Save the user with the hashed password
            serializer.save()
            
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import authenticate


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        # Extract email and password from the request data
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if email and password are provided
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        print('Authentication for:', email) 
        user = authenticate(request, email=email, password=password)

        if user is not None:
            # User is authenticated
            # Return success response with user data
            print('User authenticated:', email)  # Debug print
            return JsonResponse({'message': 'Login successful', 'user_id': user.pk, 'email': user.email})
        else:
            # Authentication failed
            # Return error response
            print('Authentication failed for:', email)
            return JsonResponse({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    else:
        # Handle other HTTP methods
        return JsonResponse({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def events(request):
    events = Event.objects.all()

    # Serialize all objects
    serializer = EventSerializer(events, many=True)

    # Return serialized data as JSON response
    return JsonResponse(serializer.data, safe=False)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Event, VenueDetails, users
from .serializers import EventSerializer, UsersSerializer, VenueDetailsSerializer
from django.http import JsonResponse
from rest_framework.exceptions import ParseError
@api_view(['POST'])
def create_event(request):
    if request.method == 'POST':
        # Extract data from request
        event_data = request.data.get('event')
        bride_data = request.data.get('bride')
        groom_data = request.data.get('groom')
        venue_data = request.data.get('venueDetails')

        # Create or retrieve bride user
        if bride_data:
            bride_email = bride_data.get('email')
            bride, _ = users.objects.get_or_create(email=bride_email, defaults=bride_data)

        # Create or retrieve groom user
        if groom_data:
            groom_email = groom_data.get('email')
            groom, _ = users.objects.get_or_create(email=groom_email, defaults=groom_data)

            # Assign host ID if bride is defined
            if bride_data:
                host_id = bride.userId  # Make sure bride is defined before accessing its userId

                # Create event with host ID
                event_serializer = EventSerializer(data=event_data)
                if event_serializer.is_valid():
                    event_instance = event_serializer.save(hostID=host_id, **event_data)
                    event_id = event_instance.idevent

                    # Create venue details
                    venue_data['countriesID'] = int(venue_data['countriesID'])  # Convert countriesID to int
                    venue_data['venueDetailsID'] = event_id  # Set venueDetailsID to event ID
                    venue_serializer = VenueDetailsSerializer(data=venue_data)
                    if venue_serializer.is_valid():
                        venue_serializer.save()
                        return Response({'message': 'Event and VenueDetails created successfully'}, status=status.HTTP_201_CREATED)
                    else:
                        # Rollback event creation if venue details could not be saved
                        event_instance.delete()
                        error_details = {'venue_errors': venue_serializer.errors}
                        return Response(error_details, status=status.HTTP_400_BAD_REQUEST)
                else:
                    error_details = {'event_errors': event_serializer.errors}
                    return Response(error_details, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Return a response indicating that bride data is missing
                return Response({'error': 'Bride data is required'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Return a response indicating that groom data is missing
            return Response({'error': 'Groom data is required'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        # Return a response indicating that the method is not allowed
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


#@api_view(['POST'])
#def create_event(request):
#    if request.method == 'POST':
#        # Extract data from request
#        event_data = request.data.get('event')
#        bride_data = request.data.get('bride')
#        groom_data = request.data.get('groom')
#        venue_data = request.data.get('venueDetails')

#        # Basic validation to ensure required data is present
#        if not bride_data:
#            return Response({'error': 'Bride data is missing'}, status=status.HTTP_400_BAD_REQUEST)
#        if not groom_data:
#            return Response({'error': 'Groom data is missing'}, status=status.HTTP_400_BAD_REQUEST)
#        if not event_data:
#            return Response({'error': 'Event data is missing'}, status=status.HTTP_400_BAD_REQUEST)

#        # Create or retrieve bride user
#        bride_email = bride_data.get('email')
#        if not bride_email:
#            return Response({'error': 'Bride email is missing'}, status=status.HTTP_400_BAD_REQUEST)
#        bride, bride_created = users.objects.get_or_create(email=bride_email, defaults=bride_data)

#        # Create or retrieve groom user
#        groom_email = groom_data.get('email')
#        if not groom_email:
#            return Response({'error': 'Groom email is missing'}, status=status.HTTP_400_BAD_REQUEST)
#        groom, groom_created = users.objects.get_or_create(email=groom_email, defaults=groom_data)

#        # Assign host ID
#        host_id = bride.userId

#        # Create event with host ID
#        event_serializer = EventSerializer(data=event_data)
#        if event_serializer.is_valid():
#            # Assuming your Event model has a field 'hostID'
#            event_serializer.save(hostID=host_id)
#            return Response({'message': 'Event created successfully'}, status=status.HTTP_201_CREATED)
#        else:
#            return Response(event_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

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
#sn register user with email validation to check if used and hash and salt  the password 
@api_view(['POST'])
def register_user_with_validation(request):
    if request.method == 'POST':
        serializer = UsersSerializer(data=request.data)
        if serializer.is_valid():
            # Check if the email is already registered
            email = serializer.validated_data['email']
            if users.objects.filter(email=email).exists():
                return Response({'error': 'Email is already registered'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrieve the password from the serializer data
            password = serializer.validated_data['password']

            # Hash the password using BCryptSHA256PasswordHasher
            hasher = BCryptSHA256PasswordHasher()
            hashed_password = hasher.encode(password, hasher.salt())
            #hashed_password = hasher.encode(password)

            # Update the serializer data with the hashed password-9
            serializer.validated_data['password'] = hashed_password

            # Save the user with the hashed password
            serializer.save()

            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






    
#@api_view(['POST'])
#def register_user(request):
#    if request.method == 'POST':
#        serializer = UsersSerializer(data=request.data)
#        if serializer.is_valid():
#            # Retrieve the password from the serializer data
#            password = serializer.validated_data['password']
            
#            # Hash the password using make_password
#            hashed_password = make_password(password)
            
#            # Update the serializer data with the hashed password
#            serializer.validated_data['password'] = hashed_password
            
#            # Save the user with the hashed password
#            serializer.save()
            
#            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
#        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
def login_with_validation(request):
    if request.method == 'POST':
        # Extract email and password from the request data
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if email and password are provided
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve the user from the database
            user = users.objects.get(email=email)
        except users.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

        # Create BCryptSHA256PasswordHasher instance for custom password checking
        hasher = BCryptSHA256PasswordHasher()

        # Check if the provided password matches the hashed password in the database
        if hasher.verify(password, user.password):
            # Passwords match, login successful
            return Response({'message': 'Login successful', 'user_id': user.pk, 'email': user.email})
        else:
            # Passwords don't match, login failed
            return Response({'error': 'Invalid details'}, status=status.HTTP_401_UNAUTHORIZED)

    else:
        # Handle other HTTP methods
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)












    #sn login validation 
#@api_view(['POST'])
#def login_with_validation(request):
#    if request.method == 'POST':
#        # Extract email and password from the request data
#        email = request.data.get('email')
#        password = request.data.get('password')

#        # Check if email and password are provided
#        if not email or not password:
#            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

#        try:
#            # Retrieve the user from the database
#            user = users.objects.get(email=email)
#        except users.DoesNotExist:
#            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

#        # Check if the provided password matches the hashed password in the database
#        if check_password(password, user.password):
#            # Passwords match, login successful
#            return Response({'message': 'Login successful', 'user_id': user.pk, 'email': user.email})
#        else:
#            # Passwords don't match, login failed
#            return Response({'error': 'Invalid deatils'}, status=status.HTTP_401_UNAUTHORIZED)

#    else:
#        # Handle other HTTP methods
#        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

