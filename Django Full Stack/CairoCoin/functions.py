import csv
from dateutil.relativedelta import relativedelta
from datetime import datetime, timedelta, timezone
from django.db.models import Avg
from .models import *
from django.db import IntegrityError
import requests
from bs4 import BeautifulSoup


# calc current change rate
def ccr(model, column, current, day_start=1.5, day_end=0.5):
    start_time = datetime.now(timezone.utc) - relativedelta(days=day_start)
    end_time = datetime.now(timezone.utc) - relativedelta(days=day_end)

    data = model.objects.filter(time__range=(start_time, end_time)).values_list(
        column, flat=True
    )

    if len(data) > 0:
        # Filter out elements equal to 0
        data = [value for value in data if value != 0]
        # Calculate the average
        average = sum(data) / len(data) if len(data) > 0 else 0

        rate = (current - average) * 100 / average
        return rate

    else:
        return 0


def export_to_csv(model, filename):
    queryset = model.objects.all()
    fields = [field.name for field in model._meta.fields]

    with open(filename, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        # Write the header
        writer.writerow(fields)
        # Write the data
        for obj in queryset:
            writer.writerow([getattr(obj, field) for field in fields])


def convert_datetime(date_str, time_str):
    # Parse date and time strings from the CSV file
    csv_datetime_str = f"{date_str} {time_str}"

    # Assuming your CSV date and time format is 'yyyy.mm.dd HH:MM'
    csv_datetime = datetime.strptime(csv_datetime_str, "%Y.%m.%d %H:%M")

    # Convert to Django's datetime format with timezone
    django_datetime = timezone.make_aware(csv_datetime, timezone.utc)

    return django_datetime


def replace_non_numeric_with_previous(row, previous_row):
    for key, value in row.items():
        # Skip the date column
        if key == "time":
            continue

        # Replace non-numeric values with the previous row's value
        if isinstance(value, str) and not value.replace(".", "", 1).isdigit():
            row[key] = previous_row.get(key, value)
    return row


def import_from_csv(model, filename, date_column, time_column):
    previous_row = None

    with open(filename, "r") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:

            # Convert date and time to Django format
            django_datetime = convert_datetime(row[date_column], row[time_column])

            # Update the row dictionary with the converted datetime
            row["time"] = django_datetime

            # Remove the original date and time columns
            del row[date_column]
            del row[time_column]

            # Replace non-numeric values with the previous row's values
            if previous_row:
                row = replace_non_numeric_with_previous(row, previous_row)

            # Create a new model instance and save it
            model.objects.create(**row)

            # Update the previous row
            previous_row = row


def GetAverageDataForTimeBack(model, column, time_in_hours=1):
    # Calculate the timestamp for one hour ago
    time = datetime.now(timezone.utc) - timedelta(hours=time_in_hours)

    # Query to retrieve all data added in the last hour
    recent_data = model.objects.filter(time__gte=time).values_list(column, flat=True)

    # Filter out elements equal to 0
    recent_data = [value for value in recent_data if value != 0]

    average = sum(recent_data) / len(recent_data) if len(recent_data) > 0 else 0
    return round(average, 4)


def update_history(model, time_in_hours):
    if model == "histoy_day":
        time_binance = 24
    else:
        time_binance = time_in_hours
    new_data = {
        "bm_buy": GetAverageDataForTimeBack(blackmarket, "average_buy", time_in_hours),
        "bm_ccr_buy": GetAverageDataForTimeBack(blackmarket, "ccr_buy", time_in_hours),
        "bi_buy": GetAverageDataForTimeBack(binance, "buy_egp", time_binance),
        "bi_ccr_buy": GetAverageDataForTimeBack(binance2, "buy_egp_ccr", time_binance),
        "br_usd2egp": GetAverageDataForTimeBack(bankrate, "usd", time_in_hours),
        "br_ccr_usd2egp": GetAverageDataForTimeBack(bankrate, "usd_ccr", time_in_hours),
        "cib_comi2cbkd": GetAverageDataForTimeBack(
            arbitrage2, "comi2cbkd", time_in_hours
        ),
        "cib_ccr_comi2cbkd": GetAverageDataForTimeBack(
            arbitrage2, "ccr_comi2cbkd", time_in_hours
        ),
        "gold_24": GetAverageDataForTimeBack(gold_Final, "buy24", time_in_hours),
        "gold_21": GetAverageDataForTimeBack(gold_Final, "buy21", time_in_hours),
        "gold_dollar": GetAverageDataForTimeBack(gold2, "gold_dollar", time_in_hours),
        "gold_ccr_dollar": GetAverageDataForTimeBack(
            gold2, "ccr_gold_dollar", time_in_hours
        ),
        "gold_usd": GetAverageDataForTimeBack(gold_usd, "global_price", time_in_hours),
    }

    # Create a new record
    obj = model.objects.create(**new_data)

    # Save the record
    obj.save()

    return new_data


def GetAverageDataForTimeBackForX(model, column, time_in_min=30):
    # Calculate the timestamp for one hour ago
    time = datetime.now(timezone.utc) - timedelta(minutes=time_in_min)

    # Query to retrieve all data added in the last hour
    recent_data = model.objects.filter(time__gte=time).values_list(column, flat=True)

    # Filter out elements equal to 0
    recent_data = [value for value in recent_data if value != 0]

    average = sum(recent_data) / len(recent_data) if len(recent_data) > 0 else 0
    return round(average, 4)


def historyForX(time_in_min):
    data = {
        "bm_ccr_buy": GetAverageDataForTimeBackForX(
            blackmarket, "ccr_buy", time_in_min
        ),
        "bi_ccr_buy": GetAverageDataForTimeBackForX(
            binance2, "buy_egp_ccr", time_in_min
        ),
        "cib_ccr_comi2cbkd": GetAverageDataForTimeBackForX(
            arbitrage2, "ccr_comi2cbkd", time_in_min
        ),
        "gold_ccr_dollar": GetAverageDataForTimeBackForX(
            gold2, "ccr_gold_dollar", time_in_min
        ),
    }
    return data


def Rate2Index(rate):
    value = abs(rate)

    thresholds = [0.1, 0.2, 0.5, 0.9, 1.3, 1.7, 2.2, 3, 4, 5, 6]

    for i, threshold in enumerate(thresholds):
        if value < threshold:
            return i

    return 99


def update_x():
    data = historyForX(60)

    rate = (
        (data["bi_ccr_buy"] * 0.5)
        + (data["bm_ccr_buy"] * 0.4)
        + (data["gold_ccr_dollar"] * 0.1)
    )
    direction = rate / abs(rate) if rate != 0 else 1
    new_data = {
        "rate": round(rate, 5),
        "index": Rate2Index(rate) * direction,
    }

    # Create a new record
    obj = x.objects.create(**new_data)

    # Save the record
    obj.save()


def Rate2Indexplus(rate):
    value = abs(rate)
    direction = rate / value if rate != 0 else 1

    thresholds = [0.1, 0.2, 0.26, 0.38, 0.5, 1]

    for i, threshold in enumerate(thresholds):
        if value < threshold:
            return i * direction

    return 99 * direction


def update_x_plus(first_time=1, second_time=0.5):
    # Get the last three records for each model
    bm_buy_records = blackmarket.objects.last().average_buy
    bi_buy_records = binance.objects.last().buy_egp
    gold_records = gold2.objects.last().gold_dollar
    bank_records = bankrate.objects.last().usd

    start = first_time / 24
    end = second_time / 24

    bm_ccr_buy = ccr(blackmarket, "average_buy", bm_buy_records, start, end)
    bi_ccr_buy = ccr(binance, "buy_egp", bi_buy_records, start, end)
    gold_ccr = ccr(gold2, "gold_dollar", gold_records, start, end)
    bank_ccr = ccr(bankrate, "usd", bank_records, start, end)

    new_data = {
        "rate_bi": round(bi_ccr_buy, 4),
        "index_bi": Rate2Indexplus(bi_ccr_buy),
        "rate_bm": round(bm_ccr_buy, 4),
        "index_bm": Rate2Indexplus(bm_ccr_buy),
        "rate_g": round(gold_ccr, 4),
        "index_g": Rate2Indexplus(gold_ccr),
        "rate_b": round(bank_ccr, 4),
        "index_b": Rate2Indexplus(bank_ccr),
    }

    # Create a new record
    obj = xPlus.objects.create(**new_data)

    # Save the record
    obj.save()


def CreditRating(last_date):
    # Set a User-Agent header to mimic a browser
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }

    # Use a session to persist cookies between requests
    session = requests.Session()

    # Send an HTTP GET request to the URL
    response = session.get("https://tradingeconomics.com/egypt/rating", headers=headers)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the HTML content of the webpage
        soup = BeautifulSoup(response.content, "html.parser")

        # Find the table with the desired data
        table = soup.find("table", class_="table table-hover")

        # Find all <tr> tags within the <table>
        rows = table.find_all("tr")

        data_set_list = []

        # Check if there is a second <tr> tag
        if len(rows) > 1:
            # Extract and print the data from the second <tr> tag
            for row in rows[1:]:
                tds = row.find_all("td")

                if tds[-1].text.strip() != last_date:
                    data_set = {}
                    data_set["Agency"] = tds[0].text.strip()
                    data_set["Rating"] = tds[1].text.strip()
                    data_set["Outlook"] = tds[2].text.strip()
                    data_set["Date"] = tds[3].text.strip()

                    data_set_list.append(data_set)

                else:
                    break

        try:
            rates = data_set_list

            for rate in reversed(rates):

                # Create a new record
                obj = creditRating.objects.create(**rate)

                # Save the record
                obj.save()

        except IntegrityError as e:
            # Handle database integrity errors
            print(f"Database error: {e}")

    else:
        print(f"Failed to retrieve the webpage. Status code: {response.status_code}")


def rub():
    url = "https://api.binance.com/api/v3/avgPrice?symbol=USDTRUB"
    try:
        response = requests.get(url)

        if response.status_code == 200:
            json_output = response.json()
            return json_output["price"]
        else:
            return 0
    except:
        return 0
