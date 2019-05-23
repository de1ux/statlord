from django.db import models


class Gauge(models.Model):
    key = models.CharField(max_length=200, primary_key=True)
    value = models.CharField(max_length=600)


class Layout(models.Model):
    name = models.CharField(max_length=100)


class LayoutItem(models.Model):
    parent = models.ForeignKey(Layout, on_delete=models.CASCADE)
    value = models.ForeignKey(Gauge, on_delete=models.CASCADE)


class Display(models.Model):
    name = models.CharField(max_length=100, null=True)
    available = models.BooleanField(default=False)
    resolution_x = models.IntegerField(default=0)
    resolution_y = models.IntegerField(default=0)
