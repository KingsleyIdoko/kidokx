
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView
from ipsecs.models import IpsecProposal
from ipsecs.serializers.ipsecProposalSerializers import IpsecProposalSerializer

class ipsecProposalListView(ListAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
ipsecproposal_list_view = ipsecProposalListView.as_view()

class ipsecProposalCreateView(CreateAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer

ipsecproposal_create_view = ipsecProposalCreateView.as_view()

class ipsecProposalDetailView(RetrieveAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

ipsecproposal_detail_view = ipsecProposalDetailView.as_view()

class ipsecProposalUpdateView(UpdateAPIView):  
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        is_published_requested = request.data.get('is_published', False)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # If publish requested
        if is_published_requested:
            try:
                success = self.push_to_network_device(serializer.validated_data)

                if not success:
                    return Response({"detail": "Device push failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                serializer.save(is_published=True)
            except Exception as e:
                return Response({"detail": f"Error during deployment: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            serializer.save()

        return Response(serializer.data)

    def push_to_network_device(self, data):
        """
        Replace this stub with your actual push logic
        Example: use Paramiko, NAPALM, REST API, etc.
        """
        print(f"Pushing config to device {data['device']} ...")
        # simulate network push
        return True  # return False to simulate failure
ipsecproposal_update_view = ipsecProposalUpdateView.as_view()

class ipsecProposalDestroyView(DestroyAPIView):
    queryset = IpsecProposal.objects.all()
    serializer_class = IpsecProposalSerializer
    lookup_field = 'pk'

ipsecproposal_delete_view = ipsecProposalDestroyView.as_view()