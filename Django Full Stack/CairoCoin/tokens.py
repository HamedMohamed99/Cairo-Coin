from django.http import JsonResponse
from CairoCoinPlus.models import APIkey, APIlimit, APIuser_history_alltime, upate_time
from django.utils import timezone

# Define error response types and messages
ERROR_RESPONSES = {
    "INVALID_KEY": {
        "status": "error",
        "error": "invalid_API_Key",
        "data": "The provided Bearer Key is invalid or expired.",
    },
    "TOKEN_LIMIT_KEY": {
        "status": "error",
        "error": "Token_limit_exceeded",
        "data": "Your request cannot be processed due to API key usage reaching its limit.",
    },
    "TOKEN_LIMIT_ALL": {
        "status": "error",
        "error": "Token_limit_exceeded",
        "data": "Your request cannot be processed due to account usage reaching its limit.",
    },
}


def authenticate_request(request, tokens):
    authorization_header = request.headers.get("Authorization")

    if not authorization_header or not authorization_header.startswith("Bearer "):
        return error_response("INVALID_KEY")

    api_key = authorization_header.split(" ")[1]

    if not is_valid_api_key(api_key):
        return error_response("INVALID_KEY")

    if acc_limit(api_key, tokens):
        return error_response("TOKEN_LIMIT_ALL")

    if api_key_limit(api_key, tokens):
        return error_response("TOKEN_LIMIT_KEY")

    return False


def is_valid_api_key(api_key):
    # Check if API key exists in the database
    return APIkey.objects.filter(key=api_key).exists()


def api_key_limit(api_key, tokens):
    # Check if the API key's usage limit is reached
    api_key_obj = APIkey.objects.get(key=api_key)
    return api_key_obj.token_limit >= (api_key_obj.token_used + tokens)


def acc_limit(api_key, tokens):
    # Check if the account's usage limit is reached
    key_user = APIkey.objects.get(key=api_key).user
    api_limit_obj = APIlimit.objects.get(user=key_user)
    return api_limit_obj.token_limit >= (api_limit_obj.token_used + tokens)


def error_response(error_type):
    # Return the appropriate error response
    return JsonResponse(
        ERROR_RESPONSES.get(error_type, ERROR_RESPONSES["INVALID_KEY"]), status=401
    )


def check_key(request, tokens):
    # Authenticate the request and handle errors
    check = authenticate_request(request, tokens)
    if check:
        return check

    return False


def upgrade_token_usage(request, tokens):
    try:
        # Extract the API key from the request
        api_key = request.headers["Authorization"].split(" ")[1]
        # Retrieve the APIkey object
        api_key_obj = APIkey.objects.get(key=api_key)
        # Update the token used in the APIkey model
        api_key_obj.update_token_used(tokens)

        # Retrieve the APIlimit object for the user associated with the APIkey
        api_limit_obj = APIlimit.objects.get(user=api_key_obj.user)
        # Update the token used in the APIlimit model
        api_limit_obj.update_token_used(tokens)

        user_history = APIuser_history_alltime.objects.get(user=api_key_obj.user)
        user_history.update_token_used(tokens)

        return True  # Return True indicating successful update
    except (APIkey.DoesNotExist, APIlimit.DoesNotExist, KeyError, IndexError) as e:
        return False  # Return False indicating failure


def token_day_reset():
    # Iterate over all instances of APIkey
    for api_key_instance in APIkey.objects.all():
        api_key_instance.clear_token_used()

    # Iterate over all instances of APIlimit
    for api_limit_instance in APIlimit.objects.all():
        api_limit_instance.clear_token_used_and_update_history_day()


def check_and_update_time():
    # Retrieve the latest instance of UpdateTime
    latest_update_time = upate_time.objects.latest("time")

    # Get the current date and time
    current_datetime = timezone.now()

    # Get the time stored in the database
    stored_time = latest_update_time.time

    # Calculate the difference in hours between the current time and the stored time
    time_difference = (current_datetime - stored_time).total_seconds()

    # Check if the difference is greater than 24 hours
    if time_difference >= 24 * 3600:
        token_day_reset()
        latest_update_time.update_time()
