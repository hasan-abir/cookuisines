from django.test import TestCase
from recipes.models import Recipe
from .utils import get_demo_recipe, get_demo_user
from django.db.utils import IntegrityError

# Create your tests here.
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
        self.assertEqual(str(saved_recipe.meal_types), 'Breakfast, Lunch')
        self.assertEqual(str(saved_recipe.dietary_preferences), 'Vegan')
        self.assertEqual(saved_recipe.instruction_steps, recipe.instruction_steps)
        self.assertEqual(saved_recipe.ingredient_list, recipe.ingredient_list)
        self.assertEqual(saved_recipe.image_id, recipe.image_id)
        self.assertEqual(saved_recipe.image_url, recipe.image_url)
        self.assertEqual(saved_recipe.created_by.pk, recipe.created_by.pk)

