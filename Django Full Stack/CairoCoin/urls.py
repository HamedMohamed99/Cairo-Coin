from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("history", views.history, name="history"),
    path("Update5Min", views.Update5Min, name="Update5Min"),
    path("Update15Min", views.Update15Min, name="Update15Min"),
    path("UpdateHour", views.UpdateHour, name="UpdateHour"),
    path("UpdateDay", views.UpdateDay, name="UpdateDay"),
    path("historycreditrating", views.historyCreditRating, name="historycreditrating"),
    path("calculator", views.Calculator, name="calculator"),
    path("binance", views.binance_endpoint, name="binance"),
    path("black-market", views.blackmarket_endpoint, name="black-market"),
    path("gold", views.gold_endpoint, name="gold"),
    path("credit-rating", views.creditrating_endpoint, name="credit-rating"),
    path("cib-arbitrage", views.cibarbitrage_endpoint, name="cib-arbitrage"),
    path("bankrate", views.bankrate_endpoint, name="bankrate"),
    path("blackmarket-foreigncurrency", views.blackmarket_foreigncurrency_endpoint, name="blackmarket-foreigncurrency"),
    path("bankrate-foreigncurrency", views.bankrate_foreigncurrency_endpoint, name="bankrate-foreigncurrency"),
    path("test", views.test, name="test"),
]
