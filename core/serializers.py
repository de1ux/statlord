from . import models
from rest_framework import serializers


class GaugeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Gauge
        fields = ('key', 'value',)


class DisplaySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Display
        fields = ('key', 'available', 'resolution_x', 'resolution_y', 'current_layout',)


class LayoutSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Layout
        fields = ('key', 'data')


class LayoutSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Layout
        fields = ('key', 'data')
