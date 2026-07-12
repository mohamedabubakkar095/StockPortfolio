import yfinance as yf

from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from openpyxl import Workbook
from django.http import HttpResponse

from .models import Stock
from .serializers import StockSerializer, RegisterSerializer
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from django.http import HttpResponse

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


class RefreshPriceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stocks = Stock.objects.filter(user=request.user)

        updated = []

        for stock in stocks:
            try:
                ticker = yf.Ticker(stock.symbol)
                info = ticker.fast_info

                if "lastPrice" in info:
                    stock.current_price = float(info["lastPrice"])
                    stock.save()

                    updated.append({
                        "symbol": stock.symbol,
                        "price": stock.current_price,
                    })

            except Exception:
                pass

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
        ws.title = "Portfolio"

        ws.append([
            "Company",
            "Symbol",
            "Quantity",
            "Buy Price",
            "Current Price",
            "Investment",
            "Current Value",
            "Profit/Loss",
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

        data = [
            [
                "Company",
                "Symbol",
                "Qty",
                "Buy",
                "Current",
                "Profit/Loss",
            ]
        ]

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
            ("BACKGROUND", (0,0), (-1,0), colors.grey),
            ("TEXTCOLOR", (0,0), (-1,0), colors.whitesmoke),
            ("GRID",(0,0),(-1,-1),1,colors.black),
            ("BACKGROUND",(0,1),(-1,-1),colors.beige),
        ]))

        doc.build([table])

        return response