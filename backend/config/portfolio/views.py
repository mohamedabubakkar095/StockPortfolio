from django.contrib.auth.models import User
from rest_framework import generics

from .models import Stock
from .serializers import StockSerializer, RegisterSerializer


class StockListView(generics.ListCreateAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer