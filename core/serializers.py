from . import models
from rest_framework import serializers


class GaugeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Gauge
        fields = ('key', 'value')

