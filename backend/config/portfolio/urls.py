from django.urls import path
from .views import (
    StockListView,
    StockDetailView,
    RegisterView,
    RefreshPriceView,
    ExportExcelView,
    ExportPDFView,
    ProfileView,
    PasswordChangeView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    StockListView,
    StockDetailView,
    RegisterView,
    RefreshPriceView,
    ExportExcelView,
    ExportPDFView,
    ProfileView,
)

from .views import (
    StockListView,
    StockDetailView,
    RegisterView,
    RefreshPriceView,
    ExportExcelView,
    ExportPDFView,
)

urlpatterns = [
    # Authentication
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),

    # Stock CRUD
    path("stocks/", StockListView.as_view(), name="stock_list"),
    path("stocks/<int:pk>/", StockDetailView.as_view(), name="stock_detail"),

    # Portfolio Features
    path(
        "refresh-prices/",
        RefreshPriceView.as_view(),
        name="refresh_prices",
    ),
    path(
        "export-excel/",
        ExportExcelView.as_view(),
        name="export_excel",
    ),
    path(
    "change-password/",
    PasswordChangeView.as_view(),
    name="change-password"
),
    path(
        "export-pdf/",
        ExportPDFView.as_view(),
        name="export_pdf",
    ),
]