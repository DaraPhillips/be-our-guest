from rest_framework import serializers
from .models import Countries, Event, Guest, VenueDetails, Users
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['userId', 'email', 'password', 'firstName', 'lastName', 'userImage', 'loginEnabled', 'last_login']
 
class VenueDetailsSerializer(serializers.ModelSerializer):
    countriesId = serializers.PrimaryKeyRelatedField(queryset=Countries.objects.all())  # Keep consistent with model field name

    class Meta:
        model = VenueDetails
        fields = ['countriesId','venueDetailsID',  'name', 'address1', 'address2', 'address3', 'zipcode']
 
class EventSerializer(serializers.ModelSerializer):
    venue_details = VenueDetailsSerializer(source='venueDetailsID', read_only=True)  # Nested serializer for VenueDetails
    
    class Meta:
        model = Event
        fields = ['idevent', 'hostID', 'eventType', 'venueDetailsID', 'venue_details', 'time', 'date', 'respondByDate']
    def create(self, validated_data):
        # Assuming hostID is set automatically in the backend
        return Event.objects.create(**validated_data)
        
class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Countries
        fields = ['countriesId', 'countryName']
 
class EventUpdateSerializer(serializers.ModelSerializer):
    venueDetailsID = serializers.PrimaryKeyRelatedField(queryset=VenueDetails.objects.all())
    venue = serializers.CharField(max_length=255, source='venueDetailsID.name')
    address1 = serializers.CharField(max_length=255, source='venueDetailsID.address1')
    address2 = serializers.CharField(max_length=255, source='venueDetailsID.address2')
    address3 = serializers.CharField(max_length=255, source='venueDetailsID.address3')
    zip = serializers.CharField(max_length=20, source='venueDetailsID.zipcode')

    class Meta:
        model = Event
        fields = ['eventType', 'venue', 'address1', 'address2', 'address3', 'zip', 'time', 'date', 'respondByDate']
       
 
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
 
        # Add custom claims
        token['userId'] = user.userId
        # Add other custom claims as needed
 
        return token