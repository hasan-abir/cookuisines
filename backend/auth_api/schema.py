from drf_spectacular.extensions import OpenApiAuthenticationExtension

class CustomJwtAuthSceme(OpenApiAuthenticationExtension):
    target_class = 'auth_api.authenticate.CustomJwtAuthentication' 
    name = 'JwtAuthentication'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'apiKey',
            'in': 'header',
            'name': 'api_key',
        }