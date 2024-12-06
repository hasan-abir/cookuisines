from django.shortcuts import render
from auth_api.serializers import UserSerializer, RefreshSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create your views here.
class RegisterView(APIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data['access']
        response.set_cookie('access-token', access_token)

        refresh_token = response.data['refresh']
        response.set_cookie('refresh-token', refresh_token)

        return response
    
class RefreshView(TokenRefreshView):
    serializer_class = RefreshSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data['access']
        response.set_cookie('access-token', access_token)

        return response
