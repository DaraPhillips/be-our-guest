"""
The views for the be_our_guest app.
"""
import json
import random
import string
from typing import Optional
from django.http import HttpResponse

from datetime import datetime, date
import re
import logging
import jwt
import requests

from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.decorators import (
    action,
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_jwt.settings import api_settings


from .serializers import ChatSerializer, ChatMessageSerializer, ChatMemberSerializer, CountySerializer, EventSerializer, EventUpdateSerializer,GuestRsvpSerializer,MyTokenObtainPairSerializer,TableSerializer,UserSerializer,VenueSerializer,VenueTypeSerializer,WeddingTypeSerializer
from .models import Chat, ChatMember, ChatMessage, County, Event, EventInvitation,EventTable,User,UserManager,Venue,VenueType,WeddingType

from jwt import decode, ExpiredSignatureError, InvalidTokenError
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail

from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate




def index(_) -> HttpResponse:
    """The index view of the website.

    Args:
        _ (request): The request object.

    Returns:
        HttpResponse: The response object.
    """
    return HttpResponse("Hello, world. You're at the Be our guest index.")



@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def create_event(request):
    logger = logging.getLogger(__name__)
    logger.info("Received request to create event")
    if request.method == "POST":
        logger.debug("Extracting data from request...")
        # Extract data from request
        event_data = request.data.get("event")
        # Check if 'time' and 'date' fields are present
        if "time" not in event_data or "date" not in event_data:
            logger.error("Time and date fields are required")
            return Response(
                {"error": "Time and date fields are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Validate time and date formats
        time_format = "%H:%M:%S"
        date_format = "%Y-%m-%d"
        time_str = event_data["time"]
        # Add seconds if not provided
        if len(time_str.split(":")) == 2:
            time_str += ":00"
        date_str = event_data["date"]
        if not time_str.strip() or not date_str.strip():
            logger.error("Time and date fields cannot be empty")
            return Response(
                {"error": "Time and date fields cannot be empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            datetime.strptime(time_str, time_format)
            event_data["time"] = datetime.strptime(time_str, time_format).time()
            event_date = datetime.strptime(date_str, date_format).date()
        except ValueError as e:
            logger.error(f"Invalid time or date format: {e}")
            return Response(
                {"error": "Invalid time or date format"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Ensure date is not today or in the past
        if event_date <= date.today():
            logger.error("Event date must be in the future")
            return Response(
                {"error": "Event date must be in the future"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Check if respondByDate comes after the date
        respond_by_date_str = event_data.get("respondByDate")
        if respond_by_date_str:
            try:
                respond_by_date = datetime.strptime(
                    respond_by_date_str, date_format
                ).date()
                if respond_by_date > event_date:
                    logger.error("Respond by date cannot come after the event date")
                    return Response(
                        {"error": "Respond by date cannot come after the event date"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except ValueError as e:
                logger.error(f"Invalid respond by date format: {e}")
                return Response(
                    {"error": "Invalid respond by date format"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
                event_data.setdefault("respondByDate", None)  # Set default for optional field
 
        wedding_type_id = event_data.pop("weddingTypeID", None)
        venue_1_id = event_data.pop("venue_1", None)
        venue_2_id = event_data.pop("venue2ID", None)
        venue_3_id = event_data.pop("venue3ID", None)
        venue_1_time = event_data.pop("venue_1_time", None)
        venue_2_time = event_data.pop("venue2Time", None)
        venue_3_time = event_data.pop("venue3Time", None)
    # at_table_id = event_data.pop("atTableID", None)
 
        # Retrieve host ID from authenticated user (unchanged)
        host_id = request.user.id
 
        # Add all data to event_data dictionary
        event_data["weddingType"] = wedding_type_id
        event_data["venue_1"] = venue_1_id
        event_data["venue_2"] = venue_2_id
        event_data["venue_3"] = venue_3_id
        event_data["venue_1_time"] = venue_1_time
        event_data["venue_2_time"] = venue_2_time
        event_data["venue_3_time"] = venue_3_time
    # event_data["at_table"] = at_table_id
        event_data["host_user"] = host_id
       
        logger.debug("Creating event instance...")
        # Create event instance
        event_serializer = EventSerializer(data=event_data)
        if event_serializer.is_valid():
            # Save event instance
            event_instance = event_serializer.save()
            logger.info("Event created successfully")
            return Response(
                {
                    "message": "Event created successfully",
                    "event_id": event_instance.pk,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            logger.error(f"Error creating event: {event_serializer.errors}")
            return Response(
                {"error": "Error creating event", "errors": event_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        logger.warning("Method not allowed")
        return Response(
            {"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
        
@api_view(["PUT", "PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_event(request, user_id):
    user = request.user  # Assuming user is retrieved from request

    try:
    # Access events through the related manager 'events'
        event = user.events.get(host_user_id=user.id)  # Filter by user's ID via 'host_user_id' field
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check user permission before proceeding
    # if event.host_user != request.user.id:
    #     return Response(
    #         {"error": "You are not allowed to edit this event"},
    #         status=status.HTTP_403_FORBIDDEN,
    #     )

    # Extract data from request (considering multiple fields)
    serializer = EventUpdateSerializer(event, data=request.data, partial=True)
    if serializer.is_valid():
        # Access and update specific fields as needed
        if "date" in request.data:
            event.date = request.data["date"]
        if "time" in request.data:
            event.time = request.data["time"]

        # Update venue if provided
        venue_name = request.data.get("venue")
        if venue_name:
            try:
                venue_details = Venue.objects.get(name=venue_name)
                event.venue = venue_details
            except Venue.DoesNotExist:
                return Response(
                    {"error": "Venue details not found"}, status=status.HTTP_400_BAD_REQUEST
                )

        # Save updated event instance
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_event(request, user_id):

    user = request.user  # Assuming user is retrieved from request

    try:
        # Access events through the related manager 'events'
        event = user.events.get(host_user_id=user.id)  # Filter by user's ID via 'host_user_id' field
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    # Optional: Permission check (e.g., only event owner can delete)
    # if event.host_user_id != request.user.id:
    #     return Response({"error": "You are not allowed to delete this event"}, status=status.HTTP_403_FORBIDDEN)

    event.delete()
    return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

def dashboard(request):
    # Retrieve the event from the database (assuming you have a model named Event)
    event = (
        Event.objects.first()
    )  # You may need to modify this query to get the correct event

    if event:
        # Calculate the time remaining until the event
        current_time = datetime.now()
        time_remaining = event.date - current_time

        # Pass the time remaining to the dashboard template
        return render(request, "app/dashboard.html", {"time_remaining": time_remaining})
    else:
        # Handle case where there are no events
        return render(request, "app/dashboard.html", {"time_remaining": None})

@api_view(['GET'])
@permission_classes([AllowAny])  # Override parent permissions
def get_users(request):
    token = request.GET.get('token')
    if token:
        try:
            # Decode the token to get the user_id
            decoded_token = jwt.decode(token, 'f1bd2a4b-eaff-48c7-a492-b32c0ed11766', algorithms=['HS256'])
            user_id = decoded_token['id']
            # Retrieve the user based on the user_id
            user = get_object_or_404(User, pk=user_id)
            # Serialize and return the user data
            return Response({'id': user.id, 'first_name': user.first_name, 'email': user.email})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # If no token is provided, return all users
        users = User.objects.all()
        data = [{'id': user.id, 'first_name': user.first_name, 'email': user.email} for user in users]
        return Response(data)
 
@api_view(["GET"])
@permission_classes([AllowAny])
def get_venues(request):
    venues = Venue.objects.all()
    serializer = VenueSerializer(venues, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
@permission_classes([AllowAny]) 
def get_event_type(request):
    event_types = WeddingType.objects.all()
    serializer = WeddingTypeSerializer(event_types, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
@permission_classes([AllowAny]) 
def get_county(request):
    counties = County.objects.all()
    serializer = CountySerializer(counties, many=True)
    return JsonResponse(serializer.data, safe=False)


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

    # Calculate the remaining length for all character categories
    remaining_length = length - len(guaranteed_characters)

    # Generate the remaining characters with a preference for lowercase letters
    character_categories = lowercase_letters + uppercase_letters + digits + special_characters
    weights = [1] * len(lowercase_letters) + [1] * len(uppercase_letters) + [1] * len(digits) + [2] * len(special_characters)
    password_characters = guaranteed_characters + random.choices(character_categories, k=remaining_length, weights=weights)

    # Shuffle the characters to ensure randomness
    random.shuffle(password_characters)

    # Concatenate the characters to form the password
    password = ''.join(password_characters)
    return password

@api_view(["POST"])
@permission_classes([AllowAny])  # Allow any user to register
def register_user(request):
    if request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Retrieve the password from the serializer data
            password = serializer.validated_data["password"]
            # Validate the password
            is_valid_password, password_error = validate_password(password)
            if not is_valid_password:
                return Response(
                    {"error": password_error}, status=status.HTTP_400_BAD_REQUEST
                )
            # Hash the password using make_password
            hashed_password = make_password(password)
            # Update the serializer data with the hashed password
            serializer.validated_data["password"] = hashed_password
            # Save the user with the hashed password
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny]) 
def get_invitations(request):
  event_id = request.query_params.get('event_id')  # Get event_id from query parameters

  if request.method == 'GET':
    invitations = EventInvitation.objects.filter(event__pk=event_id) \
      .select_related('guest', 'event')  

    invitation_data = []
    for invitation in invitations:
      guest_data = {
        'id': invitation.guest.id,
        'email': invitation.guest.email,
        'first_name': invitation.guest.first_name,
        'last_name': invitation.guest.last_name,
      }
      event_data = {
        'id': invitation.event.id,
      }
      invitation_data.append({
        'guest': guest_data,
        'event': event_data,
        'is_attending': invitation.is_attending,
        'is_emailed': invitation.is_emailed,
      })

    if not invitations:
      return Response({'message': 'No invitations found for the specified event ID.'}, status=404)

    return Response(invitation_data, status=200)


@api_view(['GET'])
@permission_classes([AllowAny]) 
def events(request, host_user_id):
    events = Event.objects.filter(host_user=host_user_id)  # Filter by user ID in URL path
    serializer = EventSerializer(events, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def send_password_email(request):
  eventData = request.data.get("eventData")
  if isinstance(eventData, list):
    # Access the first dictionary in the list (if applicable)
    eventData = eventData[0]

  if request.method == 'POST':
    recipient_emails = request.data.get('recipients', [])  # Expect a list of dictionaries

    # Validate data structure
    if not isinstance(recipient_emails, list):
      return Response({'error': 'Invalid request format: "recipients" list expected'}, status=400)

    successful_emails = []  # Track successfully sent emails for the response

    for recipient in recipient_emails:
      email = recipient.get('email')
      first_name = recipient.get('first_name')
      last_name = recipient.get('last_name')

      if not email or not first_name or not last_name:
        return Response({
          'error': 'Missing required fields: email, first_name, last_name, {email}, {first_name}, {last_name}'
        }, status=400)

      # Generate and validate password (existing logic)
      password = generate_password()
      is_valid_password, password_error = validate_password(password)
      if not is_valid_password:
        return Response({'error': f'Generated password failed validation: {password_error}'}, status=400)

      hashed_password = make_password(password)

      # Prepare user data with the generated password
      user_data = {
        'email': email,
        'password': hashed_password,
        'first_name': first_name,
        'last_name': last_name,
      }

      user, created = User.objects.get_or_create(email=email, defaults=user_data)
      user_id = user.id
      # **Create Event Invitation for each recipient:**
      event_id = eventData["id"]
      if event_id:
        try:
          event = Event.objects.get(pk=event_id)
          invitation = EventInvitation.objects.get_or_create(guest=user, event=event, is_emailed=True)
        except (User.DoesNotExist, Event.DoesNotExist) as e:
          print(f"Error creating invitation for {email}: {e}")
          # Consider returning a specific error response here

      # Construct email content with event details
      try:
        if request.data.get('eventData') is None:
          raise ValueError("Missing event data in request", request.data.get('eventData'))
        email_body = f'Hello {first_name} {last_name},\n\n'
        email_body = f'This password grants you access to a wedding on the {eventData["date"]}.\n\nThe respond by date for this wedding is: {eventData["respond_by_date"]}. For further details on venue times please see the website(http://localhost:5173/login) using the password below\n\n'
        if User.DoesNotExist:
            email_body += f'Your password is: "{password}"\n\n'
            
        send_mail(
          'Your New Password',
          email_body,
          'sender@example.com',
          [email],
          fail_silently=False,
        )
        successful_emails.append(email)
      except Exception as e:
        return Response({'error': f'Failed to send email to {email}: {e}'}, status=500)

    # Return a success message with details on sent emails
    message = f'Password email(s) sent successfully to: {", ".join(successful_emails)}'
    return Response({'message': message}, status=200)

@api_view(['GET'])
@permission_classes([AllowAny])  # Adjust permissions if needed for authentication
def get_user_events(request, user_id):
    """
    Retrieves events a user has been invited to.

    Args:
        request: The incoming request object.
        user_id: The ID of the user to get events for.

    Returns:
        A JSON response with a list of events and their details.
    """

    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    # Get invitations for the user
    invitations = EventInvitation.objects.filter(guest=user)

    # Prepare a list to store event details
    event_data = []

    for invitation in invitations:
        event = invitation.event

        # Include relevant event details 
        event_data.append({
            'id': event.id,
            'date': event.date.strftime('%Y-%m-%d'),  # Format date for JSON
            'respond_by_date': event.respond_by_date.strftime('%Y-%m-%d'),
            'venue_1_time': event.venue_1_time.strftime('%H:%M:%S'),  # Format time for JSON
            'venue_2_time': event.venue_2_time.strftime('%H:%M:%S') if event.venue_2_time else None,
            'venue_3_time': event.venue_3_time.strftime('%H:%M:%S') if event.venue_3_time else None,
            'is_attending': invitation.is_attending,  
        })

    return Response({'events': event_data})

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

@api_view(["GET"])
@permission_classes([AllowAny])
def get_event_date(request, user_id):
    dates = Event.objects.filter(host_user_id=user_id)
    serializer = EventSerializer(dates, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
@permission_classes([AllowAny])  # Override parent permissions
def get_venues_by_county(request, id ):
    venues = Venue.objects.filter(county_id=id)
    serializer = VenueSerializer(venues, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(["GET"])
def get_venues_by_county_and_event_type(request, county_id, venue_type_id):
    venues = Venue.objects.filter(county_id=county_id, venue_type_id=venue_type_id)
    serializer = VenueSerializer(venues, many=True)
    return JsonResponse(serializer.data, safe=False)

@authentication_classes([JWTAuthentication])
@api_view(["POST"])
@permission_classes([AllowAny])  # Override parent permissions
def login(request):
    if request.method == "POST":
        # Extract email and password from the request data
        checkemail = request.data.get("email")
        password = request.data.get("password")

        # Check if email and password are provided
        if not checkemail or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Retrieve the user from the database or return a 404 if not found
            user = User.objects.get(email=checkemail)
            logging.info(f"User id {user.id}")
            logging.info(f"User first name {user.first_name}")
        except User.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check if the provided password matches the hashed password in the database
        if check_password(password, user.password):
            # Passwords match, generate JWT token
            serializer = MyTokenObtainPairSerializer()
            token = serializer.get_token(user)
            # Return success response with JWT token
            return Response(
                {
                    "message": "View Login successful",
                    "Id": user.id,
                    "email": user.email,
                    "token": str(token.access_token),  # Include JWT token in response
                }
            )
        else:
            # Passwords don't match, login failed
            return Response(
                {"error": "Invalid details"}, status=status.HTTP_401_UNAUTHORIZED
            )

    else:
        # Handle other HTTP methods
        return Response(
            {"error": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )