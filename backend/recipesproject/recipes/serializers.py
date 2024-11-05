from rest_framework import serializers
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeDietaryPreference, RecipeMealType
from django.contrib.auth.models import User
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer
from drf_spectacular.utils import extend_schema_field

class OfMealtypeSerializer(serializers.ModelSerializer):
    class Meta:
            model = RecipeMealType
            fields = ['breakfast', 'brunch', 'lunch', 'dinner']

class OfDietarypreferenceSerializer(serializers.ModelSerializer):
    class Meta:
            model = RecipeDietaryPreference
            fields = ['vegan', 'glutenfree']

class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    meal_type = serializers.SerializerMethodField()
    dietary_preference = serializers.SerializerMethodField()
    ingredients = serializers.HyperlinkedIdentityField(
        view_name='recipeingredient-list',
        lookup_url_kwarg='recipe_pk'
    )
    instructions = serializers.HyperlinkedIdentityField(
        view_name='recipeinstruction-list',
        lookup_url_kwarg='recipe_pk'
    )
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    created_by_username = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Recipe
        fields = ['url', 'title', 'preparation_time', 'cooking_time', 'difficulty', 'image_id', 'image_url', 'ingredients', 'instructions', 'meal_type', 'dietary_preference', 'created_by', 'created_by_username']

    @extend_schema_field(OfDietarypreferenceSerializer)
    def get_dietary_preference(self, obj):
        try:
            return OfDietarypreferenceSerializer(RecipeDietaryPreference.objects.get(recipe=obj.pk)).data
        except RecipeDietaryPreference.DoesNotExist:
             return {}
    
    @extend_schema_field(OfMealtypeSerializer)
    def get_meal_type(self, obj):
        try:
            return OfMealtypeSerializer(RecipeMealType.objects.get(recipe=obj.pk)).data
        except RecipeMealType.DoesNotExist:
             return {}
        

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

class RecipeIngredientSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
		'recipe_pk': 'recipe__pk',
	}

    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
        model = RecipeIngredient
        fields = ['url', 'name', 'quantity', 'recipe']

class RecipeInstructionSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
		'recipe_pk': 'recipe__pk',
	}

    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
        model = RecipeInstruction
        fields = ['url', 'step', 'recipe']

class RecipeMealtypeSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
		'recipe_pk': 'recipe__pk',
	}
    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
            model = RecipeMealType
            fields = ['url', 'breakfast', 'brunch', 'lunch', 'dinner', 'recipe']

class RecipeDietarypreferenceSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
		'recipe_pk': 'recipe__pk',
	}
    recipe = serializers.HyperlinkedRelatedField(view_name='recipe-detail', queryset=Recipe.objects.all())

    class Meta:
            model = RecipeDietaryPreference
            fields = ['url', 'vegan', 'glutenfree', 'recipe']