from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeMealType, RecipeDietaryPreference
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer, RecipeInstructionSerializer, RecipeMealtypeSerializer, RecipeDietarypreferenceSerializer

# Create your views here.
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeIngredientViewSet(ModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientSerializer

class RecipeInstructionViewSet(ModelViewSet):
    queryset = RecipeInstruction.objects.all()
    serializer_class = RecipeInstructionSerializer

class RecipeMealtypeViewSet(ModelViewSet):
    queryset = RecipeMealType.objects.all()
    serializer_class = RecipeMealtypeSerializer

class RecipeDietarypreferenceViewSet(ModelViewSet):
    queryset = RecipeDietaryPreference.objects.all()
    serializer_class = RecipeDietarypreferenceSerializer

