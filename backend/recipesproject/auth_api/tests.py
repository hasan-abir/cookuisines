from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

# Create your tests here.
class RegisterViewTestCase(TestCase):
    def setUp(self):
        self.api_client = APIClient()
    def test_post_method(self):
        data = {
            'username': '',
            'email': '',
            'password': ''
        }
        response = self.api_client.post('/api-user-register/', data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['username'][0], 'This field may not be blank.')
        data = {
            'username': 'hasan_abir',
            'email': 'hasan_abir@test.com',
            'password': 'testtest'
        }
        response = self.api_client.post('/api-user-register/', data)
    
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()['username'], data['username'])
        self.assertEqual(response.json()['email'], data['email'])

class JWTViewsTestCase(TestCase):
    def setUp(self):
        self.api_client = APIClient()
        self.user_created = User.objects.create_user('hasan_abir', 'hasanabir@test.com', 'testtest')

    def test_token_obtain(self):
        data = {
            'username': 'hasan_abir1',
            'password': 'testtest1'
        }
        response = self.api_client.post('/api-token-obtain/', data)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['detail'], 'No active account found with the given credentials')

        data = {
            'username': 'hasan_abir',
            'password': 'testtest'
        }
        response = self.api_client.post('/api-token-obtain/', data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])
        self.assertTrue(response.json()['refresh'])

    def test_token_refresh(self):
        data = {
            'username': 'hasan_abir',
            'password': 'testtest'
        }
        response = self.api_client.post('/api-token-obtain/', data)
        self.assertEqual(response.status_code, 200)

        refresh_token = response.json()['refresh']

        data = {
            'refresh': refresh_token
        }
        response = self.api_client.post('/api-token-refresh/', data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])
