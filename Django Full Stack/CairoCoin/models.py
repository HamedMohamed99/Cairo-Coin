from django.db import models
from django.utils import timezone


class binance(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_egp = models.FloatField()
    sell_egp = models.FloatField()


class binance2(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_egp_ccr = models.FloatField()
    sell_egp_ccr = models.FloatField()


class sarf(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy = models.FloatField()
    sell = models.FloatField()


class egcurrency(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy = models.FloatField()
    sell = models.FloatField()


class GPN(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy = models.FloatField()
    sell = models.FloatField(default=0)


class realegp(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy = models.FloatField()
    sell = models.FloatField(default=0)


class parallelrate(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy = models.FloatField(default=0)
    sell = models.FloatField()


class souqtoday(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy = models.FloatField()
    sell = models.FloatField()


class blackmarket(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    average_buy = models.FloatField()
    average_sell = models.FloatField()
    ccr_buy = models.FloatField()
    ccr_sell = models.FloatField()


class bankrate(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    usd = models.FloatField()
    eur = models.FloatField()
    sar = models.FloatField()
    kwd = models.FloatField()
    aed = models.FloatField()
    Qar = models.FloatField()
    jod = models.FloatField()
    bhd = models.FloatField()
    omr = models.FloatField()
    gbp = models.FloatField()
    Rub = models.FloatField()
    usd_ccr = models.FloatField()


class blackmarket2(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    eur2egp = models.FloatField()
    sar2egp = models.FloatField()
    kwd2egp = models.FloatField()
    aed2egp = models.FloatField()
    Qar2egp = models.FloatField()
    jod2egp = models.FloatField()
    bhd2egp = models.FloatField()
    omr2egp = models.FloatField()
    gbp2egp = models.FloatField()
    Rub2egp = models.FloatField()


class arbitrage(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    comi = models.FloatField()
    egstock = models.BooleanField()
    cbkd = models.FloatField()
    ukstock = models.BooleanField()


class arbitrage2(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    comi2cbkd = models.FloatField()
    ccr_comi2cbkd = models.FloatField()


class gold_BTC(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy21 = models.FloatField()
    sell21 = models.FloatField()
    buy24 = models.FloatField()
    sell24 = models.FloatField()


class gold_BTC_ingot(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_5g = models.FloatField()
    sell_5g = models.FloatField()
    buy_10g = models.FloatField()
    sell_10g = models.FloatField()
    buy_20g = models.FloatField()
    sell_20g = models.FloatField()
    buy_ounce = models.FloatField()
    sell_ounce = models.FloatField()
    buy_50g = models.FloatField()
    sell_50g = models.FloatField()
    buy_100g = models.FloatField()
    sell_100g = models.FloatField()
    buy_halfPound = models.FloatField()
    sell_halfPound = models.FloatField()
    buy_pound = models.FloatField()
    sell_pound = models.FloatField()


class gold_GPN(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy21 = models.FloatField()
    sell21 = models.FloatField()
    buy24 = models.FloatField()
    sell24 = models.FloatField()


class gold_GPN_ingot(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_5g = models.FloatField()
    sell_5g = models.FloatField()
    buy_10g = models.FloatField()
    sell_10g = models.FloatField()
    buy_20g = models.FloatField()
    sell_20g = models.FloatField()
    buy_ounce = models.FloatField()
    sell_ounce = models.FloatField()
    buy_50g = models.FloatField()
    sell_50g = models.FloatField()
    buy_100g = models.FloatField()
    sell_100g = models.FloatField()
    buy_halfPound = models.FloatField()
    sell_halfPound = models.FloatField()
    buy_pound = models.FloatField()
    sell_pound = models.FloatField()


class gold_ERA(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy21 = models.FloatField()
    sell21 = models.FloatField()
    buy24 = models.FloatField()
    sell24 = models.FloatField()


class gold_ERA_ingot(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_5g = models.FloatField()
    sell_5g = models.FloatField()
    buy_10g = models.FloatField()
    sell_10g = models.FloatField()
    buy_20g = models.FloatField()
    sell_20g = models.FloatField()
    buy_ounce = models.FloatField()
    sell_ounce = models.FloatField()
    buy_50g = models.FloatField()
    sell_50g = models.FloatField()
    buy_100g = models.FloatField()
    sell_100g = models.FloatField()
    buy_halfPound = models.FloatField()
    sell_halfPound = models.FloatField()
    buy_pound = models.FloatField()
    sell_pound = models.FloatField()


class gold_SAGHA(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy21 = models.FloatField()
    sell21 = models.FloatField()
    buy24 = models.FloatField()
    sell24 = models.FloatField()


class gold_SAGHA_ingot(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_5g = models.FloatField()
    sell_5g = models.FloatField()
    buy_10g = models.FloatField()
    sell_10g = models.FloatField()
    buy_20g = models.FloatField()
    sell_20g = models.FloatField()
    buy_ounce = models.FloatField()
    sell_ounce = models.FloatField()
    buy_50g = models.FloatField()
    sell_50g = models.FloatField()
    buy_100g = models.FloatField()
    sell_100g = models.FloatField()
    buy_halfPound = models.FloatField()
    sell_halfPound = models.FloatField()
    buy_pound = models.FloatField()
    sell_pound = models.FloatField()


class gold_LPG(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy21 = models.FloatField()
    sell21 = models.FloatField()
    buy24 = models.FloatField()
    sell24 = models.FloatField()


class gold_LPG_ingot(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_5g = models.FloatField()
    sell_5g = models.FloatField()
    buy_10g = models.FloatField()
    sell_10g = models.FloatField()
    buy_20g = models.FloatField()
    sell_20g = models.FloatField()
    buy_ounce = models.FloatField()
    sell_ounce = models.FloatField()
    buy_50g = models.FloatField()
    sell_50g = models.FloatField()
    buy_100g = models.FloatField()
    sell_100g = models.FloatField()
    buy_halfPound = models.FloatField()
    sell_halfPound = models.FloatField()
    buy_pound = models.FloatField()
    sell_pound = models.FloatField()


class gold_Final(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy21 = models.FloatField()
    sell21 = models.FloatField()
    buy24 = models.FloatField()
    sell24 = models.FloatField()


class gold_Final_ingot(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    buy_5g = models.FloatField()
    sell_5g = models.FloatField()
    buy_10g = models.FloatField()
    sell_10g = models.FloatField()
    buy_20g = models.FloatField()
    sell_20g = models.FloatField()
    buy_ounce = models.FloatField()
    sell_ounce = models.FloatField()
    buy_50g = models.FloatField()
    sell_50g = models.FloatField()
    buy_100g = models.FloatField()
    sell_100g = models.FloatField()
    buy_halfPound = models.FloatField()
    sell_halfPound = models.FloatField()
    buy_pound = models.FloatField()
    sell_pound = models.FloatField()


class gold_usd(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    global_price = models.FloatField()


class gold2(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    gold_dollar = models.FloatField()
    ccr_21 = models.FloatField()
    ccr_24 = models.FloatField()
    ccr_gold_dollar = models.FloatField()


class creditRating(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    Agency = models.TextField()
    Rating = models.TextField()
    Outlook = models.TextField()
    Date = models.TextField()


class history_hour(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    bm_buy = models.FloatField()
    bm_ccr_buy = models.FloatField()
    bi_buy = models.FloatField()
    bi_ccr_buy = models.FloatField()
    br_usd2egp = models.FloatField()
    br_ccr_usd2egp = models.FloatField()
    cib_comi2cbkd = models.FloatField()
    cib_ccr_comi2cbkd = models.FloatField()
    gold_24 = models.FloatField()
    gold_21 = models.FloatField()
    gold_dollar = models.FloatField()
    gold_ccr_dollar = models.FloatField()
    gold_usd = models.FloatField()


class history_day(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    bm_buy = models.FloatField()
    bm_ccr_buy = models.FloatField()
    bi_buy = models.FloatField()
    bi_ccr_buy = models.FloatField()
    br_usd2egp = models.FloatField()
    br_ccr_usd2egp = models.FloatField()
    cib_comi2cbkd = models.FloatField()
    cib_ccr_comi2cbkd = models.FloatField()
    gold_24 = models.FloatField()
    gold_21 = models.FloatField()
    gold_dollar = models.FloatField()
    gold_ccr_dollar = models.FloatField()
    gold_usd = models.FloatField()


class x(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    rate = models.FloatField()
    index = models.FloatField()


class xPlus(models.Model):
    id = models.BigAutoField(primary_key=True)
    time = models.DateTimeField(default=timezone.now)
    rate_bi = models.FloatField()
    index_bi = models.FloatField()
    rate_bm = models.FloatField()
    index_bm = models.FloatField()
    rate_g = models.FloatField()
    index_g = models.FloatField()
    rate_b = models.FloatField(default=0)
    index_b = models.FloatField(default=0)
