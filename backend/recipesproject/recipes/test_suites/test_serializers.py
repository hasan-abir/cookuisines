from django.test import TestCase, RequestFactory
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer, RecipeInstructionSerializer, RecipeMealtypeSerializer, RecipeDietarypreferenceSerializer
from .utils import get_demo_recipe, get_demo_user, get_demo_mealtype, get_demo_dietarypreference
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
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl',
            'created_by': self.user.pk
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
        data['created_by'] = 123
        
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['title'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['preparation_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['cooking_time'][0]), 'Duration cannot be zero.')
        self.assertEqual(str(serializer.errors['image_url'][0]), 'Enter a valid URL.')
        self.assertEqual(str(serializer.errors['image_id'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['created_by'][0]), 'Invalid pk "123" - object does not exist.')

    def test_serializer_save(self):
        
        data = {
            'title': 'Recipe 1',
            'preparation_time': timedelta(hours=0, minutes=2, seconds=3),
            'cooking_time': timedelta(hours=0, minutes=3, seconds=2),
            'difficulty': 'medium',
            'image_id': 'Imagekit ID',
            'image_url': 'http://imagekit.io/imageurl',
            'created_by': self.user.pk
        }
        serializer = RecipeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        meal_type = get_demo_mealtype(instance)
        dietary_preference = get_demo_dietarypreference(instance)

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
        self.assertEqual(serializer.data['meal_type']['breakfast'], meal_type.breakfast)
        self.assertEqual(serializer.data['meal_type']['brunch'], meal_type.brunch)
        self.assertEqual(serializer.data['meal_type']['lunch'], meal_type.lunch)
        self.assertEqual(serializer.data['meal_type']['dinner'], meal_type.dinner)
        self.assertEqual(serializer.data['dietary_preference']['vegan'], dietary_preference.vegan)
        self.assertEqual(serializer.data['dietary_preference']['glutenfree'], dietary_preference.glutenfree)
        self.assertEqual(serializer.data['created_by_username'], self.user.username)
        

class RecipeIngredientSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()

    def test_serializer_validation(self):
        data = {
            'name': 'Ingredient 1',
            'quantity': '2 spoon',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = RecipeIngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['name'] = ''
        data['quantity'] = ''
        data['recipe'] = 'http://testserver/recipes/{pk}/'.format(pk=123)
        
        serializer = RecipeIngredientSerializer(data=data)
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
        serializer = RecipeIngredientSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeIngredientSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/ingredients/{ingredient_pk}/'.format(recipe_pk=instance.recipe.pk, ingredient_pk=instance.pk)))
        self.assertEqual(serializer.data['name'], data['name'])
        self.assertEqual(serializer.data['quantity'], data['quantity'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))

class RecipeInstructionSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()
    def test_serializer_validation(self):
        data = {
            'step': 'Step 1',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = RecipeInstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        data['step'] = ''
        data['recipe'] = 'http://testserver/recipes/{pk}/'.format(pk=123)
        
        serializer = RecipeInstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, False)
        self.assertEqual(str(serializer.errors['step'][0]), 'This field may not be blank.')
        self.assertEqual(str(serializer.errors['recipe'][0]), 'Invalid hyperlink - Object does not exist.')
    
    def test_serializer_save(self):
        data = {
            'step': 'Step 1',
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = RecipeInstructionSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeInstructionSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/instructions/{instruction_pk}/'.format(recipe_pk=instance.recipe.pk, instruction_pk=instance.pk)))
        self.assertEqual(serializer.data['step'], data['step'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))

class RecipeMealtypeSerializerTestCase(TestCase):
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
            'dinner': False,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = RecipeMealtypeSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeMealtypeSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/mealtypes/{mealtype_pk}/'.format(recipe_pk=instance.recipe.pk, mealtype_pk=instance.pk)))
        self.assertEqual(serializer.data['breakfast'], data['breakfast'])
        self.assertEqual(serializer.data['brunch'], data['brunch'])
        self.assertEqual(serializer.data['lunch'], data['lunch'])
        self.assertEqual(serializer.data['dinner'], data['dinner'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))

class RecipeDietarypreferenceSerializerTestCase(TestCase):
    def setUp(self):
        self.user = get_demo_user()

    def test_serializer_validation(self):
        data = {
            'vegan': True,
            'glutenfree': False,
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
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
            'recipe': 'http://testserver/recipes/{pk}/'.format(pk=get_demo_recipe(self.user).pk)
        }
        serializer = RecipeDietarypreferenceSerializer(data=data)
        is_valid = serializer.is_valid()
        self.assertEqual(is_valid, True)

        instance = serializer.save()

        mock_request = RequestFactory().get('/mock/')
        serializer = RecipeDietarypreferenceSerializer(instance, context={'request': mock_request})
        self.assertTrue(serializer.data['url'].endswith('/recipes/{recipe_pk}/dietarypreferences/{dietarypreference_pk}/'.format(recipe_pk=instance.recipe.pk, dietarypreference_pk=instance.pk)))
        self.assertEqual(serializer.data['vegan'], data['vegan'])
        self.assertEqual(serializer.data['glutenfree'], data['glutenfree'])
        self.assertTrue(serializer.data['recipe'].endswith('/recipes/{recipe_pk}/'.format(recipe_pk=instance.recipe.pk)))
