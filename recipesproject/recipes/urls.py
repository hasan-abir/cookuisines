from rest_framework import routers
from .api import RecipeViewSet

router = routers.DefaultRouter()
router.register('api/recipes', RecipeViewSet)
urlpatterns = router.urls