import json
from urllib.request import Request, urlopen

from django.http import Http404, HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings

from statlord.models import Display, Gauge, Layout
from statlord.serializers import DisplaySerializer, GaugeSerializer, LayoutSerializer


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
        serializer = GaugeSerializer(gauge)
        return Response(serializer.data)


class DisplayList(APIView):
    def get(self, request, format=None):
        displays = Display.objects.all()
        serializer = DisplaySerializer(displays, many=True)
        return Response(serializer.data)


class DisplayItem(APIView):
    def get_object(self, key):
        try:
            return Display.objects.get(key=key)
        except Display.DoesNotExist:
            raise Http404

    def get(self, request, key, format=None):
        gauge = self.get_object(key)
        serializer = DisplaySerializer(gauge)
        return Response(serializer.data)

    def put(self, request, key, format=None):
        display, created = Display.objects.update_or_create(key=key, defaults=({
            'resolution_x': request.data['resolution_x'],
            'resolution_y': request.data['resolution_y'],
            'display_data': request.data['display_data'],
            'rotation': 0,
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
    def get_object(self, key):
        try:
            return Layout.objects.get(key=key)
        except Layout.DoesNotExist:
            raise Http404

    def get(self, request, key, format=None):
        layout = self.get_object(key)
        return Response({
            'key': key,
            'data': bytes(layout.data).decode(),
            'display_positions': layout.display_positions})

    def put(self, request, key, format=None):
        layout, created = Layout.objects.update_or_create(key=key, defaults=({
            'data': json.dumps(request.data['data']).encode(),
            'display_positions': request.data['display_positions']}))

        serializer = LayoutSerializer(layout)
        return Response(serializer.data)


class StaticAssets(APIView):
    def get(self, request, path=None, format=None):
        """"""
        if not path:
            path = "index.html"

        test_file = open(f'./static/{path}', 'r')
        return HttpResponse(content=test_file)
