from django.test import TestCase
from unittest.mock import patch
from recipes.models import Recipe
from .utils import get_demo_recipe, get_demo_user, mock_imagekit_upload, mock_imagekit_delete
from datetime import timedelta
from rest_framework.test import APIClient
import time

# Create your tests here.
class RecipeViewsTestCase(TestCase):
    def setUp(self):
        self.api_client = APIClient()

        self.total_recipes = 15

        self.user = get_demo_user()
        self.user_replica = get_demo_user('hasan_abir_replica')

        for x in range(0, self.total_recipes):
            time.sleep(0.01)

            if x % 2 == 0:
                recipe = get_demo_recipe(self.user, str(x) + ' Example Recipe Yummy', 'Hard', 'Example', ['breakfast', 'brunch'])
            else:
                recipe = get_demo_recipe(self.user, str(x) + ' Example Recipe')

            if x == 0:
                self.first_recipe = recipe

    def login(self, username = 'hasan_abir'):
        data = {
            'username': username,
            'password': 'testtest'
        }
        self.api_client.post('/api-token-obtain/', data)

    def test_get_list(self):
        response = self.api_client.get('/recipes/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 10)
        self.assertEqual(response.json()['count'], self.total_recipes)
        self.assertEqual(response.json()['results'][0]['title'], "14 Example Recipe Yummy")
        self.assertEqual(response.json()['results'][1]['title'], "13 Example Recipe")
        self.assertEqual(response.json()['results'][len(response.json()['results']) - 1]['title'], "5 Example Recipe")

        response = self.api_client.get('/recipes/?page=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 10)

        response = self.api_client.get('/recipes/?title=yummy')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 7)

        response = self.api_client.get('/recipes/?difficulty=hard')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 7)

        response = self.api_client.get('/recipes/?ingredient=example')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 7)

        response = self.api_client.get('/recipes/?breakfast&brunch')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 7)
        response = self.api_client.get('/recipes/?dinner')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 0)
        response = self.api_client.get('/recipes/?vegan')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 5)
        response = self.api_client.get('/recipes/?glutenfree')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 0)

    def test_get_detail(self):
        url = '/recipes/{pk}/'.format(pk=self.first_recipe.pk)

        response = self.api_client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        response = self.api_client.get('/recipes/100/')
        self.assertEqual(response.status_code, 404)

    @patch('recipes.serializers.upload_image')
    def test_post(self, mock_upload_image):
        mock_upload = mock_imagekit_upload(mock_upload_image)

        image_path = 'recipes/test_suites/sample_files/cat_small.jpg'
    
        data = {
            'title': 'Recipe 1',
            'preparation_time': '00:02:03',
            'cooking_time': '00:03:02',
            'difficulty': 'medium',
            'meal_types': ['breakfast', 'lunch'],
            'dietary_preferences': ['vegan'],
            'instruction_steps': 'Bop it\nTwist it\nAnd I forgot the rest',
            'ingredient_list': 'Sugar 1tsp\nMilk 1tsp\nFlour 1tsp',
        }


        response = self.api_client.post('/recipes/', data)
        self.assertEqual(response.status_code, 401)

        self.login()

        response = self.api_client.post('/recipes/', {})
        self.assertEqual(response.status_code, 400)

        with open(image_path, 'rb') as image_file:
            data['image'] = image_file
            response = self.api_client.post('/recipes/', data, format='multipart')
        
        self.assertEqual(response.status_code, 201)

        mock_upload.assert_called_once()

        self.assertEqual(response.json()['title'], data['title'])

        self.assertEqual(Recipe.objects.count(), self.total_recipes + 1)

    @patch('recipes.serializers.delete_image')
    @patch('recipes.serializers.upload_image')
    def test_patch_detail(self, mock_upload_image, mock_delete_image):
        image_path = 'recipes/test_suites/sample_files/cat_small.jpg'

        url = '/recipes/{pk}/'.format(pk=self.first_recipe.pk)

        data = {
            'title': 'Recipe 1',
            'preparation_time': '00:02:03',
            'cooking_time': '00:03:02',
            'difficulty': 'medium',
        }

        response = self.api_client.patch(url, data)
        self.assertEqual(response.status_code, 401)

        self.login('hasan_abir_replica')

        response = self.api_client.patch(url, data)
        self.assertEqual(response.status_code, 403)

        mock_upload =  mock_imagekit_upload(mock_upload_image)
        mock_delete = mock_imagekit_delete(mock_delete_image)

        self.login()

        response = self.api_client.patch(url, {
            'title': '',
            'preparation_time': '',
            'cooking_time': '',
            'difficulty': '',
            'image': ''
        })
        self.assertEqual(response.status_code, 400)

        response = self.api_client.patch('/recipes/123/', {})
        self.assertEqual(response.status_code, 404)

        with open(image_path, 'rb') as image_file:
            data['image'] = image_file
            response = self.api_client.patch(url, data, format='multipart')

        self.assertEqual(response.status_code, 200)

        mock_upload.assert_called_once()
        mock_delete.assert_called_once()

        recipe = Recipe.objects.get(pk=self.first_recipe.pk)

        self.assertEqual(recipe.title, data['title'])
        self.assertEqual(recipe.preparation_time, timedelta(hours=0, minutes=2, seconds=3))
        self.assertEqual(recipe.cooking_time, timedelta(hours=0, minutes=3, seconds=2))
        self.assertEqual(recipe.difficulty, data['difficulty'])
        self.assertEqual(recipe.image_id, "123")
        self.assertEqual(recipe.image_url, "http://testserver/image/123")

    @patch('recipes.views.delete_image')
    def test_delete_detail(self, mock_delete_image):
        mock_delete = mock_imagekit_delete(mock_delete_image)
        url = '/recipes/{pk}/'.format(pk=self.first_recipe.pk)

        response = self.api_client.delete(url)
        self.assertEqual(response.status_code, 401)

        self.login('hasan_abir_replica')

        response = self.api_client.delete(url)
        self.assertEqual(response.status_code, 403)

        self.login()

        response = self.api_client.delete('/recipes/123/')
        self.assertEqual(response.status_code, 404)

        response = self.api_client.delete(url)
        self.assertEqual(response.status_code, 204)

        mock_delete.assert_called_once()
        self.assertEqual(Recipe.objects.count(), self.total_recipes - 1)

