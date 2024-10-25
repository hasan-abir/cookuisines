from django.test import TestCase, RequestFactory
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer, RecipeInstructionSerializer, RecipeMealtypeSerializer, RecipeDietarypreferenceSerializer
from .utils import get_demo_recipe, get_demo_mealtype, get_demo_dietarypreference
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
            'image_url': 'http://imagekit.io/imageurl',
            'meal_type': get_demo_mealtype().pk,
            'dietary_preference': get_demo_dietarypreference().pk
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
        data['meal_type'] = 123
        data['dietary_preference'] = 123
        
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['title'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['preparation_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['cooking_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['image_url'][0]), 'Enter a valid URL.')
        self.assertEqual(str(serializer.errors['image_id'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['meal_type'][0]), 'Invalid pk "123" - object does not exist.')
        self.assertEqual(str(serializer.errors['dietary_preference'][0]), 'Invalid pk "123" - object does not exist.')

    def test_serializer_save(self):
        meal_type = get_demo_mealtype()
        dietary_preference = get_demo_dietarypreference()
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'difficulty': 'medium',
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl',
            'meal_type': meal_type.pk,
            'dietary_preference': dietary_preference.pk
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
        self.assertTrue(serializer.data['ingredients'].endswith('/recipes/{recipe_pk}/ingredients/'.format(recipe_pk=instance.pk)))
        self.assertTrue(serializer.data['instructions'].endswith('/recipes/{recipe_pk}/instructions/'.format(recipe_pk=instance.pk)))
        self.assertEqual(serializer.data['of_mealtype']['breakfast'], meal_type.breakfast)
        self.assertEqual(serializer.data['of_mealtype']['brunch'], meal_type.brunch)
        self.assertEqual(serializer.data['of_mealtype']['lunch'], meal_type.lunch)
        self.assertEqual(serializer.data['of_mealtype']['dinner'], meal_type.dinner)
        self.assertEqual(serializer.data['of_dietarypreference']['vegan'], dietary_preference.vegan)
        self.assertEqual(serializer.data['of_dietarypreference']['glutenfree'], dietary_preference.glutenfree)

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

class RecipeInstructionSerializerTestCase(TestCase):
    def test_serializer_validation(self):
        data = {
            'step': 'Step 1',
            'recipe': get_demo_recipe().pk
        }
        serializer = RecipeInstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['step'] = ''
        data['recipe'] = 123
        
        serializer = RecipeInstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['step'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['recipe'][0]), 'Invalid pk "123" - object does not exist.')
    
    def test_serializer_save(self):
        data = {
            'step': 'Step 1',
            'recipe': get_demo_recipe().pk
        }
        serializer = RecipeInstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeInstructionSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=instance.recipe.pk, instruction_pk=instance.pk)))
        self.assertEqual(serializer.data['step'], data['step'])
        self.assertTrue(serializer.data['of_recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))

class RecipeMealtypeSerializerTestCase(TestCase):
    def test_serializer_validation(self):
        data = {
            'breakfast': True,
            'brunch': False,
            'lunch': True,
            'dinner': False
        }
        serializer = RecipeMealtypeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['breakfast'] = 123
        
        serializer = RecipeMealtypeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['breakfast'][0]), 'Must be a valid boolean.')
    
    def test_serializer_save(self):
        data = {
            'breakfast': True,
            'brunch': False,
            'lunch': True,
            'dinner': False
        }
        serializer = RecipeMealtypeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeMealtypeSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/mealtypes/{pk}/'.format(pk=instance.pk)))
        self.assertEqual(serializer.data['breakfast'], data['breakfast'])
        self.assertEqual(serializer.data['brunch'], data['brunch'])
        self.assertEqual(serializer.data['lunch'], data['lunch'])
        self.assertEqual(serializer.data['dinner'], data['dinner'])

class RecipeDietarypreferenceSerializerTestCase(TestCase):
    def test_serializer_validation(self):
        data = {
            'vegan': True,
            'glutenfree': False,
        }
        serializer = RecipeDietarypreferenceSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['vegan'] = 123
        
        serializer = RecipeDietarypreferenceSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['vegan'][0]), 'Must be a valid boolean.')
    
    def test_serializer_save(self):
        data = {
            'vegan': True,
            'glutenfree': False,
        }
        serializer = RecipeDietarypreferenceSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeDietarypreferenceSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/dietarypreferences/{pk}/'.format(pk=instance.pk)))
        self.assertEqual(serializer.data['vegan'], data['vegan'])
        self.assertEqual(serializer.data['glutenfree'], data['glutenfree'])
