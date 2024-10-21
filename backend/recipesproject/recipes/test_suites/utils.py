from recipes.models import Recipe
from datetime import timedelta

def get_demo_recipe():
    data = {
            'title': 'Example Recipe',
            'preparation_time': timedelta(hours=0, minutes=1, seconds=30),
            'cooking_time': timedelta(hours=0, minutes=1, seconds=30),
            'difficulty': 'Easy',
            'image_id': '123',
            'image_url': 'http://test.com/images/123',
        }
    return Recipe.objects.create(**data)