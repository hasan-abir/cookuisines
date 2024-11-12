from django.test import TestCase
from recipes.models import Recipe, Ingredient, Instruction, MealType, DietaryPreference
from .utils import get_demo_recipe, get_demo_user, get_demo_mealtype, get_demo_dietarypreference
from django.db.utils import IntegrityError

# Create your tests here.
class IngredientTestCase(TestCase):
    def test_default_values(self):
        data = {
            'name': 'Ingredient 1',
            'quantity': '2 spoon',
            'recipe': get_demo_recipe(get_demo_user())
        }
        recipe_ingredient = Ingredient.objects.create(**data)

        saved_recipe_ingredients = Ingredient.objects.get(pk=recipe_ingredient.pk)
        self.assertEqual(saved_recipe_ingredients.name, recipe_ingredient.name)
        self.assertEqual(saved_recipe_ingredients.quantity, recipe_ingredient.quantity)
        self.assertEqual(saved_recipe_ingredients.recipe.pk, recipe_ingredient.recipe.pk)
        self.assertTrue(saved_recipe_ingredients.created_at)
        self.assertTrue(saved_recipe_ingredients.updated_at)

class InstructionTestCase(TestCase):
    def test_default_values(self):
        data = {
            'step': 'Instruction 1',
            'recipe': get_demo_recipe(get_demo_user())
        }
        recipe_instruction = Instruction.objects.create(**data)

        saved_recipe_instructions = Instruction.objects.get(pk=recipe_instruction.pk)
        self.assertEqual(saved_recipe_instructions.step, recipe_instruction.step)
        self.assertEqual(saved_recipe_instructions.recipe.pk, recipe_instruction.recipe.pk)
        self.assertTrue(saved_recipe_instructions.created_at)
        self.assertTrue(saved_recipe_instructions.updated_at)

class MealTypeTestCase(TestCase):
    def test_default_values(self):
        # Extra recipe just so that the pks don't compare with 1s
        get_demo_recipe(get_demo_user('placeholder'))

        recipe = get_demo_recipe(get_demo_user())
        data = {
            'breakfast': True,
            'brunch': False,
            'lunch': True,
            'dinner': False,
            'recipe': recipe
        }
        recipe_mealtype = MealType.objects.create(**data)

        saved_recipe_mealtype = MealType.objects.get(pk=recipe_mealtype.pk)
        self.assertEqual(saved_recipe_mealtype.pk, recipe.pk)
        self.assertEqual(saved_recipe_mealtype.breakfast, recipe_mealtype.breakfast)
        self.assertEqual(saved_recipe_mealtype.brunch, recipe_mealtype.brunch)
        self.assertEqual(saved_recipe_mealtype.lunch, recipe_mealtype.lunch)
        self.assertEqual(saved_recipe_mealtype.dinner, recipe_mealtype.dinner)
        self.assertEqual(saved_recipe_mealtype.recipe.pk, recipe_mealtype.recipe.pk)
        self.assertTrue(saved_recipe_mealtype.created_at)
        self.assertTrue(saved_recipe_mealtype.updated_at)

    def test_duplicate_values(self):
        recipe = get_demo_recipe(get_demo_user())
        get_demo_mealtype(recipe)

        data = {
            'breakfast': True,
            'brunch': False,
            'lunch': True,
            'dinner': False,
            'recipe': recipe
        }

        with self.assertRaises(IntegrityError):
            MealType.objects.create(**data)

class DietaryPreferenceTestCase(TestCase):
    def test_default_values(self):
        # Extra recipe just so that the pks don't compare with 1s
        get_demo_recipe(get_demo_user('placeholder'))

        recipe = get_demo_recipe(get_demo_user())
        
        data = {
            'vegan': True,
            'glutenfree': False,
            'recipe': recipe
        }
        recipe_dietarypreference = DietaryPreference.objects.create(**data)

        saved_recipe_dietarypreference = DietaryPreference.objects.get(pk=recipe_dietarypreference.pk)
        self.assertEqual(saved_recipe_dietarypreference.pk, recipe.pk)
        self.assertEqual(saved_recipe_dietarypreference.vegan, recipe_dietarypreference.vegan)
        self.assertEqual(saved_recipe_dietarypreference.glutenfree, recipe_dietarypreference.glutenfree)
        self.assertEqual(saved_recipe_dietarypreference.recipe.pk, recipe_dietarypreference.recipe.pk)
        self.assertTrue(saved_recipe_dietarypreference.created_at)
        self.assertTrue(saved_recipe_dietarypreference.updated_at)

    def test_duplicate_values(self):
        recipe = get_demo_recipe(get_demo_user())
        get_demo_dietarypreference(recipe)

        data = {
            'vegan': True,
            'glutenfree': False,
            'recipe': recipe
        }

        with self.assertRaises(IntegrityError):
            DietaryPreference.objects.create(**data)

class RecipeTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()
    def test_default_values(self):
        recipe = get_demo_recipe(self.user)

        saved_recipe = Recipe.objects.get(pk=recipe.pk)
        self.assertEqual(saved_recipe.title, recipe.title)
        self.assertEqual(saved_recipe.preparation_time, recipe.preparation_time)
        self.assertEqual(saved_recipe.cooking_time, recipe.cooking_time)
        self.assertEqual(saved_recipe.difficulty, recipe.difficulty)
        self.assertEqual(saved_recipe.image_id, recipe.image_id)
        self.assertEqual(saved_recipe.image_url, recipe.image_url)
        self.assertEqual(saved_recipe.created_by.pk, recipe.created_by.pk)

