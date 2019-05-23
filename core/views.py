from django.core.serializers import serialize

from django.http import HttpResponse, Http404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Gauge
from core.serializers import GaugeSerializer


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
        serializer = GaugeSerializer(gauge, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
