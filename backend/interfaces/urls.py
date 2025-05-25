from django.urls import path
from .views import interface_list_view, interface_create_view, interface_update_view, interface_delete_view, Interface_list_names

urlpatterns = [
    path('', interface_list_view),
    path('names/', Interface_list_names),
    path('create/', interface_create_view),
    path('update/<int:pk>/', interface_update_view),
    path('delete/<int:pk>/', interface_delete_view),
]
