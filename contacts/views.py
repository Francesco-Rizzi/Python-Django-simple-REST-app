from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import viewsets
from contacts.models import ContactUser
from contacts.serializers import ContactUserSerializer


class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'app.jinja.html', context=None)


class ContactUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows UserContacts to be viewed or edited.
    """

    queryset = ContactUser.objects.all()
    serializer_class = ContactUserSerializer
