from rest_framework import serializers
from .models import Guest

class GuestSerializer(serializers.ModelSerializer):
    eventId = serializers.IntegerField()
    tableId = serializers.IntegerField()

    class Meta:
        model = Guest
        fields = ['guestId', 'eventId', 'description', 'tableId']

from .models import Users

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['userId', 'email', 'password', 'firstName', 'lastName', 'phone', 'address', 'chat']
