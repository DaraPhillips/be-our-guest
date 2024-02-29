"""
Definition of models.
"""
from django.db import models

class Guest(models.Model):
    guestId = models.AutoField(primary_key=True)
    eventId = models.IntegerField(null=True)
    description = models.CharField(max_length=255)
    tableId = models.IntegerField(null=True)

    def __str__(self):
        return f"Guest: {self.guestId}, Event: {self.eventId}, Description: {self.description}, Table: {self.tableId}"

    class Meta:
        db_table = 'guest'

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class users(AbstractBaseUser):
    userId = models.AutoField(primary_key=True, db_column='userId')
    email = models.EmailField(unique=True)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    userImage = models.ImageField(upload_to='user_images/', blank=True, null=True)
    loginEnabled = models.IntegerField(choices=[(0, 'Disabled'), (1, 'Enabled')], default=1)
    last_login = models.DateTimeField(null=True, blank=True)

    # Define the custom UserManager
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
   
    class Meta:
        db_table = 'users'

class Event(models.Model):
    idevent = models.AutoField(primary_key=True)
    hostID = models.IntegerField(null=True)
    eventType = models.CharField(max_length=255)
    venueDetailsID = models.IntegerField(null=True)
    time = models.TimeField()
    date = models.DateField()

    def __str__(self):
        return f"Event ID: {self.idevent}, Host ID: {self.hostID}, Event Type: {self.eventType}, Venue Details ID: {self.venueDetailsID}, Time: {self.time}, Date: {self.date}"

    class Meta:
        db_table = 'event'

class Countries(models.Model):
    # Assuming this model defines the countries table
    countriesId = models.AutoField(primary_key=True)

    def __str__(self):
        return self.countryName
    class Meta:
        db_table = 'countries'
       
class VenueDetails(models.Model):
    venueDetailsID = models.AutoField(primary_key=True)
    countriesID = models.ForeignKey(Countries, on_delete=models.CASCADE, db_column='countriesID')  # Specify the column name explicitly
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=20)

    def __str__(self):
        return f"Venue ID: {self.venueDetailsID}, Name: {self.name}, Country: {self.countriesID}"

    class Meta:
        db_table = 'VenueDetails'