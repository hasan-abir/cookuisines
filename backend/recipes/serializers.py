from rest_framework import serializers
from recipes.models import Recipe, Ingredient, Instruction, DietaryPreference, MealType
from django.contrib.auth.models import User
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer
from recipes.services import upload_image, delete_image

class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    ingredients = serializers.HyperlinkedIdentityField(
        view_name='recipeingredient-list',
        lookup_url_kwarg='recipe_pk'
    )
    instructions = serializers.HyperlinkedIdentityField(
        view_name='recipeinstruction-list',
        lookup_url_kwarg='recipe_pk'
    )
    image = serializers.ImageField(write_only=True)
    image_id = serializers.CharField(read_only=True)
    image_url = serializers.CharField(read_only=True)
    meal_type = serializers.HyperlinkedIdentityField(view_name='recipemealtype-detail')
    dietary_preference = serializers.HyperlinkedIdentityField(view_name='recipedietarypreference-detail')
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Recipe
        fields = ['url', 'title', 'preparation_time', 'cooking_time', 'difficulty', 'ingredients', 'instructions', 'meal_type', 'dietary_preference', 'created_by_username', 'image', 'image_id', 'image_url']

    def validate_image(self, value):
        max_mb = 2
        max_file_size = max_mb * 1024 * 1024
        if value.size <= max_file_size:
            return value
        else:
            raise serializers.ValidationError('Image size has to be 2mb or less')

    def validate_preparation_time(self, value):
        if value.total_seconds() > 0:
            return value
        else:
            raise serializers.ValidationError('Duration cannot be zero.')
        
    def validate_cooking_time(self, value):
        if value.total_seconds() > 0:
            return value
        else:
            raise serializers.ValidationError('Duration cannot be zero.')
        
    def save(self, **kwargs):
        # Upload the image to cloud
        if 'image' in self.validated_data or hasattr(self.validated_data, 'image'):
                result = upload_image(self.validated_data['image'])

                if self.instance:
                    delete_image(file_id=self.instance.image_id)

                self.validated_data.pop('image')

                self.validated_data['image_id'] = result.file_id
                self.validated_data['image_url'] = result.url
        
        return super().save(**kwargs)
    
class RecipeErrorsSerializer(serializers.Serializer):
    title = serializers.ListField()
    preparation_time = serializers.ListField()
    cooking_time = serializers.ListField()
    difficulty = serializers.ListField()
    image = serializers.ListField()
    
class IngredientSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
		'recipe_pk': 'recipe__pk',
	}

    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
        model = Ingredient
        fields = ['url', 'name', 'quantity', 'recipe']
        extra_kwargs = {
            'url': {'view_name': 'recipeingredient-detail'},
        }

class IngredientErrorsSerializer(serializers.Serializer):
    name = serializers.ListField()
    quantity = serializers.ListField()
    recipe = serializers.ListField()

class InstructionSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
		'recipe_pk': 'recipe__pk',
	}

    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
        model = Instruction
        fields = ['url', 'step', 'recipe']
        extra_kwargs = {
            'url': {'view_name': 'recipeinstruction-detail'},
        }

class InstructionErrorsSerializer(serializers.Serializer):
    step = serializers.ListField()
    recipe = serializers.ListField()

class MealtypeSerializer(serializers.HyperlinkedModelSerializer):
    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
            model = MealType
            fields = ['url', 'breakfast', 'brunch', 'lunch', 'dinner', 'recipe']
            extra_kwargs = {
                'url': {'view_name': 'recipemealtype-detail'},
            }

class MealtypeCreateErrorsSerializer(serializers.Serializer):
    recipe = serializers.ListField() 

class MealtypeErrorsSerializer(serializers.Serializer):
    breakfast = serializers.ListField() 
    brunch = serializers.ListField() 
    lunch = serializers.ListField() 
    dinner = serializers.ListField() 

class DietarypreferenceSerializer(serializers.HyperlinkedModelSerializer):
    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
            model = DietaryPreference
            fields = ['url', 'vegan', 'glutenfree', 'recipe']
            extra_kwargs = {
                'url': {'view_name': 'recipedietarypreference-detail'},
            }

class DietarypreferenceCreateErrorsSerializer(serializers.Serializer):
    recipe = serializers.ListField() 

class DietarypreferenceErrorsSerializer(serializers.Serializer):
    vegan = serializers.ListField() 
    glutenfree = serializers.ListField() 

class BasicErrorSerializer(serializers.Serializer):
    detail = serializers.CharField()