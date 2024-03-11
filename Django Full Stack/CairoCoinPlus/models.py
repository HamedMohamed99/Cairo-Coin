from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import datetime, time


class User(AbstractUser):
    def __str__(self):
        return f"{self.id} {self.username}"


class OTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    time = models.DateTimeField(default=timezone.now)
    attempts = models.IntegerField(default=1)
    otp_secret = models.CharField(max_length=16)


class APIkey(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time = models.DateTimeField(default=timezone.now)
    key = models.CharField()
    name = models.CharField(default="")
    token_limit = models.IntegerField(default=100)
    token_used = models.IntegerField(default=0)
    last_used = models.DateTimeField(null=True, blank=True)

    def update_token_used(self, tokens):
        # Method to update the token_used field by adding the provided tokens.
        self.token_used += tokens
        self.last_used = timezone.now()
        self.save()

    def clear_token_used(self):
        # Method to clear the token_used.
        self.token_used = 0
        self.save()


class APIlimit(models.Model):  ##
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    time_limit_updated = models.DateTimeField(default=timezone.now)
    key_limit = models.IntegerField(default=3)
    token_limit = models.IntegerField(default=100)
    token_used = models.IntegerField(default=0)
    last_used = models.DateTimeField(null=True, blank=True)

    def update_token_used(self, tokens):
        # Method to update the token_used field by adding the provided tokens.
        self.token_used += tokens
        self.last_used = timezone.now()
        self.save()

    def clear_token_used_and_update_history_day(self):
        # Create a new APIuser_history_day instance
        APIuser_history_day.objects.create(
            user=self.user,
            token_used=self.token_used,
            token_limit=self.token_limit,
        )
        # clear the token_used.
        self.token_used = 0
        self.save()


class APIuser_history_day(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time = models.DateTimeField(default=timezone.now)
    token_used = models.IntegerField()
    token_limit = models.IntegerField(default=100)


class APIuser_history_alltime(models.Model):  ##
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token_used = models.IntegerField(default=0)

    def update_token_used(self, tokens):
        # Method to update the token_used field by adding the provided tokens.
        self.token_used += tokens
        self.save()


class upate_time(models.Model):  ##
    time = models.DateTimeField(default=timezone.now)

    def update_time(self):
        # Get the current date
        current_date = timezone.localdate()

        # Combine the current date with 10:00 PM time
        time_with_10_pm = datetime.combine(
            current_date, time(hour=22)
        )  # 22 represents 10:00 PM

        # Make the combined datetime aware of the timezone
        combined_datetime = timezone.make_aware(
            time_with_10_pm, timezone=timezone.get_current_timezone()
        )

        # Set the update_time field to the combined datetime
        self.time = combined_datetime
        self.save()


# Provide unique related_name for groups and user_permissions
User._meta.get_field("groups").remote_field.related_name = "cairocoinplus_user_groups"
User._meta.get_field("user_permissions").remote_field.related_name = (
    "cairocoinplus_user_permissions"
)
