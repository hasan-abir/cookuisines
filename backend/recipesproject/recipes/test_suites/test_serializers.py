from django.test import TestCase, RequestFactory
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer
from .utils import get_demo_recipe
from datetime import timedelta

# Create your tests here.
class RecipeSerializerTestCase(TestCase):
    def test_serializer_validation(self):
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'difficulty': 'medium',
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
    def test_serializer_save(self):
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'difficulty': 'medium',
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl'
        }
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{pk}/'.format(pk=instance.pk)))
        self.assertEqual(serializer.data['title'], data['title'])
        self.assertEqual(serializer.data['preparation_time'], '00:02:03')
        self.assertEqual(serializer.data['cooking_time'], '00:03:02')
        self.assertEqual(serializer.data['difficulty'], data['difficulty'])
        self.assertEqual(serializer.data['image_id'], data['image_id'])
        self.assertEqual(serializer.data['image_url'], data['image_url'])

class RecipeIngredientSerializerTestCase(TestCase):
    def test_serializer_validation(self):
        data = {
            'name': 'Ingredient 1',
            'quantity': '2 spoon',
            'recipe': get_demo_recipe().pk
        }
        serializer = RecipeIngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['name'] = ''
        data['quantity'] = ''
        data['recipe'] = 123
        
        serializer = RecipeIngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['name'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['quantity'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['recipe'][0]), 'Invalid pk "123" - object does not exist.')
    
    def test_serializer_save(self):
        data = {
            'name': 'Ingredient 1',
            'quantity': '2 spoon',
            'recipe': get_demo_recipe().pk
        }
        serializer = RecipeIngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeIngredientSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=instance.recipe.pk, ingredient_pk=instance.pk)))
        self.assertEqual(serializer.data['name'], data['name'])
        self.assertEqual(serializer.data['quantity'], data['quantity'])
        self.assertTrue(serializer.data['of_recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))
