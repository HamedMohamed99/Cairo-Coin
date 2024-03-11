from django.http import JsonResponse
from .models import *
from .serializers import *
from .functions import *
from .tokens import *
from rest_framework.decorators import api_view
from dateutil.relativedelta import relativedelta
import json
import csv


@api_view(["GET"])
def index(request):
    check_and_update_time()
    """# Calculate the timestamp for one hour ago
    time = datetime.now(timezone.utc) - timedelta(days=45)

    # Query to retrieve all data added in the last hour
    data1 = blackmarket.objects.filter(time__gte=time).values_list('average_buy', flat=True)
    data2 = blackmarket.objects.filter(time__gte=time).values_list('average_sell', flat=True)


    # Combine the data into rows
    combined_data = zip(data1, data2)

    # Define the file name for saving the CSV
    csv_file = "market_data.csv"

    # Write the combined data to a CSV file
    with open(csv_file, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['data1', 'data2'])  # Write header
        writer.writerows(combined_data)

    print("Data saved to", csv_file)"""

    x_ = x.objects.last()
    x_data = XSerializer(x_)

    binance1 = binance.objects.last()
    binance_data = binanceSerializer(binance1)

    binance2_ = binance2.objects.last()
    binance2_data = binance2Serializer(binance2_)

    blackmarket1 = blackmarket.objects.last()
    blackmarket_data = blackmarketSerializer(blackmarket1)
    blackmarket_data_2 = blackmarket2Serializer(blackmarket1)

    bankrate_ = bankrate.objects.last()
    bankrate_data = bankrateSerializer(bankrate_)

    bankRateForeignCurrency = bankrate.objects.last()
    bankRateForeignCurrency_data = bankRateForeignCurrencySerializer(
        bankRateForeignCurrency
    )

    ForeignCurrency = blackmarket2.objects.last()
    ForeignCurrency_data = blackmarket3Serializer(ForeignCurrency)

    arbitrageStocks = arbitrage.objects.last()
    arbitrageStocks_data = arbitrageStocks_Serializer(arbitrageStocks)
    arbitrageStocks_time_data = arbitragetime_Serializer(arbitrageStocks)

    arbitrage_ = arbitrage2.objects.last()
    arbitrage_data = arbitrage_Serializer(arbitrage_)

    gold_gram_price = gold_Final.objects.last()
    gold_gram_buy_data = GoldGramBuySerializer(gold_gram_price)
    gold_gram_sell_data = GoldGramSellSerializer(gold_gram_price)

    gold2_ = gold2.objects.last()
    gold_gram_rate_data = GoldGramRateSerializer(gold2_)
    gold_dollar_data = GoldDollarSerializer(gold2_)

    gold_global = gold_usd.objects.last()
    gold_global_data = GoldGlobalSerializer(gold_global)

    gold_ingot = gold_Final_ingot.objects.last()
    gold_ingot_buy_data = GoldIngotBuySerializer(gold_ingot)
    gold_ingot_sell_data = GoldIngotSellSerializer(gold_ingot)

    credit_rating_sp = creditRating.objects.filter(Agency="S&P").last()
    credit_rating_sp_data = CreditRatingSerializer(credit_rating_sp)

    credit_rating_m = creditRating.objects.filter(Agency="Moody's").last()
    credit_rating_m_data = CreditRatingSerializer(credit_rating_m)

    response = {
        "status": "success",
        "message": "Request successful",
    }

    response["data"] = {
        "Indicator": x_data.data,
        "Binance": {"Trading": binance_data.data, "Rate": binance2_data.data},
        "BlackMarket": {
            "Trading": blackmarket_data.data,
            "Rate": blackmarket_data_2.data,
        },
        "OfficialExchangeRate": bankrate_data.data,
        "ForeignCurrency": {
            "OfficialExchangeRate": bankRateForeignCurrency_data.data,
            "BlackMarket": ForeignCurrency_data.data,
        },
        "EgyptPoundToRussianRuble": round(
            (1 / blackmarket2.objects.values_list("Rub2egp", flat=True).last()), 3
        ),
        "CIBArbitrage": {
            "Data": arbitrage_data.data,
            "Details": {
                "Stocks": arbitrageStocks_data.data,
                "Market": arbitrageStocks_time_data.data,
            },
        },
        "Gold": {
            "Gram": {
                "Buy": gold_gram_buy_data.data,
                "Sell": gold_gram_sell_data.data,
                "Rate": gold_gram_rate_data.data,
                "GlobalPrice": gold_global_data.data,
            },
            "Dollar": gold_dollar_data.data,
            "Ingot": {
                "Buy": gold_ingot_buy_data.data,
                "Sell": gold_ingot_sell_data.data,
            },
        },
        "CreditRating": {
            "SP": credit_rating_sp_data.data,
            "Moodys": credit_rating_m_data.data,
        },
    }
    return JsonResponse(response)


