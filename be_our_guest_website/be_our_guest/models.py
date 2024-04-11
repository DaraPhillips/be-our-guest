"""
Be Our Guest - Models
"""

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.conf import settings


class Chat(models.Model):
    """Model for chats"""

    id = models.AutoField(primary_key=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Chat ID: {self.id}"


class ChatMember(models.Model):
    """Model for Chat Members"""

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    is_muted = models.BooleanField(default=False)


class ChatMessage(models.Model):
    """Model for chat messages"""

    id = models.AutoField(primary_key=True)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reply_to_message = models.ForeignKey("ChatMessage", on_delete=models.CASCADE)

    def __str__(self):
        return f"Chat Message ID: {self.id}, Chat ID: {self.chat}, Created By: {self.created_by}"


class County(models.Model):
    """Model for counties"""

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)


class Event(models.Model):
    """Model for events"""

    id = models.AutoField(primary_key=True)
    date = models.DateField()
    host_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="events")  # Related manager name
    respond_by_date = models.DateField()
    venue_1 = models.ForeignKey(
        "Venue", related_name="venue_1", on_delete=models.CASCADE
    )
    venue_1_time = models.TimeField()
    venue_2 = models.ForeignKey(
        "Venue", related_name="venue_2", on_delete=models.CASCADE, null=True
    )
    venue_2_time = models.TimeField(null=True)
    venue_3 = models.ForeignKey(
        "Venue", related_name="venue_3", on_delete=models.CASCADE, null=True
    )
    venue_3_time = models.TimeField(null=True)
    wedding_type = models.ForeignKey("WeddingType", on_delete=models.CASCADE)


class EventInvitation(models.Model):
    """Model for guest RSVPs to events"""

    id = models.AutoField(primary_key=True)
    guest = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_attending = models.BooleanField(default=False)
    is_emailed = models.BooleanField(default=False)
    at_table = models.ForeignKey("EventTable", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"Guest: {self.guest}, Event: {self.event}, Is Attending: {self.is_attending}, Table: {self.at_table}"


class EventTable(models.Model):
    """Model for tables at venues"""

    id = models.AutoField(primary_key=True)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    capacity = models.IntegerField()
    number = models.IntegerField()


class UserManager(BaseUserManager):
    """Manager for users"""

    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user with an email and password
        Args:
            email (_type_): _description_
            password (_type_, optional): _description_. Defaults to None.

        Raises:
            ValueError: If the email field is not set

        Returns:
            User: The created user
        """
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """_summary_

        Args:
            email (_type_): _description_
            password (_type_, optional): _description_. Defaults to None.

        Raises:
            ValueError: _description_
            ValueError: _description_

        Returns:
            _type_: _description_
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Model for users"""

    email = models.EmailField("email address", unique=True)
    username = None  # Remove username field
    user_image = models.ImageField(upload_to="user_images/", blank=True, null=True)


    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []  # Remove email from required fields

    objects = UserManager()


class Venue(models.Model):
    """Model for venues"""

    id = models.AutoField(primary_key=True)
    county = models.ForeignKey(County, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    address3 = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=20)
    venue_type = models.ForeignKey("VenueType", on_delete=models.CASCADE)

    def __str__(self):
        return f"Venue ID: {self.id}, Name: {self.name}, County: {self.county}"


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
