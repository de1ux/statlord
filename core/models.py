from django.db import models

class Guage(models.Model):
    key = models.CharField(max_length=200)
    value = models.CharField(max_length=600)

class Layout(models.Model):
    pass


class LayoutItem(models.Model):
    parent = models.ForeignKey(Layout, on_delete=models.CASCADE)
    value = models.ForeignKey(Guage, on_delete=models.CASCADE)