from rest_framework import serializers
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeDietaryPreference, RecipeMealType
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    meal_type = serializers.PrimaryKeyRelatedField(queryset=RecipeMealType.objects.all(), write_only=True)
    of_mealtype = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['url', 'title', 'preparation_time', 'cooking_time', 'difficulty', 'image_id', 'image_url', 'meal_type', 'of_mealtype']

    def get_of_mealtype(self, obj):
        return {
            'breakfast': obj.meal_type.breakfast,
            'brunch': obj.meal_type.brunch,
            'lunch': obj.meal_type.lunch,
            'dinner': obj.meal_type.dinner
        }

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

    recipe = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all(), write_only=True)
    of_recipe = serializers.HyperlinkedIdentityField(view_name='recipe-detail')

    class Meta:
        model = RecipeIngredient
        fields = ['url', 'name', 'quantity', 'recipe', 'of_recipe']

class RecipeInstructionSerializer(NestedHyperlinkedModelSerializer):
    parent_lookup_kwargs = {
		'recipe_pk': 'recipe__pk',
	}

    recipe = serializers.PrimaryKeyRelatedField(queryset=Recipe.objects.all(), write_only=True)
    of_recipe = serializers.HyperlinkedIdentityField(view_name='recipe-detail')

    class Meta:
        model = RecipeInstruction
        fields = ['url', 'step', 'recipe', 'of_recipe']