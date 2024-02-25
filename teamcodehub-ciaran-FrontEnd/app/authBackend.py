from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.http import JsonResponse

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            print('User does not exist:', email)
            return None

        # Check if the passwords match (plaintext comparison)
        if user.password == password:
            print('Password is correct for:', email)
            return user
        else:
            print('Password is incorrect for:', email)
            return None

