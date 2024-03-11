from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import *
from CairoCoin.models import (
    binance,
    binance2,
    blackmarket,
    gold_Final,
    gold2,
    x,
    xPlus,
    gold_Final_ingot,
    bankrate,
)
from django.core.mail import send_mail
from django.contrib.auth.hashers import check_password
import random
from django.http import JsonResponse
from .serializers import *
from CairoCoin.serializers import GoldIngotBuySerializer,GoldIngotSellSerializer,GoldDollarSerializer
import json
import secrets
import string


def generate_otp():
    return str(random.randint(100000, 999999))


def index(request):
    request.session.pop("verification_redirect", None)
    return render(request, "CairoCoinPlus/main/index.html")


def home(request):
    # Authenticated users view their inbox
    if request.user.is_authenticated:
        name = request.user.username
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        if 'UserFromAppPlus' in user_agent:
            return render(request, "CairoCoinPlus/api-center/app/plus/layout.html", {"name": name})
        else:
            return render(request, "CairoCoinPlus/api-center/web/layout.html", {"name": name})

        

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))
    
def lite(request):
     return render(request, "CairoCoinPlus/api-center/app/lite/layout.html")

def snip(request):
     return render(request, "CairoCoinPlus/snip/layout.html")

def forbidden(request):
    request.session.pop("verification_redirect", None)
    return render(request, "CairoCoinPlus/main/forbidden.html")


def logout_view(request):
    request.session.pop("verification_redirect", None)
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def login_view(request):
    if request.user.is_authenticated:
        return redirect(reverse("index"))
    
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    if 'UserFromAppPlus' in user_agent:
        app = True
    else:
        app = False

    request.session.pop("verification_redirect", None)
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"].lower()
        password = request.POST["password"]
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            # Invalid username
            return render(
                request,
                "CairoCoinPlus/main/login.html",
                {"message": "- Invalid username -", "app": app},

            )

        # Check if the password is correct
        if check_password(password, user.password):
            if not user.is_active:
                # Inactive user
                request.session["verification_redirect"] = True
                return redirect("verification", name=username)
            else:
                # User is valid and active, log them in
                login(request, user)
                if "remember_me" not in request.POST:
                    request.session.set_expiry(0)
                
                return HttpResponseRedirect("home")
        else:
            # Invalid password
            return render(
                request,
                "CairoCoinPlus/main/login.html",
                {"message": "- Invalid password -", "app": app},
            )
    else:
        return render(request, "CairoCoinPlus/main/login.html" ,{"app": app})


def TimeToWait(otp_time, attempts):
    current_time = timezone.now()
    time_difference = int((current_time - otp_time).total_seconds())
    time_attempt = attempts * 60
    time_wait = max(0, time_attempt - time_difference)
    return time_wait


