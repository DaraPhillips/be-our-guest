from rest_framework import serializers
from .models import Countries, Event, Guest, VenueDetails, users

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['userId', 'email', 'password', 'firstName', 'lastName', 'userImage', 'loginEnabled', 'last_login']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['idevent', 'eventType', 'venueDetailsID', 'time', 'date', 'respondByDate']  # hostID removed as it's set automatically

    def create(self, validated_data):
        # Assuming hostID is set automatically in the backend
        return Event.objects.create(**validated_data)

class VenueDetailsSerializer(serializers.ModelSerializer):
    countriesID = serializers.PrimaryKeyRelatedField(queryset=Countries.objects.all())

    class Meta:
        model = VenueDetails
        fields = ['countriesID', 'name', 'address', 'zipcode']
        
class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Countries
        fields = ['countriesId', 'countryName']
