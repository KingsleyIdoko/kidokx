from security.views import securityzone_list_view,securityzone_create_view,securityzone_update_view
from django.urls import path,include

urlpatterns = [
    #securityzones
    path('zones/',securityzone_list_view),
    path('zones/create/',securityzone_create_view),
    path('zones/update/<int:id>/', securityzone_update_view, name='securityzone-update'),

]
