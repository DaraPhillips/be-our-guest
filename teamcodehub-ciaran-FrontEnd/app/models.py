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
    phone = models.IntegerField(null=True)
    address = models.CharField(max_length=255)
    chat = models.IntegerField(null=True)

    class Meta:
        db_table = 'users'