@api_view(["GET"])
def history(request):
    check_and_update_time()
    indicator = request.GET.get("Indicator").lower()
    unit = request.GET.get("Unit").lower()
    period = request.GET.get("Period")

    unit_mapping = {"hour": "hours", "day": "days", "month": "months"}

    field_mapping = {
        "binance": "bi_buy",
        "blackmarket": "bm_buy",
        "bankrate": "br_usd2egp",
        "cib": "cib_comi2cbkd",
        "gold24": "gold_24",
        "gold21": "gold_21",
        "golddollar": "gold_dollar",
        "goldglobal": "gold_usd",
    }

    field = field_mapping.get(indicator)
    error = {"status": "error", "message": "Error processing the request 400"}

    if not field:
        error["data"] = "Invalid indicator"
        return JsonResponse(error, status=400)

    if unit not in unit_mapping:
        error["data"] = "Invalid unit"
        return JsonResponse(error, status=400)

    if not period.isdigit() or int(period) <= 0:
        error["data"] = "Invalid Period"
        return JsonResponse(error, status=400)

    response = {
        "status": "success",
        "message": "Request successful",
        "indicator": indicator,
    }

    if unit == "hour":
        model = history_hour
        response["Unit"] = "Hour"
        response["UnitLimit"] = 48
        if int(period) > 48:
            period = 48

    else:
        model = history_day
        response["Unit"] = "Day"
        response["UnitLimit"] = model.objects.count()

    time = datetime.now(timezone.utc) - relativedelta(
        **{unit_mapping[unit]: int(period)}
    )

    dic = model.objects.filter(time__gte=time).values("time", field).order_by("-time")

    response["data"] = [
        {
            "Time": (item["time"] + timedelta(hours=2)).replace(
                minute=0, second=0, microsecond=0
            ),
            "Value": item[field],
        }
        for item in dic
    ]

    return JsonResponse(response, safe=False)


@api_view(["GET"])
def historyCreditRating(request):
    check_and_update_time()
    credit_rating_sp = creditRating.objects.filter(Agency="S&P").order_by("-time")
    credit_rating_sp_data = []

    for rate in credit_rating_sp:
        credit_rating_sp_data.append(CreditRatingSerializer(rate).data)

    credit_rating_m = creditRating.objects.filter(Agency="Moody's").order_by("-time")
    credit_rating_m_data = []

    for rate in credit_rating_m:
        credit_rating_m_data.append(CreditRatingSerializer(rate).data)

    response = {
        "status": "success",
        "message": "Request successful",
    }

    response["data"] = {"SP": credit_rating_sp_data, "Moodys": credit_rating_m_data}

    return JsonResponse(response, safe=False)


@api_view(["GET"])
def Calculator(request):
    check_and_update_time()
    binancePrice = binance.objects.last()
    blackmarketPrice = blackmarket.objects.last()
    foreignCurrency = bankrate.objects.last()

    response = {
        "status": "success",
        "message": "Request successful",
    }

    response["data"] = {
        "Binance": {
            "USD": {"Buy": binancePrice.buy_egp, "Sell": binancePrice.sell_egp},
            "EUR": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.eur, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.eur, 2),
            },
            "GBP": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.gbp, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.gbp, 2),
            },
            "SAR": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.sar, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.sar, 2),
            },
            "KWD": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.kwd, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.kwd, 2),
            },
            "AED": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.aed, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.aed, 2),
            },
            "QAR": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.Qar, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.Qar, 2),
            },
            "JOD": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.jod, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.jod, 2),
            },
            "BHD": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.bhd, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.bhd, 2),
            },
            "OMR": {
                "Buy": round(binancePrice.buy_egp / foreignCurrency.omr, 2),
                "Sell": round(binancePrice.sell_egp / foreignCurrency.omr, 2),
            },
        },
        "BlackMarket": {
            "USD": {
                "Buy": blackmarketPrice.average_buy,
                "Sell": blackmarketPrice.average_sell,
            },
            "EUR": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.eur, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.eur, 2),
            },
            "GBP": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.gbp, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.gbp, 2),
            },
            "SAR": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.sar, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.sar, 2),
            },
            "KWD": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.kwd, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.kwd, 2),
            },
            "AED": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.aed, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.aed, 2),
            },
            "QAR": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.Qar, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.Qar, 2),
            },
            "JOD": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.jod, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.jod, 2),
            },
            "BHD": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.bhd, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.bhd, 2),
            },
            "OMR": {
                "Buy": round(blackmarketPrice.average_buy / foreignCurrency.omr, 2),
                "Sell": round(blackmarketPrice.average_sell / foreignCurrency.omr, 2),
            },
        },
    }

    return JsonResponse(response, safe=False)


