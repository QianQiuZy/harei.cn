from django.urls import path

from . import views

urlpatterns = [
    path("box", views.submit_box, name="submit_box"),
    path("messages", views.list_messages, name="list_messages"),
    path("tags", views.list_tags, name="list_tags"),
]
