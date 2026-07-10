from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("portfolio.urls")),

    path("api/login/", TokenObtainPairView.as_view()),
    path("api/refresh/", TokenRefreshView.as_view()),
]