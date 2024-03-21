"""
Be Our Guest - Models
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser


class County(models.Model):
    # Assuming this model defines the countries table
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return str(self.name)


class Event(models.Model):
    """Model for the events"""

    id = models.AutoField(primary_key=True)
    host_user = models.IntegerField(null=True)
    event_type = models.CharField(max_length=255)
    venue = models.ForeignKey(
        "Venue",
        on_delete=models.CASCADE,
        null=True,
        db_column="venueDetailsID",
        related_name="events",
    )
    time = models.TimeField()
    date = models.DateField()
    respondByDate = models.DateField()

    def __str__(self):
        return f"Event ID: {self.id}, Host ID: {self.host_user}, Event Type: {self.event_type}, Venue ID: {self.venue}, Time: {self.time}, Date: {self.date}"


class GuestRsvp(models.Model):
    """Model for the guest RSVPs to events"""

    id = models.AutoField(primary_key=True)
    guest = models.ForeignKey("User", on_delete=models.CASCADE)
    """The User that is a guest at the event"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_attending = models.BooleanField(default=False)
    is_email_sent = models.BooleanField(default=False)
    description = models.CharField(max_length=255)
    table = models.IntegerField(null=True)

    def __str__(self):
        return f"Guest: {self.guest}, Event: {self.event}, Description: {self.description}, Table: {self.table}"


class User(AbstractBaseUser):
    """Model for the users"""

    userImage = models.ImageField(upload_to="user_images/", blank=True, null=True)

    def __str__(self):
        return str(self.get_username())


class Venue(models.Model):
    id = models.AutoField(primary_key=True)
    county = models.ForeignKey(County, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    address3 = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=20)

    def __str__(self):
        return f"Venue ID: {self.id}, Name: {self.name}, County: {self.county}"