def verification(request, name):
    """
    This function handles the verification process for user registration using OTP.
    It retrieves the user's OTP from the request and validates it.
    Args:
    - request: the HTTP request object
    - name: the username for the user being verified
    Returns:
    - If verification is successful, it redirects the user to the index page.
    - If verification fails, it renders the verification page with an appropriate message.
    """
     
    # Check if the user is redirected from the login function
    if not request.session.get("verification_redirect", False):
        # If not redirected, handle unauthorized access
        return redirect("forbidden")

    user = User.objects.get(username=name)
    otp = OTP.objects.get(user=user)

    time_wait = TimeToWait(otp.time, otp.attempts)

    if request.method == "POST":
        submission_source = request.POST.get("submission_source", "")
        if submission_source == "button":
            # Retrieve individual token values
            tokens = [request.POST.get(f"token{i}", "") for i in range(1, 7)]
            # Concatenate the token values to get the full token
            full_token_str = ("".join(tokens))

            try:
                # Convert the string to an integer
                full_token_int = int(full_token_str)

                if int(otp.otp_secret) == full_token_int:
                    otp_time = otp.time
                    duration = int((timezone.now() - otp_time).total_seconds()) / 60

                    if duration < 30:
                        user.is_active = True
                        user.save()
                        otp.attempts = 1
                        otp.save()
                        APIlimit.objects.create(user=user)
                        APIuser_history_alltime.objects.create(user=user)
                        login(request, user)

                        return redirect("index")

                    else:
                        otp.otp_secret = generate_otp()
                        otp.time = timezone.now()
                        otp.attempts = 1
                        otp.save()

                        time_wait = TimeToWait(otp.time, otp.attempts)
                        # Send OTP via email
                        subject = "Your OTP for Registration"
                        message = f"Your New OTP for registration is: {otp.otp_secret}"
                        from_email = "cairo.coin.plus@gmail.com"
                        recipient_list = [user.email]
                        send_mail(subject, message, from_email, recipient_list)
                        return render(
                            request,
                            "CairoCoinPlus/main/verification.html",
                            {
                                "email": user.email,
                                "name": name,
                                "time_wait": time_wait,
                                "message": "- Code expired we sent you new one -",
                            },
                        )

                else:
                    return render(
                        request,
                        "CairoCoinPlus/main/verification.html",
                        {
                            "email": user.email,
                            "name": name,
                            "time_wait": TimeToWait(otp.time, otp.attempts),
                            "message": "- Wrong Code -",
                        },
                    )

            except ValueError:
                # Handle the case where the conversion fails (e.g., non-numeric input)
                return render(
                    request,
                    "CairoCoinPlus/main/verification.html",
                    {
                        "email": user.email,
                        "name": name,
                        "time_wait": time_wait,
                        "message": "- Please Provide Valid Token -",
                    },
                )

            # Now 'full_token_int' contains the complete token as an integer
            # Use 'full_token_int' as needed in your verification logic

        elif submission_source == "link":
            if TimeToWait(otp.time, otp.attempts) == 0:
                # Handle link click ("Send New Token")
                # You can implement the logic for sending a new token here
                # and then redirect or render a response accordingly
                # Save the user instance in the OTP model
                otp.otp_secret = generate_otp()
                otp.time = timezone.now()
                otp.attempts = otp.attempts + 1 if otp.attempts <= 15 else 1
                otp.save()

                time_wait = TimeToWait(otp.time, otp.attempts)

                # Send OTP via email
                subject = "Your OTP for Registration"
                message = f"Your New OTP for registration is: {otp.otp_secret}"
                from_email = "cairo.coin.plus@gmail.com"
                recipient_list = [user.email]
                send_mail(subject, message, from_email, recipient_list)

                print("resend")
                return render(
                    request,
                    "CairoCoinPlus/main/verification.html",
                    {"email": user.email, "name": name, "time_wait": time_wait},
                )

            else:
                return render(
                    request,
                    "CairoCoinPlus/main/verification.html",
                    {
                        "email": user.email,
                        "name": name,
                        "time_wait": TimeToWait(otp.time, otp.attempts),
                    },
                )

        return render(request, "CairoCoinPlus/main/forbidden.html")
    return render(
        request,
        "CairoCoinPlus/main/verification.html",
        {"email": user.email, "name": name, "time_wait": time_wait},
    )


