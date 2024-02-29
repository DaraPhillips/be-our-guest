from rest_framework import serializers
from .models import Event, Guest, VenueDetails, users,Countries

class GuestSerializer(serializers.ModelSerializer):
    eventId = serializers.IntegerField()
    tableId = serializers.IntegerField()

    class Meta:
        model = Guest
        fields = ['guestId', 'eventId', 'description', 'tableId']

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['userId', 'email', 'password', 'firstName', 'lastName', 'userImage', 'loginEnabled']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['idevent', 'hostID', 'eventType', 'venueDetailsID', 'time', 'date']

#class VenueDetailsSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = VenueDetails
#        fields = ['venueDetailsID', 'country', 'name', 'address_line1', 'zipcode']

class VenueDetailsSerializer(serializers.ModelSerializer):
    countriesID = serializers.PrimaryKeyRelatedField(queryset=Countries.objects.all())

    class Meta:
        model = VenueDetails
        fields = ['countriesID', 'name', 'address', 'zipcode']

class VenueDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueDetails
        fields = ['venueDetailsID', 'country', 'name', 'address_line1', 'address_line2', 'address_line3', 'zipcode']