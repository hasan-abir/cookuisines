from django.test import TestCase, RequestFactory
from unittest.mock import patch
from rest_framework.serializers import ValidationError
from recipes.serializers import RecipeSerializer, IngredientSerializer, InstructionSerializer, MealtypeSerializer, DietarypreferenceSerializer
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
            'created_by': self.user.pk,
            'image': generate_image('cat_small.jpg')
        }
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['title'] = ''
        data['preparation_time'] = timedelta(hours=0, minutes=0, seconds=0)
        data['cooking_time'] = timedelta(hours=0, minutes=0, seconds=0)
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

    @patch('recipes.serializers.upload_image')
    def test_serializer_save(self, mock_upload_image):
        mock_upload = mock_imagekit_upload(mock_upload_image)

        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
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
        self.assertTrue(serializer.data['ingredients'].endswith('/recipes/{recipe_pk}/ingredients/'.format(recipe_pk=instance.pk)))
        self.assertTrue(serializer.data['instructions'].endswith('/recipes/{recipe_pk}/instructions/'.format(recipe_pk=instance.pk)))
        self.assertEqual(serializer.data['created_by_username'], self.user.username)
        self.assertTrue(serializer.data['meal_type'].endswith('/recipes/mealtypes/{recipe_pk}/'.format(recipe_pk=instance.pk)))
        self.assertTrue(serializer.data['dietary_preference'].endswith('/recipes/dietarypreferences/{recipe_pk}/'.format(recipe_pk=instance.pk)))

    @patch('recipes.serializers.upload_image')
    def test_imagekit_upload(self, mock_upload_image):
        mock_upload_with_error = mock_imagekit_upload(mock_upload_image, raise_exception=True)
        
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
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

class IngredientSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()

    def test_serializer_validation(self):
        data = {
            'name': 'Ingredient 1',
            'quantity': '2 spoon',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = IngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['name'] = ''
        data['quantity'] = ''
        data['recipe'] = 'http://testserver/recipes/{pk}/'.format(pk=123)
        
        serializer = IngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['name'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['quantity'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['recipe'][0]), 'Invalid hyperlink - Object does not exist.')
    
    def test_serializer_save(self):
        data = {
            'name': 'Ingredient 1',
            'quantity': '2 spoon',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = IngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = IngredientSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=instance.recipe.pk, ingredient_pk=instance.pk)))
        self.assertEqual(serializer.data['name'], data['name'])
        self.assertEqual(serializer.data['quantity'], data['quantity'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))

class InstructionSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()
    def test_serializer_validation(self):
        data = {
            'step': 'Step 1',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = InstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['step'] = ''
        data['recipe'] = 'http://testserver/recipes/{pk}/'.format(pk=123)
        
        serializer = InstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['step'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['recipe'][0]), 'Invalid hyperlink - Object does not exist.')
    
    def test_serializer_save(self):
        data = {
            'step': 'Step 1',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = InstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = InstructionSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=instance.recipe.pk, instruction_pk=instance.pk)))
        self.assertEqual(serializer.data['step'], data['step'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))

class MealtypeSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()

    def test_serializer_validation(self):
        data = {
            'breakfast': True,
            'brunch': False,
            'lunch': True,
            'dinner': False,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = MealtypeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['breakfast'] = 123
        
        serializer = MealtypeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['breakfast'][0]), 'Must be a valid boolean.')
    
    def test_serializer_save(self):
        data = {
            'breakfast': True,
            'brunch': False,
            'lunch': True,
            'dinner': False,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = MealtypeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = MealtypeSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/mealtypes/{mealtype_pk}/'.format(recipe_pk=instance.recipe.pk, mealtype_pk=instance.pk)))
        self.assertEqual(serializer.data['breakfast'], data['breakfast'])
        self.assertEqual(serializer.data['brunch'], data['brunch'])
        self.assertEqual(serializer.data['lunch'], data['lunch'])
        self.assertEqual(serializer.data['dinner'], data['dinner'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))

class DietarypreferenceSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()

    def test_serializer_validation(self):
        data = {
            'vegan': True,
            'glutenfree': False,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = DietarypreferenceSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['vegan'] = 123
        
        serializer = DietarypreferenceSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['vegan'][0]), 'Must be a valid boolean.')
    
    def test_serializer_save(self):
        data = {
            'vegan': True,
            'glutenfree': False,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = DietarypreferenceSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = DietarypreferenceSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/dietarypreferences/{dietarypreference_pk}/'.format(recipe_pk=instance.recipe.pk, dietarypreference_pk=instance.pk)))
        self.assertEqual(serializer.data['vegan'], data['vegan'])
        self.assertEqual(serializer.data['glutenfree'], data['glutenfree'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))
