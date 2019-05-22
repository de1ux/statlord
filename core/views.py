from django.core.serializers import serialize

from django.http import HttpResponse

from core.models import Gauge


def index(request):
    return HttpResponse(serialize('json', Gauge.objects.all(), fields=('key', 'value')))

