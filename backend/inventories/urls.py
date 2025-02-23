from django.urls import path
from .views import (device_list_view ,device_update_view, device_detail_view, device_delete_view,device_create_view,device_create_view )

urlpatterns = [
    path('device/',device_list_view),
    path('device/<int:pk>',device_detail_view),
    path('device/create/',device_create_view),
    path('device/<int:pk>/update/',device_update_view,),
    path('device/<int:pk>/delete/',device_delete_view),
]
