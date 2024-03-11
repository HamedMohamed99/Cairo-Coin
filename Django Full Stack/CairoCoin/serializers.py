from rest_framework import serializers
from .models import *
from django.utils.translation import gettext as _
from django.utils.translation import activate


class binanceSerializer(serializers.ModelSerializer):
    Buy = serializers.FloatField(source="buy_egp")
    Sell = serializers.FloatField(source="sell_egp")

    class Meta:
        model = binance
        fields = ["Buy", "Sell"]


class binance2Serializer(serializers.ModelSerializer):
    BuyChangeRate = serializers.FloatField(source="buy_egp_ccr")
    SellChangeRate = serializers.FloatField(source="sell_egp_ccr")

    class Meta:
        model = binance2
        fields = ["BuyChangeRate", "SellChangeRate"]


# ----------------------------------------------------------------------------------------------------


class blackmarketSerializer(serializers.ModelSerializer):
    Buy = serializers.FloatField(source="average_buy")
    Sell = serializers.FloatField(source="average_sell")

    class Meta:
        model = blackmarket
        fields = ["Buy", "Sell"]


class blackmarket2Serializer(serializers.ModelSerializer):
    BuyChangeRate = serializers.FloatField(source="ccr_buy")
    SellChangeRate = serializers.FloatField(source="ccr_sell")

    class Meta:
        model = blackmarket
        fields = ["BuyChangeRate", "SellChangeRate"]


# ----------------------------------------------------------------------------------------------------


class bankrateSerializer(serializers.ModelSerializer):
    Price = serializers.FloatField(source="usd")
    Rate = serializers.FloatField(source="usd_ccr")

    class Meta:
        model = bankrate
        fields = ["Price", "Rate"]


# ----------------------------------------------------------------------------------------------------


class bankRateForeignCurrencySerializer(serializers.ModelSerializer):
    EUR = serializers.SerializerMethodField()
    GBP = serializers.SerializerMethodField()
    SAR = serializers.SerializerMethodField()
    KWD = serializers.SerializerMethodField()
    AED = serializers.SerializerMethodField()
    QAR = serializers.SerializerMethodField()
    JOD = serializers.SerializerMethodField()
    BHD = serializers.SerializerMethodField()
    OMR = serializers.SerializerMethodField()

    class Meta:
        model = bankrate
        fields = ["EUR", "GBP", "SAR", "KWD", "AED", "QAR", "JOD", "BHD", "OMR"]

    def get_EUR(self, obj):
        return round(self.get_usd_value() / obj.eur, 2)

    def get_GBP(self, obj):
        return round(self.get_usd_value() / obj.gbp, 2)

    def get_SAR(self, obj):
        return round(self.get_usd_value() / obj.sar, 2)

    def get_KWD(self, obj):
        return round(self.get_usd_value() / obj.kwd, 2)

    def get_AED(self, obj):
        return round(self.get_usd_value() / obj.aed, 2)

    def get_QAR(self, obj):
        return round(self.get_usd_value() / obj.Qar, 2)

    def get_JOD(self, obj):
        return round(self.get_usd_value() / obj.jod, 2)

    def get_BHD(self, obj):
        return round(self.get_usd_value() / obj.bhd, 2)

    def get_OMR(self, obj):
        return round(self.get_usd_value() / obj.omr, 2)

    def get_usd_value(self):
        return bankrate.objects.values_list("usd", flat=True).last()


# ----------------------------------------------------------------------------------------------------


class blackmarket3Serializer(serializers.ModelSerializer):
    EUR = serializers.FloatField(source="eur2egp")
    SAR = serializers.FloatField(source="sar2egp")
    KWD = serializers.FloatField(source="kwd2egp")
    AED = serializers.FloatField(source="aed2egp")
    QAR = serializers.FloatField(source="Qar2egp")
    JOD = serializers.FloatField(source="jod2egp")
    BHD = serializers.FloatField(source="bhd2egp")
    OMR = serializers.FloatField(source="omr2egp")
    GBP = serializers.FloatField(source="gbp2egp")

    class Meta:
        model = blackmarket2
        fields = ["EUR", "GBP", "SAR", "KWD", "AED", "QAR", "JOD", "BHD", "OMR"]


