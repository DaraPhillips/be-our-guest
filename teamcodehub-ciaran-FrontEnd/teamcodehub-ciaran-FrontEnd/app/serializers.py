from rest_framework import serializers
from .models import Event, Guest, users

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

