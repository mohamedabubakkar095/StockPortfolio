from django.urls import path
from .views import StockListView, RegisterView

urlpatterns = [
    path("stocks/", StockListView.as_view(), name="stock-list"),
    path("register/", RegisterView.as_view(), name="register"),
]
