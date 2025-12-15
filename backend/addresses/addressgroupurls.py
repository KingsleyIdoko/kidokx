from django.urls import path,include
from .addgrpviews import addressbook_view
urlpatterns = [
    #adddress group urls
    path('',addressbook_view)
]
