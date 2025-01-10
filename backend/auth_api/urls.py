from django.urls import path, include
from auth_api.views import RegisterView, LoginView, RefreshView, VerifyView, LogoutView

urlpatterns = [
    path('api-user-register/', RegisterView.as_view()),
    path('api-user-verify/', VerifyView.as_view()),
    path('api-token-delete/', LogoutView.as_view()),
    path('api-token-obtain/', LoginView.as_view()),
    path('api-token-refresh/', RefreshView.as_view()),
]