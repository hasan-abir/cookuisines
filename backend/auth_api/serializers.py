from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'], password=validated_data['password'])
        
        return user
    
class RefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False)

    def validate(self, attrs):
        if 'refresh-token' in self.context['request'].COOKIES:

            attrs['refresh'] = self.context['request'].COOKIES.get('refresh-token')
        
            return super().validate(attrs)
        
        else:
            raise serializers.ValidationError({'refresh': 'Cookie not found. Login first'})