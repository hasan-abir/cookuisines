from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from recipes.models import Recipe, RecipeIngredient
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer

# Create your views here.
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

class RecipeIngredientViewSet(ModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientSerializer

