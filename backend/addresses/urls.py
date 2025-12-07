from django.urls import path,include
from .views import address_list_view,address_create_view

urlpatterns = [

    path('', address_list_view),
    path('create/', address_create_view)

]
