from recipes.models import Recipe, MealType, DietaryPreference, Ingredient, Instruction
from django.contrib.auth.models import User
from datetime import timedelta
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

def generate_image(filename):
        # Create image object, then convert it to bytes
        image_io = BytesIO()
        image = Image.open('recipes/test_suites/sample_files/{name}'.format(name=filename))
        image.save(image_io, format='JPEG')
        image_io.name = filename
        image_io.seek(0)

        return SimpleUploadedFile(image_io.name, image_io.read(), 
            content_type='image/jpeg')

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