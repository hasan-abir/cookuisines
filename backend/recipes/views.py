from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, mixins, GenericViewSet
from rest_framework import permissions
from rest_framework.reverse import reverse
from rest_framework import status
from recipes.permissions import IsRecipeOwnerOrReadOnly
from recipes.models import Recipe, Ingredient, Instruction, MealType, DietaryPreference
from recipes.serializers import RecipeSerializer, IngredientSerializer, InstructionSerializer, MealtypeSerializer, DietarypreferenceSerializer, BasicErrorSerializer, RecipeErrorsSerializer, IngredientErrorsSerializer, InstructionErrorsSerializer, MealtypeErrorsSerializer, MealtypeCreateErrorsSerializer, DietarypreferenceCreateErrorsSerializer, DietarypreferenceErrorsSerializer
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from recipes.services import delete_image
from django.http.request import QueryDict

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
    
class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    @extend_schema(
        responses = {200: IngredientSerializer, 404: BasicErrorSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        responses = {201: IngredientSerializer, 400: IngredientErrorsSerializer, 401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def create(self, request, *args, **kwargs):
        recipe_pk = self.kwargs['recipe_pk']

        recipe_url = reverse('recipe-detail', args=[recipe_pk], request=request)

        if isinstance(request.data, QueryDict):
            request.data._mutable = True
            
        request.data.update({'recipe': recipe_url})

        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: IngredientSerializer, 400: IngredientErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: IngredientSerializer, 400: IngredientErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def get_queryset(self):
        recipe_pk = self.kwargs['recipe_pk']

        return self.queryset.filter(recipe=recipe_pk)

class InstructionViewSet(ModelViewSet):
    queryset = Instruction.objects.all()
    serializer_class = InstructionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    @extend_schema(
        responses = {200: InstructionSerializer, 404: BasicErrorSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        responses = {201: InstructionSerializer, 400: InstructionErrorsSerializer, 401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def create(self, request, *args, **kwargs):
        recipe_pk = self.kwargs['recipe_pk']

        recipe_url = reverse('recipe-detail', args=[recipe_pk], request=request)

        if isinstance(request.data, QueryDict):
            request.data._mutable = True
        request.data.update({'recipe': recipe_url})

        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: InstructionSerializer, 400: InstructionErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: InstructionSerializer, 400: InstructionErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

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

    @extend_schema(
        responses = {200: MealtypeSerializer, 404: BasicErrorSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        responses = {201: MealtypeSerializer, 400: MealtypeCreateErrorsSerializer, 401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: MealtypeSerializer, 400: MealtypeErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: MealtypeSerializer, 400: MealtypeErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class DietarypreferenceViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   GenericViewSet):
    queryset = DietaryPreference.objects.all()
    serializer_class = DietarypreferenceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsRecipeOwnerOrReadOnly]

    @extend_schema(
        responses = {200: DietarypreferenceSerializer, 404: BasicErrorSerializer}
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        responses = {201: DietarypreferenceSerializer, 400: DietarypreferenceCreateErrorsSerializer, 401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: DietarypreferenceSerializer, 400: DietarypreferenceErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {200: DietarypreferenceSerializer, 400: DietarypreferenceErrorsSerializer, 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 404: BasicErrorSerializer, 
        401: BasicErrorSerializer, 403: BasicErrorSerializer}
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

