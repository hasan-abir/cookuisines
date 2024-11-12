from django.test import TestCase
from recipes.models import Recipe, Ingredient, Instruction, MealType, DietaryPreference
from django.contrib.auth.models import User
from .utils import get_demo_recipe, get_demo_user, get_demo_mealtype, get_demo_dietarypreference, get_demo_ingredient, get_demo_instruction
from datetime import timedelta

# Create your tests here.
class RecipeViewsTestCase(TestCase):
    def setUp(self):
        self.total_recipes = 15

        self.user = get_demo_user()
        self.user_replica = get_demo_user('hasan_abir_replica')

        data = {
            'username': self.user.username,
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token = response.json()['access']

        data = {
            'username': self.user_replica.username,
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token_replica = response.json()['access']

        for x in range(0, self.total_recipes):
            if x % 2 == 0:
                recipe = get_demo_recipe(self.user, 'Example Recipe Yummy', 'Hard')
                get_demo_ingredient(recipe)
            else:
                recipe = get_demo_recipe(self.user)
                get_demo_dietarypreference(recipe)  
                get_demo_mealtype(recipe)  

            if x == 0:
                self.first_recipe = recipe


    def test_get_list(self):
        response = self.client.get('/recipes/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 10)
        self.assertEqual(response.json()['count'], self.total_recipes)
        self.assertEqual(response.json()['results'][1]['title'], "Example Recipe")

        response = self.client.get('/recipes/?page=2')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 10)

        response = self.client.get('/recipes/?title=yummy')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 7)

        response = self.client.get('/recipes/?difficulty=hard')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 7)

        response = self.client.get('/recipes/?ingredient=example')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 7)

        response = self.client.get('/recipes/?breakfast&brunch')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 8)
        response = self.client.get('/recipes/?lunch')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 0)
        response = self.client.get('/recipes/?vegan')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_recipes - 8)
        response = self.client.get('/recipes/?glutenfree')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 0)

    def test_get_detail(self):
        url = '/recipes/{pk}/'.format(pk=self.first_recipe.pk)

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
            'created_by': self.user.pk
        }

        response = self.client.post('/recipes/', data=data)
        self.assertEqual(response.status_code, 401)

        response = self.client.post('/recipes/', data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 201)

        self.assertEqual(response.json()['title'], data['title'])

        self.assertEqual(Recipe.objects.count(), self.total_recipes + 1)

    def test_patch_detail(self):
        url = '/recipes/{pk}/'.format(pk=self.first_recipe.pk)

        data = {
            'title': 'Recipe 1',
            'preparation_time': '00:02:03',
            'cooking_time': '00:03:02',
            'difficulty': 'medium',
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl',
        }

        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 200)

        recipe = Recipe.objects.get(pk=self.first_recipe.pk)

        self.assertEqual(recipe.title, data['title'])
        self.assertEqual(recipe.preparation_time, timedelta(hours=0, minutes=2, seconds=3))
        self.assertEqual(recipe.cooking_time, timedelta(hours=0, minutes=3, seconds=2))
        self.assertEqual(recipe.difficulty, data['difficulty'])
        self.assertEqual(recipe.image_id, data['image_id'])
        self.assertEqual(recipe.image_url, data['image_url'])

    def test_delete_detail(self):
        url = '/recipes/{pk}/'.format(pk=self.first_recipe.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 204)

        self.assertEqual(Recipe.objects.count(), self.total_recipes - 1)

class IngredientViewsTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()
        self.user_replica = get_demo_user('hasan_abir_replica')

        data = {
            'username': self.user.username,
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token = response.json()['access']

        data = {
            'username': self.user_replica.username,
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token_replica = response.json()['access']

        self.recipe1 = get_demo_recipe(self.user)    
        self.recipe2 = get_demo_recipe(self.user)    

        self.total_ingredients = 15

        for x in range(0, self.total_ingredients):
            if x % 2 == 0:
                instruction = get_demo_ingredient(self.recipe2)
                if x == 0:
                    self.first_ingredient = instruction
            else:
                get_demo_ingredient(self.recipe1)

    def test_get_list(self):
        url = '/recipes/{recipe_pk}/ingredients/'.format(recipe_pk=self.recipe1.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 7)
        self.assertEqual(response.json()['count'], 7)
        self.assertEqual(response.json()['results'][0]['name'], "Example Ingredient")

        url = '/recipes/{recipe_pk}/ingredients/'.format(recipe_pk=self.recipe2.pk)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_ingredients - 7)

    def test_get_detail(self):
        url = '/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=self.recipe2.pk, ingredient_pk=self.first_ingredient.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        response = self.client.get('/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=self.recipe2.pk, ingredient_pk=100))
        self.assertEqual(response.status_code, 404)

    def test_post(self):
        url = '/recipes/{recipe_pk}/ingredients/'.format(recipe_pk=self.recipe1.pk)

        data = {
            'name': 'Ingredient 1',
            'quantity': '1 spoon',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=self.recipe1.pk)
        }

        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 401)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], data['name'])

        self.assertEqual(Ingredient.objects.count(), self.total_ingredients + 1)

    def test_patch_detail(self):
        url = '/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=self.recipe2.pk, ingredient_pk=self.first_ingredient.pk)

        data = {
            'name': 'Ingredient 1',
            'quantity': '1 spoon',
        }
        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 200)

        instruction = Ingredient.objects.get(pk=self.first_ingredient.pk)

        self.assertEqual(instruction.name, data['name'])
        self.assertEqual(instruction.quantity, data['quantity'])

    def test_delete_detail(self):
        url = '/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=self.recipe2.pk, ingredient_pk=self.first_ingredient.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 204)

        self.assertEqual(Ingredient.objects.count(), self.total_ingredients - 1)

class InstructionViewsTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()
        self.user_replica = get_demo_user('hasan_abir_replica')

        data = {
            'username': self.user.username,
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token = response.json()['access']

        data = {
            'username': self.user_replica.username,
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token_replica = response.json()['access']

        self.recipe1 = get_demo_recipe(self.user)    
        self.recipe2 = get_demo_recipe(self.user)    

        self.total_instructions = 15

        for x in range(0, self.total_instructions):
            if x % 2 == 0:
                instruction = get_demo_instruction(self.recipe2)
                if x == 0:
                    self.first_instruction = instruction
            else:
                get_demo_instruction(self.recipe1)
                


    def test_get_list(self):
        url = '/recipes/{recipe_pk}/instructions/'.format(recipe_pk=self.recipe1.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 7)
        self.assertEqual(response.json()['count'], 7)
        self.assertEqual(response.json()['results'][0]['step'], "Example Instruction")

        url = '/recipes/{recipe_pk}/instructions/'.format(recipe_pk=self.recipe2.pk)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_instructions - 7)

    def test_get_detail(self):
        url = '/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=self.recipe2.pk, instruction_pk=self.first_instruction.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        response = self.client.get('/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=self.recipe2.pk, instruction_pk=100))
        self.assertEqual(response.status_code, 404)

    def test_post(self):
        url = '/recipes/{recipe_pk}/instructions/'.format(recipe_pk=self.recipe1.pk)

        data = {
            'step': 'Instruction 1',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=self.recipe1.pk)
        }

        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 401)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['step'], data['step'])

        self.assertEqual(Instruction.objects.count(), self.total_instructions + 1)

    def test_patch_detail(self):
        url = '/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=self.recipe2.pk, instruction_pk=self.first_instruction.pk)

        data = {
            'step': 'Instruction 1',
            'quantity': '1 spoon',
        }
        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 200)

        instruction = Instruction.objects.get(pk=self.first_instruction.pk)

        self.assertEqual(instruction.step, data['step'])

    def test_delete_detail(self):
        url = '/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=self.recipe2.pk, instruction_pk=self.first_instruction.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 204)

        self.assertEqual(Instruction.objects.count(), self.total_instructions - 1)

