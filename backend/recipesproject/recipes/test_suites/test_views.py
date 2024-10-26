from django.test import TestCase
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeMealType, RecipeDietaryPreference
from .utils import get_demo_recipe, get_demo_mealtype, get_demo_dietarypreference
from datetime import timedelta

# Create your tests here.
class RecipeViewsTestCase(TestCase):
    def setUp(self):
        self.total_recipes = 15

        for x in range(0, self.total_recipes):
            recipe = get_demo_recipe()    
            if x == 0:
                self.first_recipe = recipe.pk


    def test_get_list(self):
        response = self.client.get('/recipes/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 10)
        self.assertEqual(response.json()['count'], self.total_recipes)
        self.assertEqual(response.json()['results'][0]['title'], "Example Recipe")

        response = self.client.get('/recipes/?page=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 10)

    def test_get_detail(self):
        url = '/recipes/{pk}/'.format(pk=self.first_recipe)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        response = self.client.get('/recipes/100/')
        self.assertEqual(response.status_code, 404)

    def test_post(self):
        data = {
            'title': 'Recipe 1',
            'preparation_time': '00:02:03',
            'cooking_time': '00:03:02',
            'difficulty': 'medium',
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl',
            'meal_type': get_demo_mealtype().pk,
            'dietary_preference': get_demo_dietarypreference().pk
        }

        response = self.client.post('/recipes/', data=data)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['title'], data['title'])

        self.assertEqual(Recipe.objects.count(), self.total_recipes + 1)

    def test_patch_detail(self):
        url = '/recipes/{pk}/'.format(pk=self.first_recipe)

        data = {
            'title': 'Recipe 1',
            'preparation_time': '00:02:03',
            'cooking_time': '00:03:02',
            'difficulty': 'medium',
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl',
        }

        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        recipe = Recipe.objects.get(pk=self.first_recipe)

        self.assertEqual(recipe.title, data['title'])
        self.assertEqual(recipe.preparation_time, timedelta(hours=0, minutes=2, seconds=3))
        self.assertEqual(recipe.cooking_time, timedelta(hours=0, minutes=3, seconds=2))
        self.assertEqual(recipe.difficulty, data['difficulty'])
        self.assertEqual(recipe.image_id, data['image_id'])
        self.assertEqual(recipe.image_url, data['image_url'])

    def test_delete_detail(self):
        url = '/recipes/{pk}/'.format(pk=self.first_recipe)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        self.assertEqual(Recipe.objects.count(), self.total_recipes - 1)
