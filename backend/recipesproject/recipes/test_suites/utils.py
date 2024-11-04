from recipes.models import Recipe, RecipeMealType, RecipeDietaryPreference, RecipeIngredient, RecipeInstruction
from django.contrib.auth.models import User
from datetime import timedelta

def get_demo_mealtype():
    return RecipeMealType.objects.create(breakfast=True, brunch=True)
def get_demo_dietarypreference():
    return RecipeDietaryPreference.objects.create(vegan=True)

def get_demo_ingredient(recipe):
    return RecipeIngredient.objects.create(recipe=recipe, name='Example Ingredient', quantity='2 spoons')

def get_demo_instruction(recipe):
    return RecipeInstruction.objects.create(recipe=recipe, step='Example Instruction')

def get_demo_user(username = 'hasan_abir', password = 'testtest'):
    return User.objects.create_user(username=username, email='hasan_abir@test.com', password=password)

def get_demo_recipe(user):
    data = {
            'title': 'Example Recipe',
            'preparation_time': timedelta(hours=0, minutes=1, seconds=30),
            'cooking_time': timedelta(hours=0, minutes=1, seconds=30),
            'difficulty': 'Easy',
            'image_id': '123',
            'image_url': 'http://test.com/images/123',
            'meal_type': get_demo_mealtype(),
            'dietary_preference': get_demo_dietarypreference(),
            'created_by': user
        }
    return Recipe.objects.create(**data)