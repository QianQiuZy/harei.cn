"""URL configuration for harei.cn."""
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path, re_path

from apps.core import views
from apps.core.admin import admin_site

urlpatterns = [
    path("admin/", admin_site.urls),
    path("api/", include("apps.core.urls")),
    re_path(r"^(?!api/|admin/).*$", views.frontend_index),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
