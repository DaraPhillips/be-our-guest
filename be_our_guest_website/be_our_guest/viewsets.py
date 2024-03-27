"""
View-sets for the Be Our Guest API.
"""

from rest_framework import viewsets
from rest_framework.response import Response
from .models import Event, User
from .serializers import EventSerializer, UserSerializer


class UsersViewSet(viewsets.ViewSet):
    """
    API endpoint for interacting with users.
    """

    def list(self, _):
        """
        Return a list of all users.
        """
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)


class EventViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for interacting with your API.
    """

    def list(self, _):
        """Return a list of all events.

        Args:
            _ (request): _description_

        Returns:
            _type_: _description_
        """
        queryset = Event.objects.all()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)
