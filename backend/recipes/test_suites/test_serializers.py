from django.test import TestCase, RequestFactory
from unittest.mock import patch
from rest_framework.serializers import ValidationError
from recipes.serializers import RecipeSerializer
from .utils import get_demo_recipe, get_demo_user, generate_image, mock_imagekit_upload, mock_imagekit_delete
from datetime import timedelta

# Create your tests here.
class RecipeSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()

    def test_serializer_validation(self):
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'difficulty': 'medium',
            'meal_types': ['dinner'],
            'dietary_preferences': ['vegan'],
            'ingredient_list': 'Sugar 1tsp, Milk 1tsp, Flour 1tsp',
            'instruction_steps': 'Bop it, twist it, and I forgot the rest',
            'created_by': self.user.pk,
            'image': generate_image('cat_small.jpg')
        }
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['title'] = ''
        data['preparation_time'] = timedelta(hours=0, minutes=0, seconds=0)
        data['cooking_time'] = timedelta(hours=0, minutes=0, seconds=0)
        data['ingredient_list'] = '\n\n\n'
        data['instruction_steps'] = ' '
        
        data['difficulty'] = 'Average'
        data['created_by'] = 123
        data['image'] = generate_image('cat_big.jpg')
        
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['title'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['preparation_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['cooking_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['image'][0]), 'Image size has to be 2mb or less')
        self.assertEqual(str(serializer.errors['ingredient_list'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['instruction_steps'][0]), 'This field may not be blank.')

    @patch('recipes.serializers.upload_image')
    def test_serializer_save(self, mock_upload_image):
        mock_upload = mock_imagekit_upload(mock_upload_image)

        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'meal_types': ['dinner'],
            'dietary_preferences': ['glutenfree'],
            'ingredient_list': 'Sugar 1tsp\nMilk 1tsp\nFlour 1tsp',
            'instruction_steps': 'Bop it\nTwist it\nAnd I forgot the rest',
            'difficulty': 'medium',
            'image': generate_image('cat_small.jpg')
        }
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save(created_by=self.user)
        mock_upload.assert_called_once()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{pk}/'.format(pk=instance.pk)))
        self.assertEqual(serializer.data['title'], data['title'])
        self.assertEqual(serializer.data['preparation_time'], '00:02:03')
        self.assertEqual(serializer.data['cooking_time'], '00:03:02')
        self.assertEqual(serializer.data['difficulty'], data['difficulty'])
        self.assertEqual(serializer.data['image_id'], '123')
        self.assertEqual(serializer.data['image_url'], 'http://testserver/image/123')
        self.assertEqual(serializer.data['meal_types'], ['Dinner'])
        self.assertEqual(serializer.data['dietary_preferences'], ['Gluten free'])
        self.assertEqual(serializer.data['ingredient_list'], data['ingredient_list'].split('\n'))
        self.assertEqual(serializer.data['instruction_steps'], data['instruction_steps'].split('\n'))
        self.assertEqual(serializer.data['created_by_username'], self.user.username)

    @patch('recipes.serializers.upload_image')
    def test_imagekit_upload(self, mock_upload_image):
        mock_upload_with_error = mock_imagekit_upload(mock_upload_image, raise_exception=True)
        
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'meal_types': ['dinner'],
            'dietary_preferences': ['vegan'],
            'ingredient_list': 'Sugar 1tsp, Milk 1tsp, Flour 1tsp',
            'instruction_steps': 'Bop it, twist it, and I forgot the rest',
            'difficulty': 'medium',
            'image': generate_image('cat_small.jpg')
        }
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        
        with self.assertRaises(ValidationError) as context:
            serializer.save(created_by=self.user)

        mock_upload_with_error.assert_called_once()
        self.assertTrue(context.exception.detail['image'])
        self.assertEqual(str(context.exception.detail['image']), 'Image upload failed.')

    @patch('recipes.serializers.delete_image')
    @patch('recipes.serializers.upload_image')
    def test_imagekit_delete(self, mock_upload_image, mock_delete_image):
        mock_upload =  mock_imagekit_upload(mock_upload_image)
        mock_delete = mock_imagekit_delete(mock_delete_image)

        instance = get_demo_recipe(get_demo_user('hasan_abir_clone'))

        serializer = RecipeSerializer(instance=instance, data={'image': generate_image('cat_small.jpg')}, partial=True)
        serializer.is_valid()

        serializer.save()

        mock_delete.assert_called_once()
        mock_upload.assert_called_once()
        
        mock_upload.reset_mock()
        mock_delete.reset_mock()
        mock_upload =  mock_imagekit_upload(mock_upload_image)
        mock_delete_with_error = mock_imagekit_delete(mock_delete_image, raise_exception=True)

        serializer = RecipeSerializer(instance=instance, data={'image': generate_image('cat_small.jpg')}, partial=True)
        serializer.is_valid()

        with self.assertRaises(ValidationError) as context:
            serializer.save()

        mock_delete_with_error.assert_called_once()
        mock_upload.assert_called_once()
        self.assertTrue(context.exception.detail['image'])
        self.assertEqual(str(context.exception.detail['image']), 'Image upload failed.')

