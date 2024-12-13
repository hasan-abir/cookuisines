from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from auth_api.serializers import UserSerializer, RefreshSerializer
from recipes.test_suites.utils import get_demo_user 
from rest_framework.test import APIClient
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.serializers import ValidationError

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

class TokenViewsTestCase(TestCase):
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
        self.assertTrue(response.cookies.get('access-token'))
        self.assertTrue(response.cookies.get('refresh-token'))

    def test_token_refresh(self):
        data = {
            'username': 'hasan_abir',
            'password': 'testtest'
        }
        response = self.api_client.post('/api-token-obtain/', data)
        self.assertEqual(response.status_code, 200)

        response = self.api_client.post('/api-token-refresh/')


        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])
        self.assertTrue(response.cookies.get('access-token'))

    def test_token_refresh_without_cookie(self):
        self.api_client.cookies.clear()
        print(self.api_client.cookies)
        response = self.api_client.post('/api-token-refresh/')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['refresh'][0], 'Cookie not found. Login again.')

class UserSerializerTestCase(TestCase):
    def test_validation(self):
        data = {
            'username': 'test_user',
            'email': 'test@test.com',
            'password': 'testtest',
        }

        serializer = UserSerializer(data=data)

        self.assertTrue(serializer.is_valid())

        data = {
            'username': 'test_user',
            'email': 'test',
            'password': '1',
        }

        serializer = UserSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['email'][0], 'Enter a valid email address.')
        self.assertEqual(serializer.errors['password'][0], 'Password must be at least 8 characters long')


    def test_save(self):
        get_demo_user()

        data = {
            'username': 'hasan_abir',
            'email': 'hasan_abir@test.com',
            'password': 'testtest',
        }

        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['username'][0], 'A user with that username already exists.')
        self.assertEqual(serializer.errors['email'][0], 'A user with that email already exists.')

        data = {
            'username': 'test_user',
            'email': 'test@test.com',
            'password': 'testtest',
        }

        serializer = UserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        serializer.save()

        self.assertEqual(serializer.data['username'], data['username'])
        self.assertEqual(serializer.data['email'], data['email'])
        self.assertFalse('password' in serializer.data)


class RefreshSerializerTestCase(TestCase):
    def test_validation(self):
        mock_request = RequestFactory().get('/mock/')

        mock_request.COOKIES = {}

        context = {'request': mock_request}

        serializer = RefreshSerializer(context=context)

        with self.assertRaises(ValidationError):
            serializer.validate({})

        mock_request = RequestFactory().get('/mock/')

        mock_request.COOKIES = {
            'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }

        context = {'request': mock_request}

        serializer = RefreshSerializer(context=context)

        with self.assertRaises(TokenError):
            serializer.validate({})
