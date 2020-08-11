from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework import status, viewsets, permissions
from .permissions import isOwnerOrReadOnly
from rest_framework.response import Response
from .serializers import RecipeSerializer
from .models import Recipe


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().order_by('-published')
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        isOwnerOrReadOnly
    ]
    serializer_class = RecipeSerializer
