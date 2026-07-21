from django.db import models
from django.contrib.auth.models import User

class Stock(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="stocks"
    )

    company_name = models.CharField(max_length=100)
    symbol = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField()
    buy_price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField(auto_now_add=True)

    @property
    def invested_amount(self):
        return self.buy_price * self.quantity

    @property
    def current_value(self):
        return self.current_price * self.quantity

    @property
    def profit_loss(self):
        return self.current_value - self.invested_amount

    def __str__(self):
        return f"{self.company_name} ({self.symbol})"
