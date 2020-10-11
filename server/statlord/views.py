import json
from urllib.request import Request, urlopen

from django.http import Http404, HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings

from statlord.models import Display, Gauge, Layout
from statlord.serializers import DisplaySerializer, GaugeSerializer, LayoutSerializer


class GaugeList(APIView):
    def get(self, request):
        guages = Gauge.objects.all()
        serializer = GaugeSerializer(guages, many=True)
        return Response(serializer.data)


class GaugeItem(APIView):
    def get_object(self, key):
        try:
            return Gauge.objects.get(key=key)
        except Gauge.DoesNotExist:
            raise Http404

    def get(self, request, key):
        gauge = self.get_object(key)
        serializer = GaugeSerializer(gauge)
        return Response(serializer.data)

    def put(self, request, key):
        gauge, created = Gauge.objects.update_or_create(key=key, defaults=({'value': request.data['value']}))
        serializer = GaugeSerializer(gauge)
        return Response(serializer.data)


class DisplayList(APIView):
    def get(self, request):
        displays = Display.objects.all()
        serializer = DisplaySerializer(displays, many=True)
        return Response(serializer.data)


class DisplayItem(APIView):
    def get_object(self, key):
        try:
            return Display.objects.get(key=key)
        except Display.DoesNotExist:
            raise Http404

    def get(self, request, key):
        gauge = self.get_object(key)
        serializer = DisplaySerializer(gauge)
        return Response(serializer.data)

    def put(self, request, key):
        if 'resolution_x' in request.data and 'resolution_y' in request.data:
            # TODO - not sure these fields are needed
            display, _ = Display.objects.update_or_create(key=key, defaults=({
                'resolution_x': request.data['resolution_x'],
                'resolution_y': request.data['resolution_y'],
                'display_data': request.data['display_data'],
                'rotation': 0,
                'available': True}))
        else:
            # coming from a headless update
            display = Display.objects.get(key=key)
            display.display_data = request.data['display_data']

        return JsonResponse({}, status=status.HTTP_200_OK)


class LayoutList(APIView):
    def get(self, request):
        layouts = Layout.objects.all()
        serializer = LayoutSerializer(layouts, many=True)
        return Response(serializer.data)


class LayoutItem(APIView):
    def get_object(self, key):
        try:
            return Layout.objects.get(key=key)
        except Layout.DoesNotExist:
            raise Http404

    def get(self, request, key):
        layout = self.get_object(key)
        return Response({
            'key': key,
            'data': bytes(layout.data).decode(),
            'display_positions': layout.display_positions})

    def put(self, request, key):
        import pdb;
        pdb.set_trace()
        layout, created = Layout.objects.update_or_create(key=key, defaults=({
            'data': json.dumps(request.data['data']).encode(),
            'display_positions': request.data['display_positions']}))

        serializer = LayoutSerializer(layout)
        return Response(serializer.data)


class StaticAssets(APIView):
    def get(self, request, path=None):
        if not path:
            path = "index.html"

        if settings.DEBUG:
            url = f"http://0.0.0.0:3000/{path}"
            req = Request(url)
            res = urlopen(req)
            return HttpResponse(res.read())

        test_file = open(f'./static/{path}', 'r')
        return HttpResponse(content=test_file)
