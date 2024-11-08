from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, mixins, GenericViewSet
from rest_framework import permissions
from recipes.permissions import IsRecipeOwnerOrReadOnly
from recipes.models import Recipe, RecipeIngredient, RecipeInstruction, RecipeMealType, RecipeDietaryPreference
from recipes.serializers import RecipeSerializer, RecipeIngredientSerializer, RecipeInstructionSerializer, RecipeMealtypeSerializer, RecipeDietarypreferenceSerializer

# Create your views here.
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

class RecipeIngredientViewSet(ModelViewSet):
    queryset = RecipeIngredient.objects.all()
    serializer_class = RecipeIngredientSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']

        return self.queryset.filter(recipe=recipe_pk)

class RecipeInstructionViewSet(ModelViewSet):
    queryset = RecipeInstruction.objects.all()
    serializer_class = RecipeInstructionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']

        return self.queryset.filter(recipe=recipe_pk)

class RecipeMealtypeViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   GenericViewSet):
    queryset = RecipeMealType.objects.all()
    serializer_class = RecipeMealtypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

class RecipeDietarypreferenceViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   GenericViewSet):
    queryset = RecipeDietaryPreference.objects.all()
    serializer_class = RecipeDietarypreferenceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

