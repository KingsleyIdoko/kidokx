from django.urls import path
from .inventoryview.views import (device_list_view ,device_update_view, 
                                  device_detail_view, device_delete_view,
                                  device_create_view,device_create_view, 
                                  device_names_view,device_names_view )

from .sites.views import (site_list_view,site_names_view,
                          site_detail_view,site_create_view,
                          site_update_view,site_delete_view)

urlpatterns = [
    path('devices/',device_list_view),
    path('devices/names/',device_names_view),
    path('devices/<int:pk>/',device_detail_view),
    path('devices/create/',device_create_view),
    path('devices/<int:pk>/update/',device_update_view,),
    path('devices/<int:pk>/delete/',device_delete_view),
    path('devices/monitor/',device_names_view),
    # sites urls
    path('sites/',site_list_view),
    path('sites/names/',site_names_view),
    path('sites/<int:pk>/',site_detail_view),
    path('sites/create/',site_create_view),
    path('sites/<int:pk>/update/',site_update_view,),
    path('sites/<int:pk>/delete/',site_delete_view),
]
