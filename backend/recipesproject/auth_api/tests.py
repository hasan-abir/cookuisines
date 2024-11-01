from django.test import TestCase
from django.contrib.auth.models import User

# Create your tests here.
class RegisterViewTestCase(TestCase):
    def test_post_method(self):
        data = {
            'username': '',
            'email': '',
            'password': ''
        }
        response = self.client.post('/api-user-register/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['username'][0], 'This field may not be blank.')
        data = {
            'username': 'hasan_abir',
            'email': 'hasan_abir@test.com',
            'password': 'testtest'
        }
        response = self.client.post('/api-user-register/', data=data, content_type='application/json')
    
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(response.json()['username'], data['username'])
        self.assertEqual(response.json()['email'], data['email'])

class JWTViewsTestCase(TestCase):
    def setUp(self):
        self.user_created = User.objects.create_user('hasan_abir', 'hasanabir@test.com', 'testtest')

    def test_token_obtain(self):
        data = {
            'username': 'hasan_abir1',
            'password': 'testtest1'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['detail'], 'No active account found with the given credentials')

        data = {
            'username': 'hasan_abir',
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])
        self.assertTrue(response.json()['refresh'])

    def test_token_refresh(self):
        data = {
            'username': 'hasan_abir',
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        refresh_token = response.json()['refresh']

        data = {
            'refresh': refresh_token
        }
        response = self.client.post('/api-token-refresh/', data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])
