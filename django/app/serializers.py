from rest_framework import serializers
from .models import County, Event, GuestRsvp, Table, User, Venue, VenueType, WeddingType, Chat, ChatMessage, Member
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class GuestRsvpSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestRsvp
        fields = '__all__'


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'


class VenueTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueType
        fields = '__all__'


class WeddingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeddingType
        fields = '__all__'


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims here if needed
        return token


class EventUpdateSerializer(serializers.ModelSerializer):
    venueDetailsID = serializers.PrimaryKeyRelatedField(queryset=Venue.objects.all())
    venue = serializers.CharField(max_length=255, source='venueDetailsID.name')
    address1 = serializers.CharField(max_length=255, source='venueDetailsID.address1')
    address2 = serializers.CharField(max_length=255, source='venueDetailsID.address2')
    address3 = serializers.CharField(max_length=255, source='venueDetailsID.address3')
    zip = serializers.CharField(max_length=20, source='venueDetailsID.zipcode')

    class Meta:
        model = Event
        fields = ['eventType', 'venue', 'address1', 'address2', 'address3', 'zip', 'time', 'date', 'respondByDate']
