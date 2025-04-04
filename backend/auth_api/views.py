from django.shortcuts import render
from auth_api.serializers import UserSerializer, UserErrorSerializer, LoginErrorSerializer, LoginSuccessSerializer, RefreshSerializer, RefreshErrorSerializer
from recipes.serializers import BasicErrorSerializer
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
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

class VerifyView(APIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses = {200: UserSerializer, 401: BasicErrorSerializer}
    )
    def post(self, request, format=None):
        user = UserSerializer(request.user).data

        return Response(user, status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 401: BasicErrorSerializer}
    )
    def delete(self, request, format=None):
        response = Response(status=status.HTTP_204_NO_CONTENT)

        response.delete_cookie('access-token', samesite='None')
        response.delete_cookie('refresh-token', samesite='None')

        return response
        
class LoginView(TokenObtainPairView):
    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 400: LoginErrorSerializer}
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data['access']
        response.set_cookie(key='access-token', value=access_token, secure=True, httponly=True, samesite='None')

        refresh_token = response.data['refresh']
        response.set_cookie(key='refresh-token', value=refresh_token, secure=True, httponly=True, samesite='None')

        response.status_code = status.HTTP_204_NO_CONTENT

        return response
    
class RefreshView(TokenRefreshView):
    serializer_class = RefreshSerializer

    @extend_schema(
        responses = {204: OpenApiResponse(description='No response body.'), 400: RefreshErrorSerializer}
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        access_token = response.data['access']
        response.set_cookie(key='access-token', value=access_token, secure=True, httponly=True, samesite='None')

        response.status_code = status.HTTP_204_NO_CONTENT

        return response
