from django.db import models


class Gauge(models.Model):
    key = models.CharField(max_length=200, primary_key=True)
    value = models.CharField(max_length=600)


class Layout(models.Model):
    key = models.CharField(max_length=100, primary_key=True)
    display_positions = models.TextField(default='')
    data = models.BinaryField()


class Display(models.Model):
    key = models.CharField(max_length=100, primary_key=True)
    available = models.BooleanField(default=False)
    resolution_x = models.IntegerField(default=0)
    resolution_y = models.IntegerField(default=0)
    current_layout = models.ForeignKey(Layout, on_delete=models.SET_NULL, null=True)
    display_data = models.TextField(default='')