@api_view(["POST"])
def Update5Min(request):
    check_and_update_time()
    data = json.loads(request.body)

    # Helper function to save objects
    def save_instance(model, instance_data):
        obj = model.objects.create(**instance_data)
        obj.save()

    # Create and save sarf object
    save_instance(sarf, data["blackMarket"]["sarf"])

    # Create and save egcurrency object
    save_instance(egcurrency, data["blackMarket"]["egcurrency"])

    # Create and save GPN object
    save_instance(GPN, data["blackMarket"]["GPN"])

    # Create and save realegp object
    save_instance(realegp, data["blackMarket"]["realegp"])

    # Create and save parallelrate object
    save_instance(parallelrate, data["blackMarket"]["parallelrate"])

    # Create and save souqtoday object
    save_instance(souqtoday, data["blackMarket"]["souqtoday"])

    # Create and save blackmarket object with additional ccr fields
    data["blackMarketAverage"]["average_buy"] = round(
        data["blackMarketAverage"]["average_buy"]
        * ((100 - data["blackMarketFactors"]["factor_buy"]) / 100),
        2,
    )
    data["blackMarketAverage"]["average_sell"] = round(
        data["blackMarketAverage"]["average_sell"]
        * ((100 - data["blackMarketFactors"]["factor_sell"]) / 100),
        2,
    )
    black_market_average_instance = data["blackMarketAverage"]
    black_market_average_instance["ccr_buy"] = round(
        ccr(blackmarket, "average_buy", black_market_average_instance["average_buy"]), 4
    )
    black_market_average_instance["ccr_sell"] = round(
        ccr(blackmarket, "average_sell", black_market_average_instance["average_sell"]),
        4,
    )
    save_instance(blackmarket, black_market_average_instance)

    # Create and save binance object
    save_instance(binance, data["binance"])

    # Create and save binance2 object with additional ccr fields
    binance_ccr = {
        "buy_egp_ccr": round(ccr(binance, "buy_egp", data["binance"]["buy_egp"]), 4),
        "sell_egp_ccr": round(ccr(binance, "sell_egp", data["binance"]["sell_egp"]), 4),
    }
    save_instance(binance2, binance_ccr)

    # Create and save gold_BTC object
    save_instance(gold_BTC, data["gold_BTC"])
    # Create and save gold_BTC_ingot object
    save_instance(gold_BTC_ingot, data["gold_BTC_ingot"])

    # Create and save gold_GPN object
    save_instance(gold_GPN, data["gold_GPN"])
    # Create and save gold_GPN_ingot object
    save_instance(gold_GPN_ingot, data["gold_GPN_ingot"])

    # Create and save gold_Final object
    save_instance(gold_Final, data["gold_Final"])
    # Create and save gold_Final_ingot object
    save_instance(gold_Final_ingot, data["gold_Final_ingot"])

    # Create and save gold_usd object
    save_instance(gold_usd, data["gold_usd"])
    # Create and save arbitrage object
    arbitrage_instance = {
        "comi": data["arbitrage"]["comi"],
        "egstock": (data["arbitrage"]["egstock"] == "Open"),
        "cbkd": data["arbitrage"]["cbkd"],
        "ukstock": (data["arbitrage"]["ukstock"] == "Open"),
    }
    save_instance(arbitrage, arbitrage_instance)

    # Create and save bankrate object
    bankrate_instance = data["bankrate"]
    bankrate_instance["Rub"] = round(float(rub()), 4)
    bankrate_instance["usd_ccr"] = round(
        ccr(bankrate, "usd", data["bankrate"]["usd"]), 4
    )
    save_instance(bankrate, bankrate_instance)

    BM_Price = (
        data["blackMarketAverage"]["average_buy"]
        + data["blackMarketAverage"]["average_sell"]
    ) / 2
    # Create and save blackmarket2 object
    blackmarket2_instance = {
        "eur2egp": round((BM_Price / data["bankrate"]["eur"]), 4),
        "sar2egp": round((BM_Price / data["bankrate"]["sar"]), 4),
        "kwd2egp": round((BM_Price / data["bankrate"]["kwd"]), 4),
        "aed2egp": round((BM_Price / data["bankrate"]["aed"]), 4),
        "Qar2egp": round((BM_Price / data["bankrate"]["Qar"]), 4),
        "jod2egp": round((BM_Price / data["bankrate"]["jod"]), 4),
        "bhd2egp": round((BM_Price / data["bankrate"]["bhd"]), 4),
        "omr2egp": round((BM_Price / data["bankrate"]["omr"]), 4),
        "gbp2egp": round((BM_Price / data["bankrate"]["gbp"]), 4),
        "Rub2egp": round((BM_Price / bankrate_instance["Rub"]), 4),
    }
    save_instance(blackmarket2, blackmarket2_instance)
    # Create and save arbitrage2 object
    comi2cbkd = data["arbitrage"]["comi"] / data["arbitrage"]["cbkd"]
    arbitrage2_instance = {
        "comi2cbkd": round(comi2cbkd, 4),
        "ccr_comi2cbkd": round(ccr(arbitrage2, "comi2cbkd", comi2cbkd), 4),
    }
    save_instance(arbitrage2, arbitrage2_instance)

    # Create and save gold2 object
    gold2_instance = {
        "gold_dollar": round(
            data["gold_Final"]["buy24"] / data["gold_usd"]["global_price"], 4
        ),
        "ccr_21": round(ccr(gold_Final, "buy21", data["gold_Final"]["buy21"]), 4),
        "ccr_24": round(ccr(gold_Final, "buy24", data["gold_Final"]["buy24"]), 4),
        "ccr_gold_dollar": round(
            ccr(
                gold2,
                "gold_dollar",
                data["gold_Final"]["buy24"] / data["gold_usd"]["global_price"],
            ),
            4,
        ),
    }
    save_instance(gold2, gold2_instance)

    update_x_plus()

    return JsonResponse(
        {"status": "success", "message": "Update5Min successful"}, safe=False
    )


