from django.urls import path
from security.views import securityzone_list_view


urlpatterns = [
    #securityzones
    path('zones/',securityzone_list_view),

]
