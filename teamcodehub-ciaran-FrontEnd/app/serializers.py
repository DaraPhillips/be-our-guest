from rest_framework import serializers
from .models import Guest

class GuestSerializer(serializers.ModelSerializer):
    eventId = serializers.IntegerField()
    tableId = serializers.IntegerField()

    class Meta:
        model = Guest
        fields = ['guestId', 'eventId', 'description', 'tableId']
