"""
Be Our Guest - Models
"""
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings


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


class User(AbstractBaseUser):
    """Model for users"""
    email = models.EmailField(unique=True)
    user_image = models.ImageField(upload_to="user_images/", blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class County(models.Model):
    """Model for counties"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)


class VenueType(models.Model):
    """Model for venue types"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)


class WeddingType(models.Model):
    """Model for wedding types"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)


class Venue(models.Model):
    """Model for venues"""
    id = models.AutoField(primary_key=True)
    county = models.ForeignKey(County, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    address3 = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=20)
    venue_type = models.ForeignKey(VenueType, on_delete=models.CASCADE)

    def __str__(self):
        return f"Venue ID: {self.id}, Name: {self.name}, County: {self.county}"


class Table(models.Model):
    """Model for tables at venues"""
    id = models.AutoField(primary_key=True)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    capacity = models.IntegerField()

    def __str__(self):
        return f"Table ID: {self.id}, Venue ID: {self.venue}, Capacity: {self.capacity}"


class Event(models.Model):
    """Model for events"""
    id = models.AutoField(primary_key=True)
    host_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    venue_1 = models.ForeignKey(Venue, related_name='venue_1', on_delete=models.CASCADE)
    venue_2 = models.ForeignKey(Venue, related_name='venue_2', on_delete=models.CASCADE , null=True)
    venue_3 = models.ForeignKey(Venue, related_name='venue_3', on_delete=models.CASCADE , null=True) 
    event_type = models.CharField(max_length=255)
    venue_time_1 = models.TimeField()
    venue_time_2 = models.TimeField(null=True)
    venue_time_3 = models.TimeField(null=True)
    date = models.DateField()
    respond_by_date = models.DateField()
    wedding_type = models.ForeignKey(WeddingType, on_delete=models.CASCADE)
    venue_details_id = models.ForeignKey(Venue, related_name='venue_details_id', on_delete=models.CASCADE)


class GuestRsvp(models.Model):
    """Model for guest RSVPs to events"""
    id = models.AutoField(primary_key=True)
    guest = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_attending = models.BooleanField(default=False)
    is_emailed = models.BooleanField(default=False)
    table = models.ForeignKey(Table, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"Guest: {self.guest}, Event: {self.event}, Is Attending: {self.is_attending}, Table: {self.table}"


class Chat(models.Model):
    """Model for chats"""
    id = models.AutoField(primary_key=True)
    created_by = models.IntegerField()

    def __str__(self):
        return f"Chat ID: {self.id}"


class ChatMessage(models.Model):
    """Model for chat messages"""
    id = models.AutoField(primary_key=True)
    chat_id = models.IntegerField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField()
    reply = models.IntegerField()

    def __str__(self):
        return f"Chat Message ID: {self.id}, Chat ID: {self.chat_id}, Created By: {self.created_by}"
    

class Member(models.Model):
    """Model for chat members"""
    chat_id = models.IntegerField()
    user_id = models.IntegerField()
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return f"Chat Member: Chat ID: {self.chat_id}, User ID: {self.user_id}, Is Admin: {self.is_admin}"
