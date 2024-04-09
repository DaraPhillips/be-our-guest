"""
Definition of urls for BeOurGuest.
"""

from datetime import datetime
from django.urls import path, include
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from app import forms, views
from django.urls import path
from app.views import UsersViewSet, create_event, events, login, get_venues
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import EventViewSet
from app.views import UsersViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView



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

router = DefaultRouter()
router.register(r'users', UsersViewSet, basename='users')
router.register(r'events', EventViewSet, basename='event')

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('events/', events, name='events'),
    path('create_event/', create_event, name='create_event'),
    path('events/<int:event_id>/', views.update_event, name='update_event'),
 
    path('users/', views.get_users, name='users'),

    path('venues/<int:country_id>/', views.get_venues_by_country, name='get_venues_by_country'),

    path('users/', views.get_users, name='users'),
    path('register/', views.register_user, name='register'),
    path('login_with_validation/', login, name='login_with_validation'),
    path('venues/', get_venues, name='venues'),

    path('api/token/logout/', LogoutView.as_view(), name='token_logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('register_user_with_validation/', register_user_with_validation, name='register_with_validation'),
    #path('login_validation/', views.login_with_validation, name='login_validation'),

    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    # path('login/',
    #      LoginView.as_view
    #      (
    #          template_name='app/login.html',
    #          authentication_form=forms.BootstrapAuthenticationForm,
    #          extra_context=
    #          {
    #              'title': 'Log in',
    #              'year' : datetime.now().year,
    #          }
    #      ),
    #      name='login'),
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
    path('admin/', admin.site.urls),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += router.urls