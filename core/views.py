from django.core.serializers import serialize

from django.http import HttpResponse

from core.models import Guage


def index(request):
    return HttpResponse(serialize('json', Guage.objects.all(), fields=('key', 'value')))

