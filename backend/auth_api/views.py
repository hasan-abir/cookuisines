from django.shortcuts import render
from auth_api.serializers import UserSerializer, UserErrorSerializer, LoginErrorSerializer, LoginSuccessSerializer, RefreshSerializer, RefreshErrorSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create your views here.
class RegisterView(APIView):
    serializer_class = UserSerializer

    @extend_schema(
        responses = {201: UserSerializer, 400: UserErrorSerializer}
    )
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        
class LoginView(TokenObtainPairView):
    @extend_schema(
        responses = {200: LoginSuccessSerializer, 400: LoginErrorSerializer}
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data['access']
        response.set_cookie('access-token', access_token)

        refresh_token = response.data['refresh']
        response.set_cookie('refresh-token', refresh_token)

        return response
    
class RefreshView(TokenRefreshView):
    serializer_class = RefreshSerializer

    @extend_schema(
        responses = {200: RefreshSerializer, 400: RefreshErrorSerializer}
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data['access']
        response.set_cookie('access-token', access_token)

        return response