@api_view(["POST"])
def Update15Min(request):
    update_x()
    return JsonResponse(
        {"status": "success", "message": "Update15Min successful"}, safe=False
    )


@api_view(["POST"])
def UpdateHour(request):
    update_history(history_hour, 1)
    return JsonResponse(
        {"status": "success", "message": "UpdateHour successful"}, safe=False
    )


@api_view(["POST"])
def UpdateDay(request):
    try:
        latest_credit_date = creditRating.objects.order_by("-time").first().Date
    except AttributeError:
        latest_credit_date = 0
    CreditRating(latest_credit_date)
    update_history(history_day, 14)
    return JsonResponse(
        {"status": "success", "message": "UpdateDay successful"}, safe=False
    )


def test(request):
    """tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    upgrade_token_usage(request, tokens)
    token_day_reset()"""
    return JsonResponse({"status": "success", "message": "Successful"}, safe=False)


def binance_endpoint(request):
    tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    binance1 = binance.objects.last()
    binance_data = binanceSerializer(binance1)

    binance2_ = binance2.objects.last()
    binance2_data = binance2Serializer(binance2_)

    response = {
        "status": "success",
        "message": "Request successful",
        "data": {
            "Trading": binance_data.data,
            "Rate": binance2_data.data
        }
    }
    upgrade_token_usage(request, tokens)
    return JsonResponse(response)


def blackmarket_endpoint(request):
    tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    blackmarket1 = blackmarket.objects.last()
    blackmarket_data = blackmarketSerializer(blackmarket1)
    blackmarket_data_2 = blackmarket2Serializer(blackmarket1)

    response = {
        "status": "success",
        "message": "Request successful",
        "data": {
            "Trading": blackmarket_data.data,
            "Rate": blackmarket_data_2.data,
        }
    }

    upgrade_token_usage(request, tokens)
    return JsonResponse(response)


