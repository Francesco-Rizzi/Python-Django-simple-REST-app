from contacts.models import ContactUser
from rest_framework import serializers


class ContactUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ContactUser
        fields = ('name', 'surname', 'email', 'mobile', 'info', 'created_on',)
