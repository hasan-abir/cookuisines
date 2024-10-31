from rest_framework import serializers
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeDietaryPreference, RecipeMealType
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
    meal_type = serializers.HyperlinkedRelatedField(view_name='recipemealtype-detail', queryset=RecipeMealType.objects.all(), write_only=True)
    meal_type_obj = serializers.SerializerMethodField()
    dietary_preference = serializers.HyperlinkedRelatedField(view_name='recipedietarypreference-detail', queryset=RecipeDietaryPreference.objects.all(), write_only=True)
    dietary_preference_obj = serializers.SerializerMethodField()
    ingredients = serializers.HyperlinkedIdentityField(
        view_name='recipeingredient-list',
        lookup_url_kwarg='recipe_pk'
    )
    instructions = serializers.HyperlinkedIdentityField(
        view_name='recipeinstruction-list',
        lookup_url_kwarg='recipe_pk'
    )

    class Meta:
        model = Recipe
        fields = ['url', 'title', 'preparation_time', 'cooking_time', 'difficulty', 'image_id', 'image_url', 'ingredients', 'instructions', 'meal_type', 'meal_type_obj', 'dietary_preference', 'dietary_preference_obj']

    @extend_schema_field(OfDietarypreferenceSerializer)
    def get_dietary_preference_obj(self, obj):
        return OfDietarypreferenceSerializer(obj.dietary_preference).data
    
    @extend_schema_field(OfMealtypeSerializer)
    def get_meal_type_obj(self, obj):
        return OfMealtypeSerializer(obj.meal_type).data

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

class RecipeMealtypeSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='recipemealtype-detail')

    class Meta:
            model = RecipeMealType
            fields = ['url', 'breakfast', 'brunch', 'lunch', 'dinner']

class RecipeDietarypreferenceSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='recipedietarypreference-detail')

    class Meta:
            model = RecipeDietaryPreference
            fields = ['url', 'vegan', 'glutenfree']