from rest_framework import serializers
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeDietaryPreference, RecipeMealType
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    meal_type = serializers.PrimaryKeyRelatedField(queryset=RecipeMealType.objects.all(), write_only=True)
    of_mealtype = serializers.SerializerMethodField()
    dietary_preference = serializers.PrimaryKeyRelatedField(queryset=RecipeDietaryPreference.objects.all(), write_only=True)
    of_dietarypreference = serializers.SerializerMethodField()
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
        fields = ['url', 'title', 'preparation_time', 'cooking_time', 'difficulty', 'image_id', 'image_url', 'ingredients', 'instructions', 'meal_type', 'of_mealtype', 'dietary_preference', 'of_dietarypreference']

    def get_of_dietarypreference(self, obj):
        return {
            'vegan': obj.dietary_preference.vegan,
            'glutenfree': obj.dietary_preference.glutenfree
        }
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