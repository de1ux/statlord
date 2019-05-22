from django.urls import path

from . import views

urlpatterns = [
    path('guages', views.index, name='index'),
]