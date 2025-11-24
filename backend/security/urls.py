from security.views import securityzone_list_view
from django.urls import path,include
urlpatterns = [
    #securityzones
    path('',securityzone_list_view),

]
