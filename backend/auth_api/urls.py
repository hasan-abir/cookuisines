from django.urls import path, include
from auth_api.views import RegisterView, LoginView, RefreshView

urlpatterns = [
    path('api-user-register/', RegisterView.as_view()),
    path('api-token-obtain/', LoginView.as_view()),
    path('api-token-refresh/', RefreshView.as_view()),
]