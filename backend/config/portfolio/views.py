
import yfinance as yf
from openpyxl import Workbook
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle

from django.contrib.auth.models import User
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Stock
from .serializers import RegisterSerializer, StockSerializer

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "date_joined": user.date_joined,
        })

    def put(self, request):
        user = request.user

        user.first_name = request.data.get(
            "first_name",
            user.first_name
        )

        user.last_name = request.data.get(
            "last_name",
            user.last_name
        )

        user.email = request.data.get(
            "email",
            user.email
        )

        user.save()

        return Response({
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })
    
class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user

        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response(
                {
                    "error": "Old password and new password are required"
                },
                status=400
            )

        if not user.check_password(old_password):
            return Response(
                {
                    "error": "Old password is incorrect"
                },
                status=400
            )

        user.set_password(new_password)
        user.save()

        return Response({
            "message": "Password changed successfully"
        })


class StockListView(generics.ListCreateAPIView):
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Stock.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StockDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Stock.objects.filter(user=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "date_joined": user.date_joined,
        })


class RefreshPriceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stocks = Stock.objects.filter(user=request.user)
        if not stocks.exists():
            return Response({"message": "No stocks to update", "updated": []})

        # Batch download stock prices in 1 network call instead of a loop
        symbols = [stock.symbol for stock in stocks]
        try:
            data = yf.download(tickers=symbols, period="1d", progress=False)["Close"]
        except Exception as e:
            return Response({"error": f"Failed to fetch market data: {str(e)}"}, status=500)

        updated = []
        for stock in stocks:
            try:
                # Handle single vs multiple ticker return structure from yfinance
                if len(symbols) == 1:
                    latest_price = data.iloc[-1]
                else:
                    latest_price = data[stock.symbol].iloc[-1]

                if not pd.isna(latest_price):
                    stock.current_price = float(latest_price)
                    stock.save()
                    updated.append({
                        "symbol": stock.symbol,
                        "price": stock.current_price,
                    })
            except Exception as e:
                print(f"Error updating {stock.symbol}: {e}")

        return Response({
            "message": "Prices Updated Successfully",
            "updated": updated,
        })


class ExportExcelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stocks = Stock.objects.filter(user=request.user)

        wb = Workbook()
        ws = wb.active
        ws.title = 'Portfolio'

        ws.append([
            'Company', 'Symbol', 'Quantity', 'Buy Price',
            'Current Price', 'Investment', 'Current Value', 'Profit/Loss'
        ])

        for stock in stocks:
            ws.append([
                stock.company_name,
                stock.symbol,
                stock.quantity,
                float(stock.buy_price),
                float(stock.current_price),
                float(stock.invested_amount),
                float(stock.current_value),
                float(stock.profit_loss),
            ])
       
        # Correctly indented inside the get() method
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = 'attachment; filename="portfolio.xlsx"'

        wb.save(response)
        return response    


class ExportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stocks = Stock.objects.filter(user=request.user)

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="portfolio.pdf"'

        doc = SimpleDocTemplate(response)

        data = [[
            "Company",
            "Symbol",
            "Qty",
            "Buy Price",
            "Current Price",
            "Profit/Loss",
        ]]

        for stock in stocks:
            data.append([
                stock.company_name,
                stock.symbol,
                stock.quantity,
                float(stock.buy_price),
                float(stock.current_price),
                float(stock.profit_loss),
            ])

        table = Table(data)

        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ]))

        doc.build([table])
        return response