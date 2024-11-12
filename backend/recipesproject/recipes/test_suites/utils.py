from recipes.models import Recipe, MealType, DietaryPreference, Ingredient, Instruction
from django.contrib.auth.models import User
from datetime import timedelta

def get_demo_mealtype(recipe):
    return MealType.objects.create(breakfast=True, brunch=True, recipe=recipe)
def get_demo_dietarypreference(recipe):
    return DietaryPreference.objects.create(vegan=True, recipe=recipe)

def get_demo_ingredient(recipe):
    return Ingredient.objects.create(recipe=recipe, name='Example Ingredient', quantity='2 spoons')

def get_demo_instruction(recipe):
    return Instruction.objects.create(recipe=recipe, step='Example Instruction')

def get_demo_user(username = 'hasan_abir', password = 'testtest'):
    return User.objects.create_user(username=username, email='hasan_abir@test.com', password=password)

def get_demo_recipe(user, title = 'Example Recipe', difficulty = 'Easy'):
    data = {
            'title': title,
            'preparation_time': timedelta(hours=0, minutes=1, seconds=30),
            'cooking_time': timedelta(hours=0, minutes=1, seconds=30),
            'difficulty': difficulty,
            'image_id': '123',
            'image_url': 'http://test.com/images/123',
            'created_by': user
        }
    return Recipe.objects.create(**data)