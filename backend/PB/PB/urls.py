"""PB URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.contrib import admin
from django.urls import path, include, re_path
from Accounts import views as account_views
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.routers import DefaultRouter
from Studios import urls as Studio_urls
from Accounts import urls as Accounts_urls
from Subscriptions import urls as Subscriptions_urls
# from django.conf.urls import url
# Comments from Ray: I'm using Django > 4.0, and this import doesn't work.
#       Fix by import from another place below.
from django.urls import re_path as url
from django.views.i18n import JavaScriptCatalog
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view
from django.conf import settings
from django.conf.urls.static import static

js_info_dict = {
    'packages': ('recurrence', ),
}

# Reference of API auto creation: https://thepylot.dev/swagger-with-django-rest-framework/

schema_view = swagger_get_schema_view(
    openapi.Info(
        title="Posts API",
        default_version='1.0.0',
        description="API documentation of App",
    ),
    public=True,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include(Accounts_urls)),
    # path(
    #     "api/auth/", include("rest_framework.urls", namespace="rest_framework")
    # ),  # ADDITION: include the rest framework urls (e.g.: for session auth in browsable api)
    path('studios/', include(Studio_urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('subscriptions/', include(Subscriptions_urls)),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name="schema-swagger-ui"),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)