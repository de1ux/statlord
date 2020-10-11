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
from django.conf.urls import url
from django.urls import path, re_path

from statlord import views

urlpatterns = [
    path('api/gauges/', views.GaugeList.as_view()),
    path('api/gauges/<str:key>/', views.GaugeItem.as_view()),
    path('api/displays/', views.DisplayList.as_view()),
    path('api/displays/<str:key>/', views.DisplayItem.as_view()),
    path('api/layouts/', views.LayoutList.as_view()),
    path('api/layouts/<str:key>/', views.LayoutItem.as_view()),

    url(r'^view.*', views.StaticAssets.as_view()),
    url(r'^edit.*', views.StaticAssets.as_view()),
    path('', views.StaticAssets.as_view()),
    url(r'^(?P<path>.*)', views.StaticAssets.as_view()),
]
