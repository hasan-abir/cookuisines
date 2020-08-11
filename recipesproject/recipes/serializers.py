from rest_framework import serializers
from .models import Recipe, Ingredient, Step

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['name', ]

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['description', ]

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    steps = StepSerializer(many=True)
    username = serializers.SerializerMethodField("get_username")

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'cooking_time', 'published', 'creator', 'username', 'ingredients', 'steps']

    def get_username(self, obj):
        return obj.creator.username

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        steps_data = validated_data.pop('steps')

        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user

        recipe = Recipe.objects.create(creator=user, **validated_data)

        for ingredient in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient)

        for step in steps_data:
            Step.objects.create(recipe=recipe, **step)

        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        steps_data = validated_data.pop('steps')

        ingredients = (instance.ingredients).all()
        ingredients = list(ingredients)
        steps = (instance.steps).all()
        steps = list(steps)

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.cooking_time = validated_data.get('cooking_time', instance.cooking_time)
        
        instance.save()

        for ingredient_data in ingredients_data:
            ingredient = Ingredient(recipe=instance)

            if len(ingredients) > 0:
                ingredient = ingredients.pop(0)

            ingredient.name = ingredient_data.get('name', ingredient.name)

            ingredient.save()

        for step_data in steps_data:
            step = Step(recipe=instance)

            if len(steps) > 0:
                step = steps.pop(0)

            step.description = step_data.get('description', step.description)

            step.save()

        return instance




