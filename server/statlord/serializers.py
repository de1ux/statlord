from rest_framework import serializers

from . import models


class GaugeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Gauge
        fields = ('key', 'value',)


class DisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Display
        fields = ('key', 'available', 'resolution_x', 'resolution_y', 'current_layout', 'display_data', 'rotation')


class LayoutSerializer(serializers.ModelSerializer):
    data = serializers.SerializerMethodField()

    @staticmethod
    def get_data(obj: models.Layout):
        return bytes(obj.data).decode()

    class Meta:
        model = models.Layout
        fields = ('key', 'data', 'display_positions')

