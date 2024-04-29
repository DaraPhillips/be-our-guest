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


class ChatMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMember
        fields = "__all__"


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = "__all__"


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = "__all__"


class CountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
        
class EventInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInvitation
        fields = "__all__"


class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event  
        fields = (
            'weddingTitle',
            'date',
            'respond_by_date',
            'venue_1_time',
            'venue_2_time',
            'venue_3_time',
            'host_user_id',
            'venue_1_id',
            'venue_2_id',
            'venue_3_id',  
            'wedding_type_id',  
        )
 
        extra_kwargs = {
            'venue_2_id': {'required': False},
            'venue_3_id': {'required': False},
        }

class GuestRsvpSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventInvitation
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
        

class MyCountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = ['name']

class MyVenueSerializer(serializers.ModelSerializer):
    county = MyCountySerializer()  # Serialize County details for the venue

    class Meta:
        model = Venue
        fields = ['county', 'name', 'address1', 'address2', 'address3', 'zipcode']

class MyEventInvitationSerializer(serializers.ModelSerializer):
    event_wedding_title = serializers.CharField(source='event.weddingTitle')  # Access weddingTitle from related Event
    event_date = serializers.DateField(source='event.date')  # Access date from related Event
    event_respond_by_date = serializers.DateField(source='event.respond_by_date')  # Access respond_by_date from related Event
    venue = MyVenueSerializer(source='event.venue_1')  # Serialize Venue details from related Event

    class Meta:
        model = EventInvitation
        fields = ['id', 'event_wedding_title', 'event_date', 'event_respond_by_date', 'venue', 'is_attending']
