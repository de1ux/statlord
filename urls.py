"""statlord URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from django.urls import include, path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from core import views


urlpatterns = [
    path('api/gauges/', views.GaugeList.as_view()),
    path('api/gauges/<str:key>/', views.GaugeItem.as_view()),
    path('api/displays/', views.DisplayList.as_view()),
    path('api/displays/<str:key>/', views.DisplayItem.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)