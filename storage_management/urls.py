"""storage_management URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

admin.site.enable_nav_sidebar = False

api_patterns = [
    # path('register/', registration_view, name="register"),
    # path('confirmation-code-is-valid/', confirmation_code_is_valid, name="confirmation-code-is-valid"),
    #
    # path('login/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    # path('refresh-token/', TokenRefreshView.as_view(), name='token-refresh'),

    path('data-parsing/', include('data_parsing.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
