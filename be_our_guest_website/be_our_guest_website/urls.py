"""
URL configuration for be_our_guest_website project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from rest_framework.routers import DefaultRouter
from django.contrib import admin
from django.urls import include, path
from be_our_guest.viewsets import EventViewSet, UsersViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from be_our_guest.views import create_event, events, login, get_venues, update_event, get_event_type, update_event, delete_event, get_county,get_venues_by_county_and_event_type, get_event_date, get_event_title, get_invitations
from be_our_guest import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.views import LogoutView

api_router = DefaultRouter()
api_router.register(r"users", UsersViewSet, basename="users")
api_router.register(r"events", EventViewSet, basename="event")




schema_view = get_schema_view(
    openapi.Info(
        title="SQLtoJSON",
        default_version='v1',
        description="Interacts with sql database and react frontend",
        terms_of_service="https://www.example.com/policies/terms/",
        contact=openapi.Contact(email="K00271287@student.tus.ie"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
       permission_classes=(permissions.AllowAny,),

)

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('events/<int:host_user_id>/', events, name='events'),
    path('create_event/', create_event, name='create_event'),
    path('update_event/<int:event_id>/', update_event, name='update_event'),
    path ('get_event_date/<int:user_id>/', get_event_date, name='get_event_date'),
    path ('get_event_title/<int:user_id>/', get_event_title, name='get_event_title'),


    path('venues/<int:id>/', views.get_venues_by_county, name='get_venues_by_country'),
    path('get_invitations/', views.get_invitations, name='get_invitations'),

    path('users/', views.get_users, name='users'),
    path('register/', views.register_user, name='register'),
    path('login_with_validation/', login, name='login_with_validation'),
    path('venues/', get_venues, name='venues'),
    path('send-password-email/', views.send_password_email, name='send_password_email'),  # Name for reverse URL lookup
    
    path('event_type/', get_event_type, name='event_type'),
    path('county/', get_county, name='county'),


    path('api/token/logout/', LogoutView.as_view(), name='token_logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #path('', views.home, name='home'),

   
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),    path("", include("be_our_guest.urls")),
    path("admin/", admin.site.urls),
    path('api/', include(api_router.urls)),
]
