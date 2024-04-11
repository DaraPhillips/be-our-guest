"""
Definition of urls for BeOurGuest.
"""

from datetime import datetime
from django.urls import path, include
from django.contrib import admin

from django.urls import path

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import EventViewSet
from app.views import UsersViewSet



router = DefaultRouter()
router.register(r'users', UsersViewSet, basename='users')
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [

    path('admin/', admin.site.urls),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += router.urls