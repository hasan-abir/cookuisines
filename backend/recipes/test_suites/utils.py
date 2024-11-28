from recipes.models import Recipe, MealType, DietaryPreference, Ingredient, Instruction
from unittest.mock import patch, MagicMock
from rest_framework.serializers import ValidationError
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

def mock_imagekit_upload(mock_func, raise_exception=False):
    image_info = {'file_id': '123', 'url': 'http://testserver/image/123'}
    mock_result = MagicMock()
    mock_result.file_id = image_info['file_id']
    mock_result.url = image_info['url']

    if raise_exception:
        mock_func.side_effect = ValidationError({'image': 'Image upload failed.'})
    else:
        mock_func.return_value = mock_result

    return mock_func

def mock_imagekit_delete(mock_func, raise_exception=False):
    mock_result = MagicMock()

    if raise_exception:
        mock_func.side_effect = ValidationError({'image': 'Image upload failed.'})
    else:
        mock_func.return_value = mock_result

    return mock_func