"""
Definition of urls for BeOurGuest.
"""

from datetime import datetime
from django.urls import path
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from app import forms, views
from django.urls import path
from app.views import hello_world
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from app.views import GuestViewSet



schema_view = get_schema_view(
    openapi.Info(
        title="SQLtoJSON",
        default_version='v1',
        description="Converts sql data to json data",
        terms_of_service="https://www.example.com/policies/terms/",
        contact=openapi.Contact(email="K00271287@student.tus.ie"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
       permission_classes=(permissions.AllowAny,),

)

router = DefaultRouter()
router.register(r'guests', GuestViewSet, basename='guest')

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
   

    path('hello-world/', hello_world, name='hello-world'),
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('login/',
         LoginView.as_view
         (
             template_name='app/login.html',
             authentication_form=forms.BootstrapAuthenticationForm,
             extra_context=
             {
                 'title': 'Log in',
                 'year' : datetime.now().year,
             }
         ),
         name='login'),
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
    path('admin/', admin.site.urls),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += router.urls
