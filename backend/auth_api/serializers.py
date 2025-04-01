from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenRefreshSerializer, TokenVerifySerializer
from drf_spectacular.utils import extend_schema_serializer

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all(), message='A user with that email already exists.')])
    password = serializers.CharField(write_only=True, min_length=8, error_messages={'min_length': 'Password must be at least 8 characters long'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'], password=validated_data['password'])
        
        return user
    
class UserErrorSerializer(serializers.Serializer):
    username = serializers.ListField()
    email = serializers.ListField()
    password = serializers.ListField()

class LoginSuccessSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

class LoginErrorSerializer(serializers.Serializer):
    detail = serializers.CharField()
    
@extend_schema_serializer(exclude_fields=['refresh'])
class RefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False)

    def validate(self, attrs):
        if 'refresh-token' in self.context['request'].COOKIES:

            attrs['refresh'] = self.context['request'].COOKIES.get('refresh-token')
        
            return super().validate(attrs)
        
        else:
            raise serializers.ValidationError({'refresh': 'Cookie not found. Login again.'})
        
class RefreshErrorSerializer(serializers.Serializer):
    refresh = serializers.ListField()

@extend_schema_serializer(exclude_fields=['token'])
class VerifySerializer(TokenVerifySerializer):
    token = serializers.CharField(required=False)

    def validate(self, attrs):
        if 'access-token' in self.context['request'].COOKIES:

            attrs['token'] = self.context['request'].COOKIES.get('access-token')
        
            return super().validate(attrs)
        
        else:
            raise serializers.ValidationError({'token': 'Cookie not found. Login again.'})
        
class VerifyErrorSerializer(serializers.Serializer):
    token = serializers.ListField()