from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
 
 
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
 
 
class Users(AbstractBaseUser):
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
 
 
class Countries(models.Model):
    # Assuming this model defines the countries table
    countriesId = models.AutoField(primary_key=True)
    countryName = models.CharField(max_length=255)
 
    def __str__(self):
        return self.countryName
 
    class Meta:
        db_table = 'countries'
 
 
class VenueDetails(models.Model):
    venueDetailsID = models.AutoField(primary_key=True)
    countriesId = models.ForeignKey(Countries, on_delete=models.CASCADE, db_column='countriesID')  
    name = models.CharField(max_length=255)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    address3 = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=20)
 
    def __str__(self):
        return f"Venue ID: {self.venueDetailsID}, Name: {self.name}, Country: {self.countriesId}"
    #def __str__(self):
    #    return self.name  # Adjusted to return only the name of the venue
 
 
    class Meta:
        db_table = 'VenueDetails'
 
class Event(models.Model):
    idevent = models.AutoField(primary_key=True)
    hostID = models.IntegerField(null=True)
    eventType = models.CharField(max_length=255)
    venueDetailsID = models.ForeignKey(VenueDetails, on_delete=models.CASCADE, null=True, db_column='venueDetailsID', related_name='events')
    time = models.TimeField()
    date = models.DateField()
    respondByDate = models.DateField(default=timezone.now() + timezone.timedelta(days=30))
 
    def __str__(self):
        return f"Event ID: {self.idevent}, Host ID: {self.hostID}, Event Type: {self.eventType}, Venue Details ID: {self.venue_details}, Time: {self.time}, Date: {self.date}"
 
    class Meta:
        db_table = 'event'
 
# class Event(models.Model):
#     """Model for events"""
#     id = models.AutoField(primary_key=True)
#     host_user = models.ForeignKey("User", on_delete=models.CASCADE)
#     venue_1 = models.ForeignKey("Venue", on_delete=models.CASCADE)
#     venue_2 = models.ForeignKey("Venue", on_delete=models.CASCADE, null=True)
#     venue_3 = models.ForeignKey("Venue", on_delete=models.CASCADE, null=True)
#     event_type = models.CharField(max_length=255)
#     venue_time_1 = models.TimeField()
#     venue_time_2 = models.TimeField(null=True)
#     venue_time_3 = models.TimeField(null=True)
#     date = models.DateField()
#     respond_by_date = models.DateField()
#     wedding_type = models.ForeignKey("WeddingType", on_delete=models.CASCADE)
#     venue_details_id = models.ForeignKey("Venue", on_delete=models.CASCADE)
    
# class GuestRsvp(models.Model):
#     """Model for guest RSVPs to events"""
#     id = models.AutoField(primary_key=True)
#     guest = models.ForeignKey("User", on_delete=models.CASCADE)
#     event = models.ForeignKey("Event", on_delete=models.CASCADE)
#     is_attending = models.BooleanField(default=False)
#     is_emailed = models.BooleanField(default=False)
#     table = models.ForeignKey("Table", on_delete=models.CASCADE, null=True)
 
#     def __str__(self):
#         return f"Guest: {self.guest}, Event: {self.event}, Is Attending: {self.is_attending}, Table: {self.table}"
        
class Guest(models.Model):
    guestId = models.AutoField(primary_key=True)
    eventId = models.IntegerField(null=True)
    description = models.CharField(max_length=255)
    tableId = models.IntegerField(null=True)
 
    def __str__(self):
        return f"Guest: {self.guestId}, Event: {self.eventId}, Description: {self.description}, Table: {self.tableId}"
 
    class Meta:
        db_table = 'guest'