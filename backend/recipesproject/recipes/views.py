from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema, OpenApiParameter
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeMealType, RecipeDietaryPreference
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer, RecipeInstructionSerializer, RecipeMealtypeSerializer, RecipeDietarypreferenceSerializer

# Create your views here.
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeIngredientViewSet(ModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientSerializer

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']

        return self.queryset.filter(recipe=recipe_pk)

class RecipeInstructionViewSet(ModelViewSet):
    queryset = RecipeInstruction.objects.all()
    serializer_class = RecipeInstructionSerializer

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']

        return self.queryset.filter(recipe=recipe_pk)

class RecipeMealtypeViewSet(ModelViewSet):
    queryset = RecipeMealType.objects.all()
    serializer_class = RecipeMealtypeSerializer

class RecipeDietarypreferenceViewSet(ModelViewSet):
    queryset = RecipeDietaryPreference.objects.all()
    serializer_class = RecipeDietarypreferenceSerializer

