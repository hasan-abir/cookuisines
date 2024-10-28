from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeMealType, RecipeDietaryPreference
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer, RecipeInstructionSerializer, RecipeMealtypeSerializer, RecipeDietarypreferenceSerializer

# Create your views here.
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeIngredientViewSet(ModelViewSet):
    serializer_class = RecipeIngredientSerializer

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']
        return RecipeIngredient.objects.filter(recipe=recipe_pk)

class RecipeInstructionViewSet(ModelViewSet):
    serializer_class = RecipeInstructionSerializer

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']
        return RecipeInstruction.objects.filter(recipe=recipe_pk)

class RecipeMealtypeViewSet(ModelViewSet):
    queryset = RecipeMealType.objects.all()
    serializer_class = RecipeMealtypeSerializer

class RecipeDietarypreferenceViewSet(ModelViewSet):
    queryset = RecipeDietaryPreference.objects.all()
    serializer_class = RecipeDietarypreferenceSerializer

