from django.test import TestCase
from recipes.serializers import RecipeSerializer
from .utils import get_demo_recipe
from datetime import timedelta

# Create your tests here.
class RecipeSerializerTestCase(TestCase):
    def test_serializer_validation(self):
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'difficulty': 'Medium',
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl'
        }
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['title'] = ''
        data['preparation_time'] = timedelta(hours=0, minutes=0, seconds=0)
        data['cooking_time'] = timedelta(hours=0, minutes=0, seconds=0)
        data['difficulty'] = 'Average'
        data['image_id'] = ''
        data['image_url'] = 'Url'
        
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['title'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['preparation_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['cooking_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['image_url'][0]), 'Enter a valid URL.')
        self.assertEqual(str(serializer.errors['image_id'][0]), 'This field may not be blank.')