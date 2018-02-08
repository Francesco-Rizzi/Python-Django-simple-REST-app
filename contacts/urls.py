from django.urls import path
from contacts import views

urlpatterns = [
    path('', views.HomePageView.as_view(), name='homepage'),
]
