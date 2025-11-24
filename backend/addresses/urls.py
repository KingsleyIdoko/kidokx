from django.urls import path,include
from .views import address_list_view

urlpatterns = [

    path('', address_list_view),

]
