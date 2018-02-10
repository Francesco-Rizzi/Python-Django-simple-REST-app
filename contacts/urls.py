from django.urls import path, include
from contacts import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'ContactUsers', views.ContactUserViewSet)

urlpatterns = [
    path('', views.HomePageView.as_view(), name='homepage'),
    path('api/', include(router.urls))
]
