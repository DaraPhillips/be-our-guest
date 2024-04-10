
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Event, User
from .serializers import EventSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated  # Import the permission class

class UsersViewSet(viewsets.ViewSet):
    """
    API endpoint for interacting with users.
    """
    permission_classes = [IsAuthenticated]  # Define permission classes for the viewset

    def list(self, _):
        """
        Return a list of all users.
        """
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        """
        Return the queryset for this view.
        """
        return User.objects.all()

class EventViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for interacting with your API.
    """
    permission_classes = [IsAuthenticated]  # Define permission classes for the viewset

    def list(self, _):
        """Return a list of all events."""
        queryset = Event.objects.all()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)






