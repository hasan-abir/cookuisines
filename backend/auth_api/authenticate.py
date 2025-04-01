from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomJwtAuthentication(JWTAuthentication):
    def get_header(self, request):
        if 'access-token' in request.COOKIES:
            request.META['HTTP_AUTHORIZATION'] = 'Bearer {token}'.format(token=request.COOKIES.get('access-token'))

        return super().get_header(request)