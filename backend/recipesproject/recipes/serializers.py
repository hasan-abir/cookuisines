from rest_framework import serializers
from recipes.models import Recipe, RecipeIngredient
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

from django.urls import reverse

class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Recipe
        fields = ['url', 'title', 'preparation_time', 'cooking_time', 'difficulty', 'image_id', 'image_url']

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