"""
Serializers for the models in the be_our_guest app.
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    County,
    Event,
    EventInvitation,
    EventTable,
    User,
    Venue,
    VenueType,
    WeddingType,
    Chat,
    ChatMessage,
    ChatMember,
)


class CountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"


class GuestRsvpSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInvitation
        fields = "__all__"


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTable
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""

    class Meta:
        """Meta class for the UserSerializer."""

        model = User
        fields = "__all__"


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = "__all__"


class VenueTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueType
        fields = "__all__"


class WeddingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeddingType
        fields = "__all__"


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = "__all__"


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = "__all__"


class ChatMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMember
        fields = "__all__"


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Token serializer for the User model."""

    @classmethod
    def get_token(cls, user):
        """_summary_

        Args:
            user (_type_): _description_

        Returns:
            _type_: _description_
        """
        return super().get_token(user)


class EventUpdateSerializer(serializers.ModelSerializer):
    venueDetailsID = serializers.PrimaryKeyRelatedField(queryset=Venue.objects.all())
    venue = serializers.CharField(max_length=255, source="venueDetailsID.name")
    address1 = serializers.CharField(max_length=255, source="venueDetailsID.address1")
    address2 = serializers.CharField(max_length=255, source="venueDetailsID.address2")
    address3 = serializers.CharField(max_length=255, source="venueDetailsID.address3")
    zip = serializers.CharField(max_length=20, source="venueDetailsID.zipcode")

    class Meta:
        model = Event
        fields = [
            "eventType",
            "venue",
            "address1",
            "address2",
            "address3",
            "zip",
            "time",
            "date",
            "respondByDate",
        ]
