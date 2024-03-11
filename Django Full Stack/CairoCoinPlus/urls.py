from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("forbidden", views.forbidden, name="forbidden"),
    path("verification/<str:name>/", views.verification, name="verification"),

    path("home", views.home, name="home"),
    path("lite", views.lite, name="lite"),
    path("homeSub", views.homeSub, name="homeSub"),
    path("snip", views.snip, name="snip"),
    path("keys", views.keys, name="keys"),
    path("usage", views.usage, name="usage"),


]
