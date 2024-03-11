from rest_framework import serializers
from .models import *
from django.utils.translation import activate


class APIkeySerializer(serializers.ModelSerializer):
    time_created = serializers.DateTimeField(source="time")

    class Meta:
        model = APIkey
        fields = ["key", "name", "time_created", "last_used", "token_limit"]


class APIkeyUsageSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = APIkey
        fields = ("label", "token_used", "token_limit")

    def get_label(self, obj):
        if obj.name is not None and obj.name != "":
            return obj.name
        else:
            return f"CC-...{obj.key[-4:]}"
