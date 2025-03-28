from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from recipes.permissions import IsRecipeOwnerOrReadOnly
from recipes.models import Recipe 
from recipes.serializers import RecipeSerializer, BasicErrorSerializer, RecipeErrorsSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from recipes.services import delete_image

# Create your views here.
class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all().order_by('-created_at')
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
            filter_params['ingredient_list__icontains'] = ingredient.casefold()

        if breakfast is not None:
            filter_params['meal_types__icontains'] = 'breakfast'
        if brunch is not None:
            filter_params['meal_types__icontains'] = 'brunch'
        if lunch is not None:
            filter_params['meal_types__icontains'] = 'lunch'
        if dinner is not None:
            filter_params['meal_types__icontains'] = 'dinner'

        if vegan is not None:
            filter_params['dietary_preferences__icontains'] = 'vegan'
        if glutenfree is not None:
            filter_params['dietary_preferences__icontains'] = 'glutenfree'

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
    
    @extend_schema(
        responses = {200: RecipeSerializer, 404: BasicErrorSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        responses = {201: RecipeSerializer, 401: BasicErrorSerializer, 400: RecipeErrorsSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        responses = {200: RecipeSerializer, 403: BasicErrorSerializer, 401: BasicErrorSerializer, 404: BasicErrorSerializer, 400: RecipeErrorsSerializer}
    )    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: RecipeSerializer, 403: BasicErrorSerializer, 401: BasicErrorSerializer, 404: BasicErrorSerializer, 400: RecipeErrorsSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 403: BasicErrorSerializer, 401: BasicErrorSerializer, 404: BasicErrorSerializer, 400: RecipeErrorsSerializer}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user)
    
    def perform_destroy(self, instance):
        delete_image(file_id=instance.image_id)

        return super().perform_destroy(instance)
