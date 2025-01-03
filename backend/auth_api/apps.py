from django.apps import AppConfig


class AuthApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_api'

    def ready(self):
        import auth_api.schema 