def gold_endpoint(request):
    tokens = 10
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    gold_gram_price = gold_Final.objects.last()
    gold_gram_buy_data = GoldGramBuySerializer(gold_gram_price)
    gold_gram_sell_data = GoldGramSellSerializer(gold_gram_price)

    gold2_ = gold2.objects.last()
    gold_gram_rate_data = GoldGramRateSerializer(gold2_)
    gold_dollar_data = GoldDollarSerializer(gold2_)

    gold_global = gold_usd.objects.last()
    gold_global_data = GoldGlobalSerializer(gold_global)

    gold_ingot = gold_Final_ingot.objects.last()
    gold_ingot_buy_data = GoldIngotBuySerializer(gold_ingot)
    gold_ingot_sell_data = GoldIngotSellSerializer(gold_ingot)

    response = {
        "status": "success",
        "message": "Request successful",
        "data": {
            "Gram": {
                "Buy": gold_gram_buy_data.data,
                "Sell": gold_gram_sell_data.data,
                "Rate": gold_gram_rate_data.data,
                "GlobalPrice": gold_global_data.data,
            },
            "Dollar": gold_dollar_data.data,
            "Ingot": {
                "Buy": gold_ingot_buy_data.data,
                "Sell": gold_ingot_sell_data.data,
            },
        }
    }

    upgrade_token_usage(request, tokens)
    return JsonResponse(response)

def creditrating_endpoint(request):
    tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    credit_rating_sp = creditRating.objects.filter(Agency="S&P").last()
    credit_rating_sp_data = CreditRatingSerializer(credit_rating_sp)

    credit_rating_m = creditRating.objects.filter(Agency="Moody's").last()
    credit_rating_m_data = CreditRatingSerializer(credit_rating_m)

    response = {
        "status": "success",
        "message": "Request successful",
        "data": {
            "SP": credit_rating_sp_data.data,
            "Moodys": credit_rating_m_data.data,
        }
    }

    upgrade_token_usage(request, tokens)
    return JsonResponse(response)


def cibarbitrage_endpoint(request):
    tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    arbitrageStocks = arbitrage.objects.last()
    arbitrageStocks_data = arbitrageStocks_Serializer(arbitrageStocks)
    arbitrageStocks_time_data = arbitragetime_Serializer(arbitrageStocks)

    arbitrage_ = arbitrage2.objects.last()
    arbitrage_data = arbitrage_Serializer(arbitrage_)

    response = {
        "status": "success",
        "message": "Request successful",
        "data": {
            "Data": arbitrage_data.data,
            "Details": {
                "Stocks": arbitrageStocks_data.data,
                "Market": arbitrageStocks_time_data.data,
            }
        }
    }

    upgrade_token_usage(request, tokens)
    return JsonResponse(response)

def bankrate_endpoint(request):
    tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    usd2egp = bankrate.objects.last().usd
    rate = bankrate.objects.last().usd_ccr

    response = {
        "status": "success",
        "message": "Request successful",
        "data": {
            "price": usd2egp,
            "Rate": rate
        }
    }

    upgrade_token_usage(request, tokens)
    return JsonResponse(response)

def blackmarket_foreigncurrency_endpoint(request):
    tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    ForeignCurrency = blackmarket2.objects.last()
    ForeignCurrency_data = blackmarket3Serializer(ForeignCurrency)

    response = {
        "status": "success",
        "message": "Request successful",
        "data": ForeignCurrency_data.data
    }

    upgrade_token_usage(request, tokens)
    return JsonResponse(response)


def bankrate_foreigncurrency_endpoint(request):
    tokens = 5
    # Authenticate the request with a token limit
    error_response = check_key(request, tokens)
    # If there's an error response, return it
    if error_response:
        return error_response

    bankRateForeignCurrency = bankrate.objects.last()
    bankRateForeignCurrency_data = bankRateForeignCurrencySerializer(bankRateForeignCurrency)
    response = {
        "status": "success",
        "message": "Request successful",
        "data": bankRateForeignCurrency_data.data
    }

    upgrade_token_usage(request, tokens)
    return JsonResponse(response)