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


@api_view(['POST'])
def create_event(request):
    if request.method == 'POST':
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Event created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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