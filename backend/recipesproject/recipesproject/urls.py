"""
URL configuration for recipesproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_nested import routers
from recipes.views import RecipeViewSet, RecipeIngredientViewSet

router = routers.SimpleRouter()

router.register(r'recipes', RecipeViewSet, basename='recipe')

recipes_router = routers.NestedSimpleRouter(router, r'recipes', lookup='recipe')
recipes_router.register(r'ingredients', RecipeIngredientViewSet, basename='recipeingredient')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('', include(recipes_router.urls)),
]
