from security.views import securityzone_list_view,securityzone_create_view
from django.urls import path,include
urlpatterns = [
    #securityzones
    path('zones/',securityzone_list_view),
    path('zones/create/',securityzone_create_view),

]
