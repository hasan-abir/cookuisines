from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, mixins, GenericViewSet
from rest_framework import permissions
from recipes.permissions import IsRecipeOwnerOrReadOnly
from recipes.models import Recipe, Ingredient, Instruction, MealType, DietaryPreference
from recipes.serializers import RecipeSerializer, IngredientSerializer, InstructionSerializer, MealtypeSerializer, DietarypreferenceSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter

# Create your views here.
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    def get_queryset(self):
        title = self.request.query_params.get('title')
        difficulty = self.request.query_params.get('difficulty')
        ingredient = self.request.query_params.get('ingredient')
        breakfast = self.request.query_params.get('breakfast')
        brunch = self.request.query_params.get('brunch')
        lunch = self.request.query_params.get('lunch')
        dinner = self.request.query_params.get('dinner')
        vegan = self.request.query_params.get('vegan')
        glutenfree = self.request.query_params.get('glutenfree')
        filter_params = {}

        if title is not None:
            filter_params['title__icontains'] = title.casefold()

        if difficulty is not None:
            filter_params['difficulty__iexact'] = difficulty.casefold()

        if ingredient is not None:
            filter_params['ingredients__name__icontains'] = ingredient.casefold()

        if breakfast is not None:
            filter_params['meal_type__breakfast'] = True
        if brunch is not None:
            filter_params['meal_type__brunch'] = True
        if lunch is not None:
            filter_params['meal_type__lunch'] = True
        if dinner is not None:
            filter_params['meal_type__dinner'] = True

        if vegan is not None:
            filter_params['dietary_preference__vegan'] = True
        if glutenfree is not None:
            filter_params['dietary_preference__glutenfree'] = True

        if len(filter_params) > 0:
            return self.queryset.filter(**filter_params)
        else:
            return self.queryset
    
    @extend_schema(
        parameters=[
            OpenApiParameter(name='title', description='Filter by title', required=False, type=str),
            OpenApiParameter(name='difficulty', description='Filter by difficulty', required=False, type=str, enum=['easy', 'medium', 'hard']),
            OpenApiParameter(name='ingredient', description='Filter by ingredient name', required=False, type=str),
            OpenApiParameter(name='breakfast', description='Filter by breakfast', required=False, type=bool),
            OpenApiParameter(name='brunch', description='Filter by brunch', required=False, type=bool),
            OpenApiParameter(name='lunch', description='Filter by lunch', required=False, type=bool),
            OpenApiParameter(name='dinner', description='Filter by dinner', required=False, type=bool),
            OpenApiParameter(name='vegan', description='Filter by vegan', required=False, type=bool),
            OpenApiParameter(name='glutenfree', description='Filter by glutenfree', required=False, type=bool),
        ],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user)
    
class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']

        return self.queryset.filter(recipe=recipe_pk)

class InstructionViewSet(ModelViewSet):
    queryset = Instruction.objects.all()
    serializer_class = InstructionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']

        return self.queryset.filter(recipe=recipe_pk)

class MealtypeViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   GenericViewSet):
    queryset = MealType.objects.all()
    serializer_class = MealtypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

class DietarypreferenceViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   GenericViewSet):
    queryset = DietaryPreference.objects.all()
    serializer_class = DietarypreferenceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

