from rest_framework import permissions
from recipes.models import Recipe

class IsRecipeOwnerOrReadOnly(permissions.BasePermission):
    def get_pk_from_hyperlink(self, hyperlink: str):
        hyperlink_parts = hyperlink.split('/')
        return int(hyperlink_parts[-2])

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            if request.method == 'POST' and ('recipe' in  request.data or 'recipe_pk' in view.kwargs):                
                try:
                    if 'recipe_pk' in view.kwargs:
                        recipe_instance = Recipe.objects.get(pk=view.kwargs['recipe_pk'])
                    elif 'recipe' in  request.data:
                        recipe_instance = Recipe.objects.get(pk=self.get_pk_from_hyperlink(request.data.get('recipe')))
                    else:
                        return False
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
