from django.db import models

class Stock(models.Model):
    symbol = models.CharField(max_length=10)
    company_name = models.CharField(max_length=100)
    current_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.symbol