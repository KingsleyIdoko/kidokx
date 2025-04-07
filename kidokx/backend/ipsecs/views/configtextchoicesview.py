from rest_framework.response import Response
from rest_framework.decorators import api_view
from ipsecs.serializers.configSerializers import ConfigurationChoicesSerializer

@api_view(['GET'])
def get_ipsec_choices(request):
    serializer = ConfigurationChoicesSerializer({})
    return Response(serializer.data)