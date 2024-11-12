from rest_framework import serializers
from recipes.models import Recipe, Ingredient, Instruction, DietaryPreference, MealType
from django.contrib.auth.models import User
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    ingredients = serializers.HyperlinkedIdentityField(
        view_name='recipeingredient-list',
        lookup_url_kwarg='recipe_pk'
    )
    instructions = serializers.HyperlinkedIdentityField(
        view_name='recipeinstruction-list',
        lookup_url_kwarg='recipe_pk'
    )
    meal_type = serializers.HyperlinkedIdentityField(view_name='recipemealtype-detail')
    dietary_preference = serializers.HyperlinkedIdentityField(view_name='recipedietarypreference-detail')
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Recipe
        fields = ['url', 'title', 'preparation_time', 'cooking_time', 'difficulty', 'image_id', 'image_url', 'ingredients', 'instructions', 'meal_type', 'dietary_preference', 'created_by', 'created_by_username']

    def validate_preparation_time(self, value):
        if(value.total_seconds() > 0):
            return value
        else:
            raise serializers.ValidationError("Duration cannot be zero.")
        
    def validate_cooking_time(self, value):
        if(value.total_seconds() > 0):
            return value
        else:
            raise serializers.ValidationError("Duration cannot be zero.")

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

class MealtypeSerializer(serializers.HyperlinkedModelSerializer):
    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
            model = MealType
            fields = ['url', 'breakfast', 'brunch', 'lunch', 'dinner', 'recipe']
            extra_kwargs = {
                'url': {'view_name': 'recipemealtype-detail'},
            }

class DietarypreferenceSerializer(serializers.HyperlinkedModelSerializer):
    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
            model = DietaryPreference
            fields = ['url', 'vegan', 'glutenfree', 'recipe']
            extra_kwargs = {
                'url': {'view_name': 'recipedietarypreference-detail'},
            }