class MealtypeViewsTestCase(TestCase):
    def setUp(self):
        self.total_mealtypes = 15
        for x in range(0, self.total_mealtypes):
            recipe = get_demo_recipe(get_demo_user('hasan_abir_{i}'.format(i=x)))
            meal_type = get_demo_mealtype(recipe)
            if x == 0:
                self.first_recipe = recipe
                self.first_meal_type = meal_type

        self.user_replica = get_demo_user('hasan_abir_replica')
        data = {
            'username': 'hasan_abir_0',
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token = response.json()['access']

        data = {
            'username': self.user_replica.username,
        'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token_replica = response.json()['access']

    def test_get_list(self):
        url = '/recipes/mealtypes/'

        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_get_detail(self):
        url = '/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=self.first_meal_type.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        url = '/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=123)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_post(self):
        new_recipe = get_demo_recipe(User.objects.get(username='hasan_abir_0'))
        url = '/recipes/mealtypes/'

        data = {
            'lunch': True,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=new_recipe.pk)
        }

        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 401)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['breakfast'], False)
        self.assertEqual(response.json()['brunch'], False)
        self.assertEqual(response.json()['dinner'], False)
        self.assertEqual(response.json()['lunch'], data['lunch'])

        self.assertEqual(MealType.objects.count(), self.total_mealtypes + 1)

    def test_patch_detail(self):
        url = '/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=self.first_meal_type.pk)

        data = {
            'breakfast': False,
            'lunch': True,
        }

        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 200)

        meal_type = MealType.objects.get(pk=self.first_meal_type.pk)

        self.assertEqual(meal_type.breakfast, data['breakfast'])
        self.assertEqual(meal_type.lunch, data['lunch'])

    def test_delete_detail(self):
        url = '/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=self.first_meal_type.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 204)

        self.assertEqual(MealType.objects.count(), self.total_mealtypes - 1)

class DietaryprefernceViewsTestCase(TestCase):
    def setUp(self):
        self.total_dietarypreferences = 15
        for x in range(0, self.total_dietarypreferences):
            recipe = get_demo_recipe(get_demo_user('hasan_abir_{i}'.format(i=x)))
            dietary_preference = get_demo_dietarypreference(recipe)
            if x == 0:
                self.first_recipe = recipe
                self.first_dietary_preference = dietary_preference

        self.user_replica = get_demo_user('hasan_abir_replica')

        data = {
            'username': 'hasan_abir_0',
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token = response.json()['access']

        data = {
            'username': self.user_replica.username,
            'password': 'testtest'
        }
        response = self.client.post('/api-token-obtain/', data=data, content_type='application/json')

        self.token_replica = response.json()['access']

    def test_get_list(self):
        url = '/recipes/dietarypreferences/'

        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_get_detail(self):
        url = '/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=self.first_dietary_preference.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        url = '/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=123)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_post(self):
        new_recipe = get_demo_recipe(User.objects.get(username='hasan_abir_0'))
        url = '/recipes/dietarypreferences/'

        data = {
            'vegan': True,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=new_recipe.pk)
        }

        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 401)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.post(url, data=data, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['vegan'], True)
        self.assertEqual(response.json()['glutenfree'], False)

        self.assertEqual(DietaryPreference.objects.count(), self.total_dietarypreferences + 1)

    def test_patch_detail(self):
        url = '/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=self.first_dietary_preference.pk)

        data = {
            'vegan': False,
            'glutenfree': True,
        }

        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 401)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.patch(url, data=data, content_type='application/json', headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 200)

        dietary_preference = DietaryPreference.objects.get(pk=self.first_dietary_preference.pk)

        self.assertEqual(dietary_preference.vegan, data['vegan'])
        self.assertEqual(dietary_preference.glutenfree, data['glutenfree'])

    def test_delete_detail(self):
        url = '/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=self.first_dietary_preference.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 401)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token_replica)})
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(url, headers={'Authorization': 'Bearer {token}'.format(token=self.token)})
        self.assertEqual(response.status_code, 204)

        self.assertEqual(DietaryPreference.objects.count(), self.total_dietarypreferences - 1)
