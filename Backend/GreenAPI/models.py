from django.db import models

class StockIndex(models.Model):
    stock_ticker = models.CharField(max_length=10, unique=True)
    stock_company_name = models.CharField(max_length=255)
    ESG_score = models.FloatField()
    Green_score = models.FloatField()

