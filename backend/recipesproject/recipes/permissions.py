from rest_framework import permissions
from recipes.models import Recipe

class IsRecipeOwnerOrReadOnly(permissions.BasePermission):
    def get_pk_from_url(self, url: str):
        url_parts = url.split('/')
        return int(url_parts[-2])

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            if request.method == 'POST' and request.data.get('recipe'):
                recipe_pk = self.get_pk_from_url(request.data.get('recipe'))
                
                try:
                    recipe_instance = Recipe.objects.get(pk=recipe_pk)
                except Recipe.DoesNotExist:
                    return False

                obj_username = recipe_instance.created_by.username
                current_username = request.user.username

                return obj_username == current_username
            else:
                return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            current_instance = obj

            if hasattr(obj, 'recipe'):
                current_instance = obj.recipe

            obj_username = current_instance.created_by.username
            current_username = request.user.username

            return obj_username == current_username
