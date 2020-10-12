import json
from urllib.request import Request, urlopen

from django.conf import settings
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, get_object_or_404, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from statlord.models import Display, Gauge, Layout
from statlord.serializers import DisplaySerializer, GaugeSerializer, LayoutSerializer


class GaugeList(ListAPIView):
    serializer_class = GaugeSerializer
    queryset = Gauge.objects


class GaugeItem(RetrieveUpdateDestroyAPIView):
    serializer_class = GaugeSerializer

    def get_object(self):
        return get_object_or_404(Gauge.objects, key=self.kwargs['key'])

    def put(self, request, *args, **kwargs):
        gauge, created = Gauge.objects.update_or_create(key=self.kwargs['key'],
                                                        defaults=({'value': request.data['value']}))
        serializer = GaugeSerializer(gauge)
        return Response(serializer.data)


class DisplayList(ListAPIView):
    serializer_class = DisplaySerializer
    queryset = Display.objects


class DisplayItem(RetrieveUpdateDestroyAPIView):
    serializer_class = DisplaySerializer

    def get_object(self):
        return get_object_or_404(Display.objects, key=self.kwargs['key'])

    def put(self, request, *args, **kwargs):
        if 'resolution_x' in request.data and 'resolution_y' in request.data:
            # TODO - move into a create serializer
            display, _ = Display.objects.update_or_create(key=self.kwargs['key'], defaults=({
                'resolution_x': request.data['resolution_x'],
                'resolution_y': request.data['resolution_y'],
                'display_data': request.data['display_data'],
                'rotation': 0,
                'available': True}))
        else:
            # coming from a headless update
            display = Display.objects.get(key=self.kwargs['key'])
            display.display_data = request.data['display_data']

        return JsonResponse({}, status=status.HTTP_200_OK)


class LayoutList(ListAPIView):
    serializer_class = LayoutSerializer
    queryset = Layout.objects


class LayoutItem(RetrieveUpdateDestroyAPIView):
    serializer_class = LayoutSerializer

    def get_object(self):
        return get_object_or_404(Layout.objects, key=self.kwargs['key'])

    def put(self, request, *args, **kwargs):
        # TODO - move into a create serializer
        layout, created = Layout.objects.update_or_create(key=self.kwargs['key'], defaults=({
            'data': json.dumps(request.data['data']).encode(),
            'display_positions': request.data['display_positions']}))

        serializer = LayoutSerializer(layout)
        return Response(serializer.data)


class StaticAssets(APIView):
    def get(self, request, path=None):
        if not path:
            path = "index.html"
        if 'edit' in path:
            path = 'index.html'
        if 'view' in path:
            path = 'index.html'

        if settings.DEBUG:
            url = f"http://0.0.0.0:3000/{path}"
            req = Request(url)
            res = urlopen(req)
            return HttpResponse(res.read())

        test_file = open(f'./static/{path}', 'r')
        return HttpResponse(content=test_file)