# ----------------------------------------------------------------------------------------------------


class arbitrageStocks_Serializer(serializers.ModelSerializer):
    COMI = serializers.FloatField(source="comi")
    CBKD = serializers.FloatField(source="cbkd")

    class Meta:
        model = arbitrage
        fields = ["COMI", "CBKD"]


class arbitragetime_Serializer(serializers.ModelSerializer):
    Egypt = serializers.BooleanField(source="egstock")
    London = serializers.BooleanField(source="ukstock")

    class Meta:
        model = arbitrage
        fields = ["Egypt", "London"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        for field in ["Egypt", "London"]:
            value = representation.get(field)
            representation[field] = "Open" if value else "Close"
        return representation


class arbitrage_Serializer(serializers.ModelSerializer):
    DollarPrice = serializers.FloatField(source="comi2cbkd")
    Rate = serializers.FloatField(source="ccr_comi2cbkd")

    class Meta:
        model = arbitrage2
        fields = ["DollarPrice", "Rate"]


# ----------------------------------------------------------------------------------------------------


class GoldGramBuySerializer(serializers.ModelSerializer):
    K21 = serializers.FloatField(source="buy21")
    K24 = serializers.FloatField(source="buy24")

    class Meta:
        model = gold_Final
        fields = ["K21", "K24"]


class GoldGramSellSerializer(serializers.ModelSerializer):
    K21 = serializers.FloatField(source="sell21")
    K24 = serializers.FloatField(source="sell24")

    class Meta:
        model = gold_Final
        fields = ["K21", "K24"]


class GoldGramRateSerializer(serializers.ModelSerializer):
    K21 = serializers.FloatField(source="ccr_21")
    K24 = serializers.FloatField(source="ccr_24")

    class Meta:
        model = gold2
        fields = ["K21", "K24"]


class GoldDollarSerializer(serializers.ModelSerializer):
    Price = serializers.FloatField(source="gold_dollar")
    Rate = serializers.FloatField(source="ccr_gold_dollar")

    class Meta:
        model = gold2
        fields = ["Price", "Rate"]


class GoldGlobalSerializer(serializers.ModelSerializer):
    K24 = serializers.FloatField(source="global_price")

    class Meta:
        model = gold_usd
        fields = ["K24"]


class GoldIngotBuySerializer(serializers.ModelSerializer):
    G5 = serializers.FloatField(source="buy_5g")
    G10 = serializers.FloatField(source="buy_10g")
    G20 = serializers.FloatField(source="buy_20g")
    Ounce = serializers.FloatField(source="buy_ounce")
    G50 = serializers.FloatField(source="buy_50g")
    G100 = serializers.FloatField(source="buy_100g")
    HalfPound = serializers.FloatField(source="buy_halfPound")
    Pound = serializers.FloatField(source="buy_pound")

    class Meta:
        model = gold_Final_ingot
        fields = ["G5", "G10", "G20", "Ounce", "G50", "G100", "HalfPound", "Pound"]


class GoldIngotSellSerializer(serializers.ModelSerializer):
    G5 = serializers.FloatField(source="sell_5g")
    G10 = serializers.FloatField(source="sell_10g")
    G20 = serializers.FloatField(source="sell_20g")
    Ounce = serializers.FloatField(source="sell_ounce")
    G50 = serializers.FloatField(source="sell_50g")
    G100 = serializers.FloatField(source="sell_100g")
    HalfPound = serializers.FloatField(source="sell_halfPound")
    Pound = serializers.FloatField(source="sell_pound")

    class Meta:
        model = gold_Final_ingot
        fields = ["G5", "G10", "G20", "Ounce", "G50", "G100", "HalfPound", "Pound"]


class CreditRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = creditRating
        fields = ["Rating", "Outlook", "Date"]


class XSerializer(serializers.ModelSerializer):
    Rate = serializers.FloatField(source="rate")
    Value = serializers.FloatField(source="index")

    class Meta:
        model = x
        fields = ["Rate", "Value"]
