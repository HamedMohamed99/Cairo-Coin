from django.contrib import admin
from django.apps import apps
from .models import *

# Get all models from your app
app_models = apps.get_app_config("CairoCoin").get_models()

# Register each model with a dynamically created ModelAdmin
for model in app_models:

    class CustomModelAdmin(admin.ModelAdmin):
        list_display = [field.name for field in model._meta.get_fields()]

    admin.site.register(model, CustomModelAdmin)
