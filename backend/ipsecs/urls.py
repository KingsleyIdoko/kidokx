from django.urls import path
from .views import (proposal_list_view ,proposal_update_view, proposal_detail_view, proposal_delete_view,proposal_create_view,proposal_create_view )

urlpatterns = [
    path('proposal/',proposal_list_view),
    path('proposal/<int:pk>',proposal_detail_view),
    path('proposal/create/',proposal_create_view),
    path('proposal/<int:pk>/update/',proposal_update_view,),
    path('proposal/<int:pk>/delete/',proposal_delete_view),
]
