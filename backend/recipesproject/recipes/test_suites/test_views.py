from django.test import TestCase
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeMealType, RecipeDietaryPreference
from .utils import get_demo_recipe, get_demo_mealtype, get_demo_dietarypreference, get_demo_ingredient, get_demo_instruction
from datetime import timedelta

# Create your tests here.
class RecipeViewsTestCase(TestCase):
    def setUp(self):
        self.total_recipes = 15

        for x in range(0, self.total_recipes):
            recipe = get_demo_recipe()    
            if x == 0:
                self.first_recipe = recipe


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
            'meal_type': 'http://testserver/recipes/mealtypes/{pk}/'.format(pk=get_demo_mealtype().pk),
            'dietary_preference': 'http://testserver/recipes/dietarypreferences/{pk}/'.format(pk=get_demo_dietarypreference().pk)
        }

        response = self.client.post('/recipes/', data=data)

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
        self.assertEqual(response.status_code, 204)

        self.assertEqual(Recipe.objects.count(), self.total_recipes - 1)

class IngredientViewsTestCase(TestCase):
    def setUp(self):
        self.recipe1 = get_demo_recipe()    
        self.recipe2 = get_demo_recipe()    

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
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['name'], data['name'])

        self.assertEqual(RecipeIngredient.objects.count(), self.total_ingredients + 1)

    def test_patch_detail(self):
        url = '/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=self.recipe2.pk, ingredient_pk=self.first_ingredient.pk)

        data = {
            'name': 'Ingredient 1',
            'quantity': '1 spoon',
        }
        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        instruction = RecipeIngredient.objects.get(pk=self.first_ingredient.pk)

        self.assertEqual(instruction.name, data['name'])
        self.assertEqual(instruction.quantity, data['quantity'])

    def test_delete_detail(self):
        url = '/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=self.recipe2.pk, ingredient_pk=self.first_ingredient.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        self.assertEqual(RecipeIngredient.objects.count(), self.total_ingredients - 1)

class InstructionViewsTestCase(TestCase):
    def setUp(self):
        self.recipe1 = get_demo_recipe()    
        self.recipe2 = get_demo_recipe()    

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
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['step'], data['step'])

        self.assertEqual(RecipeInstruction.objects.count(), self.total_instructions + 1)

    def test_patch_detail(self):
        url = '/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=self.recipe2.pk, instruction_pk=self.first_instruction.pk)

        data = {
            'step': 'Instruction 1',
            'quantity': '1 spoon',
        }
        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        instruction = RecipeInstruction.objects.get(pk=self.first_instruction.pk)

        self.assertEqual(instruction.step, data['step'])

    def test_delete_detail(self):
        url = '/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=self.recipe2.pk, instruction_pk=self.first_instruction.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        self.assertEqual(RecipeInstruction.objects.count(), self.total_instructions - 1)

class MealtypeViewsTestCase(TestCase):
    def setUp(self):
        self.total_mealtypes = 15

        for x in range(0, self.total_mealtypes):
            meal_type = get_demo_mealtype()
            if x == 0:
                self.first_meal_type = meal_type


    def test_get_list(self):
        url = '/recipes/mealtypes/'

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 10)
        self.assertEqual(response.json()['count'], self.total_mealtypes)
        self.assertEqual(response.json()['results'][0]['breakfast'], True)

        url = '/recipes/mealtypes/?page=2'

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_mealtypes - 10)

    def test_get_detail(self):
        url = '/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=self.first_meal_type.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        response = self.client.get('/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=100))
        self.assertEqual(response.status_code, 404)

    def test_post(self):
        url = '/recipes/mealtypes/'

        data = {
            'lunch': True,
        }

        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['breakfast'], False)
        self.assertEqual(response.json()['brunch'], False)
        self.assertEqual(response.json()['dinner'], False)
        self.assertEqual(response.json()['lunch'], data['lunch'])

        self.assertEqual(RecipeMealType.objects.count(), self.total_mealtypes + 1)

    def test_patch_detail(self):
        url = '/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=self.first_meal_type.pk)

        data = {
            'breakfast': False,
            'lunch': True,
        }
        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        meal_type = RecipeMealType.objects.get(pk=self.first_meal_type.pk)

        self.assertEqual(meal_type.breakfast, data['breakfast'])
        self.assertEqual(meal_type.lunch, data['lunch'])

    def test_delete_detail(self):
        url = '/recipes/mealtypes/{mealtype_pk}/'.format(mealtype_pk=self.first_meal_type.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        self.assertEqual(RecipeMealType.objects.count(), self.total_mealtypes - 1)

class DietaryprefernceViewsTestCase(TestCase):
    def setUp(self):
        self.total_dietarypreferences = 15

        for x in range(0, self.total_dietarypreferences):
            dietary_preference = get_demo_dietarypreference()
            if x == 0:
                self.first_dietary_preference = dietary_preference


    def test_get_list(self):
        url = '/recipes/dietarypreferences/'

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), 10)
        self.assertEqual(response.json()['count'], self.total_dietarypreferences)
        self.assertEqual(response.json()['results'][0]['vegan'], True)

        url = '/recipes/dietarypreferences/?page=2'

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['results']), self.total_dietarypreferences - 10)

    def test_get_detail(self):
        url = '/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=self.first_dietary_preference.pk)

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['url'].endswith(url))

        response = self.client.get('/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=100))
        self.assertEqual(response.status_code, 404)

    def test_post(self):
        url = '/recipes/dietarypreferences/'

        data = {
            'vegan': True,
        }

        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['vegan'], True)
        self.assertEqual(response.json()['glutenfree'], False)

        self.assertEqual(RecipeDietaryPreference.objects.count(), self.total_dietarypreferences + 1)

    def test_patch_detail(self):
        url = '/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=self.first_dietary_preference.pk)

        data = {
            'vegan': False,
            'glutenfree': True,
        }
        response = self.client.patch(url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        dietary_preference = RecipeDietaryPreference.objects.get(pk=self.first_dietary_preference.pk)

        self.assertEqual(dietary_preference.vegan, data['vegan'])
        self.assertEqual(dietary_preference.glutenfree, data['glutenfree'])

    def test_delete_detail(self):
        url = '/recipes/dietarypreferences/{dietarypreference_pk}/'.format(dietarypreference_pk=self.first_dietary_preference.pk)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        self.assertEqual(RecipeDietaryPreference.objects.count(), self.total_dietarypreferences - 1)
