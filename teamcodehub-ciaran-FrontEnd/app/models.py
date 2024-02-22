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

class Users(models.Model):
    userId = models.AutoField(primary_key=True)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    userImage = models.ImageField(upload_to='user_images/', blank=True, null=True)
    loginEnabled = models.IntegerField(choices=[(0, 'Disabled'), (1, 'Enabled')], default=1)

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

