from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.views import APIView
from .models import Interface
from inventories.models import Device
from rest_framework.response import Response
from .serializers import InterfaceSerializer
from interfaces.scripts.getInterfaces import sync_interfaces_to_db


class InterfaceListView(ListAPIView):
    serializer_class = InterfaceSerializer
    queryset = Interface.objects.all()

    def list(self, request, *args, **kwargs):
        device_name = request.query_params.get('device')
        if device_name:
            try:
                sync_interfaces_to_db(device_name)
            except Device.DoesNotExist:
                return Response({"error": f"Device '{device_name}' not found."}, status=404)
            except Exception as e:
                return Response({"error": f"Failed to sync from device: {str(e)}"}, status=500)

            self.queryset = Interface.objects.filter(device__device_name=device_name)

        return super().list(request, *args, **kwargs)

interface_list_view = InterfaceListView.as_view()


class InterfaceCreateView(CreateAPIView):
    serializer_class = InterfaceSerializer
    queryset = Interface.objects.all()
    lookup_field = 'pk'

interface_create_view = InterfaceCreateView.as_view()


class InterfaceUpdateView(ListAPIView):
    serializer_class = InterfaceSerializer
    queryset = Interface.objects.all()
    lookup_field = 'pk'

interface_update_view = InterfaceUpdateView.as_view()

class InterfaceDeleteView(ListAPIView):
    serializer_class = InterfaceSerializer
    queryset = Interface.objects.all()
    lookup_field = 'pk'

interface_delete_view = InterfaceDeleteView.as_view()


class InterfaceListNames(APIView):
    def get(self, request, *args, **kwargs):
        device_name = request.query_params.get('device')
        if not device_name:
            return Response({"error": "Missing 'device' parameter"}, status=400)

        try:
            # Trigger the sync logic as done in InterfaceListView
            sync_interfaces_to_db(device_name)
        except Device.DoesNotExist:
            return Response({"error": f"Device '{device_name}' not found"}, status=404)
        except Exception as e:
            return Response({"error": f"Failed to sync interfaces: {str(e)}"}, status=500)

        # Now safely query the updated DB
        names = Interface.objects.filter(device__device_name=device_name).values_list('name', flat=True)
        return Response(list(names))

Interface_list_names = InterfaceListNames.as_view()


class InterfaceZone(APIView):
    def get(self, request, *args, **kwargs):
        device_name = request.query_params.get('device')
        if not device_name:
            return Response({"error": "Missing 'device' parameter"}, status=400)

        try:
            # Trigger the sync logic as done in InterfaceListView
            sync_interfaces_to_db(device_name)
        except Device.DoesNotExist:
            return Response({"error": f"Device '{device_name}' not found"}, status=404)
        except Exception as e:
            return Response({"error": f"Failed to sync interfaces: {str(e)}"}, status=500)

        # Now safely query the updated DB
        names = (Interface.objects.filter(device__device_name=device_name, zones__isnull=True)
                        .exclude(name__iexact="fxp0")
                        .exclude(name__istartswith="fab")
                        .values_list('name', flat=True))
        return Response(list(names))

Interface_zones_names = InterfaceZone.as_view()
