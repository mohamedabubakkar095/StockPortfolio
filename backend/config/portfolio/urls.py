from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ExportPDFView

from .views import (
    StockListView,
    StockDetailView,
    RegisterView,
    RefreshPriceView,
    ExportExcelView,
)
urlpatterns = [
    path("stocks/", StockListView.as_view()),
    path("stocks/<int:pk>/", StockDetailView.as_view()),
    path("register/", RegisterView.as_view()),

    path("login/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),

    path("refresh-prices/", RefreshPriceView.as_view()),
    path("export-excel/", ExportExcelView.as_view(), name="export_excel"),
    path("export-pdf/", ExportPDFView.as_view()),
]