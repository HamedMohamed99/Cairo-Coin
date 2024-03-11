from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
from django.apps import apps

# Get all models from your app
app_models = apps.get_app_config("CairoCoinPlus").get_models()


# Register each model with the dynamically created ModelAdmin
for model in app_models:
    if model != User:
        # Define the CustomModelAdmin class once outside the loop
        class CustomModelAdmin(admin.ModelAdmin):
            list_display = [field.name for field in model._meta.get_fields()]

        admin.site.register(model, CustomModelAdmin)

# Register the User model with the custom UserAdmin
admin.site.register(User, UserAdmin)
