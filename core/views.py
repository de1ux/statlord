from django.core.serializers import serialize

from django.http import HttpResponse, Http404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Gauge, Display, Layout
from core.serializers import GaugeSerializer, DisplaySerializer, LayoutSerializer


class GaugeList(APIView):
    def get(self, request, format=None):
        guages = Gauge.objects.all()
        serializer = GaugeSerializer(guages, many=True)
        return Response(serializer.data)


class GaugeItem(APIView):
    def get_object(self, key):
        try:
            return Gauge.objects.get(key=key)
        except Gauge.DoesNotExist:
            raise Http404

    def get(self, request, key, format=None):
        gauge = self.get_object(key)
        serializer = GaugeSerializer(gauge)
        return Response(serializer.data)

    def put(self, request, key, format=None):
        gauge, created = Gauge.objects.update_or_create(key=key, defaults=({'value': request.data['value']}))
        print(f"Created: {created}")
        serializer = GaugeSerializer(gauge)
        return Response(serializer.data)


class DisplayList(APIView):
    def get(self, request, format=None):
        displays = Display.objects.all()
        serializer = DisplaySerializer(displays, many=True)
        return Response(serializer.data)


class DisplayItem(APIView):
    def put(self, request, key, format=None):
        display, created = Display.objects.update_or_create(key=key, defaults=({
            'resolution_x': request.data['resolution_x'],
            'resolution_y': request.data['resolution_y'],
            'available': True}))

        serializer = DisplaySerializer(display, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LayoutList(APIView):
    def get(self, request, format=None):
        layouts = Layout.objects.all()
        serializer = LayoutSerializer(layouts, many=True)
        return Response(serializer.data)


class LayoutItem(APIView):
    def put(self, request, key, format=None):
        layout, created = Layout.objects.update_or_create(key=key, defaults=({
            'data': str(request.data['data']).encode()}))

        serializer = LayoutSerializer(layout)
        return Response(serializer.data)

