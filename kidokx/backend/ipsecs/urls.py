from django.urls import path
from ipsecs.views.IkeProposalView import ikeproposal_list_view,ikeproposal_detail_view,ikeproposal_create_view,ikeproposal_update_view,ikeproposal_delete_view,ikeproposal_names_view 
from ipsecs.views.ikeGatewayView import ikegateway_create_view, ikegateway_delete_view, ikegateway_detail_view, ikegateway_list_view, ikegateway_update_view,ikegateway_names_view
from ipsecs.views.ikePolicyView import ikepolicy_list_view,ikepolicy_detail_view,ikepolicy_create_view,ikepolicy_update_view,ikepolicy_delete_view,ikepolicy_list_view,ikepolicy_names_view
from ipsecs.views.ipsecProposalView import ipsecproposal_create_view, ipsecproposal_delete_view, ipsecproposal_detail_view, ipsecproposal_list_view, ipsecproposal_update_view
from ipsecs.views.ipsecPolicyView import ipsecpolicy_create_view, ipsecpolicy_delete_view, ipsecpolicy_detail_view, ipsecpolicy_list_view, ipsecpolicy_update_view,ipsecpolicy_names_view
from ipsecs.views.ipsecVpnView import ipsecvpn_create_view, ipsecvpn_delete_view, ipsecvpn_detail_view, ipsecvpn_list_view, ipsecvpn_update_view


urlpatterns = [
    #ikeproposal
    path('ikeproposal/',ikeproposal_list_view),
    path('ikeproposal/names/',ikeproposal_names_view),
    path('ikeproposal/<int:pk>',ikeproposal_detail_view),
    path('ikeproposal/create/',ikeproposal_create_view),
    path('ikeproposal/<int:pk>/update/',ikeproposal_update_view,),
    path('ikeproposal/<int:pk>/delete/',ikeproposal_delete_view),
    #ikepolicy
    path('ikepolicy/',ikepolicy_list_view),
    path('ikepolicy/names/',ikepolicy_names_view),
    path('ikepolicy/<int:pk>',ikepolicy_detail_view),
    path('ikepolicy/create/',ikepolicy_create_view),
    path('ikepolicy/<int:pk>/update/',ikepolicy_update_view,),
    path('ikepolicy/<int:pk>/delete/',ikepolicy_delete_view),

    #ikegateway
    path('ikegateway/',ikegateway_list_view),
    path('ikegateway/names/',ikegateway_names_view),
    path('ikegateway/<int:pk>',ikegateway_detail_view),
    path('ikegateway/create/',ikegateway_create_view),
    path('ikegateway/<int:pk>/update/',ikegateway_update_view,),
    path('ikegateway/<int:pk>/delete/',ikegateway_delete_view),

    #ipsecproposal
    path('ipsecproposal/',ipsecproposal_list_view),
    path('ipsecproposal/<int:pk>',ipsecproposal_detail_view),
    path('ipsecproposal/create/',ipsecproposal_create_view),
    path('ipsecproposal/<int:pk>/update/',ipsecproposal_update_view,),
    path('ipsecproposal/<int:pk>/delete/',ipsecproposal_delete_view),

    #ipsecpolicy
    path('ipsecpolicy/',ipsecpolicy_list_view),
    path('ipsecpolicy/names/',ipsecpolicy_names_view),
    path('ipsecpolicy/<int:pk>',ipsecpolicy_detail_view),
    path('ipsecpolicy/create/',ipsecpolicy_create_view),
    path('ipsecpolicy/<int:pk>/update/',ipsecpolicy_update_view,),
    path('ipsecpolicy/<int:pk>/delete/',ipsecpolicy_delete_view),

    #ipsecvpn
    path('ipsecvpn/',ipsecvpn_list_view),
    path('ipsecvpn/<int:pk>',ipsecvpn_detail_view),
    path('ipsecvpn/create/',ipsecvpn_create_view),
    path('ipsecvpn/<int:pk>/update/',ipsecvpn_update_view,),
    path('ipsecvpn/<int:pk>/delete/',ipsecvpn_delete_view),
]
