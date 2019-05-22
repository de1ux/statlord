from django.urls import path

from . import views

urlpatterns = [
    path('gauges', views.index, name='index'),
]