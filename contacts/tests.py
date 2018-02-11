from django.test import TestCase
from .models import ContactUser
from rest_framework.test import APIClient
from rest_framework import status

ENDPOINT = '/api/ContactUser/'


class ViewTestCase(TestCase):
    """Test suite for the api views."""

    def setUp(self):
        self.client = APIClient()
        self.contact_user_data = {'name': 'testname', 'surname': 'testsurname', 'email': 'test@gmail.com',
                                  'mobile': '335 6578765', 'info': 'A test friend.'}
        self.response = self.client.post(
            ENDPOINT,
            self.contact_user_data,
            format="json"
        )

    def test_api_can_create_a_contact(self):
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(ContactUser.objects.all()), 1)

    def test_api_can_get_a_contact(self):
        contact = ContactUser.objects.get()
        response = self.client.get(
            "{}{}/".format(ENDPOINT, contact.id),
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], contact.id)
        self.assertEqual(response.data['name'], self.contact_user_data['name'])
        self.assertEqual(response.data['surname'], self.contact_user_data['surname'])

    def test_api_can_update_a_contact(self):
        contact = ContactUser.objects.get()
        changed_contact = self.contact_user_data
        changed_contact['name'] = 'changedName'
        response = self.client.patch(
            "{}{}/".format(ENDPOINT, contact.id),
            changed_contact, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], contact.id)
        self.assertEqual(response.data['name'], 'changedName')
        self.assertEqual(response.data['surname'], self.contact_user_data['surname'])

    def test_api_can_delete_a_contact(self):
        contact = ContactUser.objects.get()
        response = self.client.delete(
            "{}{}/".format(ENDPOINT, contact.id),
            format='json', follow=True
        )
        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(
            "{}{}/".format(ENDPOINT, contact.id),
            format='json'
        )
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(len(ContactUser.objects.all()), 0)