def register(request):
    if request.user.is_authenticated:
        return redirect(reverse("index"))

    request.session.pop("verification_redirect", None)
    if request.method == "POST":

        username = request.POST["username"].lower()
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if username == "" or email == "" or password == "" or confirmation == "":
            return render(
                request,
                "CairoCoinPlus/main/register.html",
                {"message": "- Please Complete All Data -"},
            )

        if password != confirmation:
            return render(
                request,
                "CairoCoinPlus/main/register.html",
                {"message": "- Passwords must match -"},
            )

        try:
            existing_user = User.objects.get(email=email)
            return render(
                request,
                "CairoCoinPlus/main/register.html",
                {"message": "- This email is already registered -"},
            )
        except User.DoesNotExist:
            pass

        email_valid_domains = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "aol.com",
            "hotmail.co.uk",
            "hotmail.fr",
            "msn.com",
            "outlook.com",
            "live.com",
            "icloud.com",
            "yandex.com",
        ]

        if "@" not in email or not any(
            email.split("@")[1].endswith(domain) for domain in email_valid_domains
        ):
            return render(
                request,
                "CairoCoinPlus/main/register.html",
                {
                    "message": "- Please enter a valid email address with an allowed domain -"
                },
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.is_active = False
            user.save()

            # Save the user instance in the OTP model
            otp_instance = OTP.objects.create(user=user, otp_secret=generate_otp())

            # Send OTP via email
            subject = "Your OTP for Registration"
            message = f"Your OTP for registration is: {otp_instance.otp_secret}"
            from_email = "cairo.coin.plus@gmail.com"
            recipient_list = [email]
            send_mail(subject, message, from_email, recipient_list)

        except IntegrityError:
            return render(
                request,
                "CairoCoinPlus/main/register.html",
                {"message": "- Username already taken -"},
            )
        request.session["verification_redirect"] = True
        return redirect("verification", name=username)
    else:
        return render(request, "CairoCoinPlus/main/register.html")



def generate_api_key(length=32):
    characters = string.ascii_letters + string.digits
    api_key = "CC-" + "".join(secrets.choice(characters) for _ in range(length))
    return api_key


def keys_limit(user):
    keys_count = APIkey.objects.filter(user=user).count()
    keys_limit = APIlimit.objects.get(user=user).key_limit
    if keys_count < keys_limit:
        return True


@csrf_exempt
def homeSub(request):
    binancePrice = binance.objects.last()
    binanceRate = binance2.objects.last()
    bm = blackmarket.objects.last()
    goldPrice = gold_Final.objects.last()
    goldRate = gold2.objects.last()
    indicator = x.objects.last()
    goldIngot = gold_Final_ingot.objects.last()
    goldDollar = gold2.objects.last()
    bank = bankrate.objects.last()
    indicator_plus = xPlus.objects.last()

    def round_non_negative(value, decimals=2):
        rounded_value = round(value, decimals)
        formatted_value = "{:.2f}".format(rounded_value)
        return 0 if rounded_value == "0.00" else formatted_value

    data = {
        "binanceBuy": round_non_negative(binancePrice.buy_egp, 2),
        "binanceSell": round_non_negative(binancePrice.sell_egp, 2),
        "binanceBuyRate": round_non_negative(binanceRate.buy_egp_ccr, 2),
        "binanceSellRate": round_non_negative(binanceRate.sell_egp_ccr, 2),
        "blackMarketBuy": round_non_negative(bm.average_buy, 2),
        "blackMarketSell": round_non_negative(bm.average_sell, 2),
        "blackMarketBuyRate": round_non_negative(bm.ccr_buy, 2),
        "blackMarketSellRate": round_non_negative(bm.ccr_sell, 2),
        "gold21": int(goldPrice.buy21),
        "gold24": int(goldPrice.buy24),
        "gold21Rate": round_non_negative(goldRate.ccr_21, 2),
        "gold24Rate": round_non_negative(goldRate.ccr_24, 2),
        "indicator": int(indicator.index),
        "goldIngotBuy": GoldIngotBuySerializer(goldIngot).data,
        "goldIngotSell": GoldIngotSellSerializer(goldIngot).data,
        "goldDollarPrice" : round_non_negative(goldDollar.gold_dollar),
        "goldDollarRate" : round_non_negative(goldDollar.ccr_gold_dollar),
        "bankPrice" : round_non_negative(bank.usd),
        "bankPriceRate" : round_non_negative(bank.usd_ccr),
        "indicatorBi": int(indicator_plus.index_bi),
        "indicatorBm": int(indicator_plus.index_bm),
        "indicatorG": int(indicator_plus.index_g),
        "indicatorB": int(indicator_plus.index_b),
    }

    api_key = "CC-bntGlLQhOvKQaP3M8y8sJ8z7FZfqYUT8"
    # Retrieve the APIkey object
    api_key_obj = APIkey.objects.get(key=api_key)
    # Update the token used in the APIkey model
    api_key_obj.update_token_used(1)

    # Retrieve the APIlimit object for the user associated with the APIkey
    api_limit_obj = APIlimit.objects.get(user=api_key_obj.user)
    # Update the token used in the APIlimit model
    api_limit_obj.update_token_used(1)

    user_history = APIuser_history_alltime.objects.get(user=api_key_obj.user)
    user_history.update_token_used(1)

    return JsonResponse(data, safe=False)


@csrf_exempt
@login_required
def keys(request):
    if request.method == "POST":
        if keys_limit(request.user):
            data = json.loads(request.body)
            print(data)
            new_key = {
                "user": request.user,
                "key": generate_api_key(),
            }

            # Add 'name' to new_key if data["name"] is not empty
            if data["name"] is not None and data["name"] != "":
                new_key["name"] = data["name"]

            # Add 'token_limit' to new_key if data["limit"] is a non-empty positive integer
            if data["limit"]:
                try:
                    token_limit = int(data["limit"])
                    if token_limit > 0:
                        new_key["token_limit"] = token_limit
                except Exception as e:
                    return JsonResponse(
                        {
                            "error": f"Failed: Error while creating secret key with limit: {e}"
                        },
                        safe=False,
                    )

            try:
                obj = APIkey.objects.create(**new_key)
                obj.save()
            except Exception as e:
                return JsonResponse(
                    {"error": f"Failed: Error while creating secret key: {e}"},
                    safe=False,
                )

            return JsonResponse({"key": new_key["key"]}, safe=False)
        else:
            return JsonResponse(
                {"error": "Failed: Maximum secret key limit reached for your account."},
                safe=False,
            )

    elif request.method == "PUT":
        data = json.loads(request.body)
        key = APIkey.objects.get(key=data["key"])

        # Add 'name' to new_key if data["name"] is not empty
        if data["name"] is not None and data["name"] != "":
            key.name = data["name"]
            print(data["name"])

        # Add 'token_limit' to new_key if data["limit"] is a non-empty positive integer
        if data["limit"]:
            try:
                token_limit = int(data["limit"])
                if token_limit > 0:
                    key.token_limit = token_limit
            except Exception as e:
                return JsonResponse(
                    {
                        "error": f"Failed: Error while updating secret key with limit: {e}"
                    },
                    safe=False,
                )

        try:
            key.save()
        except Exception as e:
            return JsonResponse(
                {"error": f"Failed: Error while updating secret key: {e}"}, safe=False
            )

    elif request.method == "DELETE":
        data = json.loads(request.body)
        try:
            api_key = APIkey.objects.get(key=data["key"])
            api_key.delete()
        except Exception as e:
            return JsonResponse(
                {"error": "Failed: secret key is not exist"}, safe=False
            )

    keys = APIkey.objects.filter(user=request.user).order_by("-time")
    keys_list = [APIkeySerializer(key).data for key in keys]
    return JsonResponse(keys_list, safe=False)


def convert_datetime_to_custom_format(datetime_obj):
    # Extract year, month, and day components
    year = datetime_obj.strftime("%y")
    month = str(int(datetime_obj.strftime("%m")))
    day = str(int(datetime_obj.strftime("%d")))

    # Combine components with '/'
    formatted_datetime = f"{year}/{month}/{day}"

    return formatted_datetime


@login_required
def usage(request):
    token_used_all_time = (
        APIuser_history_alltime.objects.filter(user=request.user).first().token_used
    )

    day_limit = APIlimit.objects.filter(user=request.user).first()
    data_day = {
        "token_used": day_limit.token_used,
        "tokken_limit": day_limit.token_limit,
    }

    data_key = []

    keys = APIkey.objects.filter(user=request.user).order_by("-time")
    for key in keys:
        data_key.append(APIkeyUsageSerializer(key).data)

    history = APIuser_history_day.objects.filter(user=request.user).order_by("-time")[
        :90
    ]
    dates = [
        convert_datetime_to_custom_format(date_str)
        for date_str in list(history.values_list("time", flat=True))
    ]
    data_history = {
        "used": list(history.values_list("token_used", flat=True)),
        "limit": list(history.values_list("token_limit", flat=True)),
        "date": dates,
    }

    data = {
        "tokenUsedAllTime": token_used_all_time,
        "dayDate": data_day,
        "keysData": data_key,
        "historyData": data_history,
    }

    return JsonResponse(data, safe=False)


