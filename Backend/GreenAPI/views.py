from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.cache import cache_page
from rest_framework.permissions import AllowAny
from pymongo import MongoClient
from bson.json_util import dumps, loads
import requests
import yfinance as yf   
from django.views import View
from django.http import JsonResponse
from django.core.cache import cache
from django.conf import settings
from datetime import datetime, timedelta
import finnhub

CONNECTION_STRING = "mongodb+srv://vishalgawali2002:SsOrwk3GyqzYhnoI@cluster0.xkevobu.mongodb.net/?retryWrites=true&ssl=true&tlsAllowInvalidCertificates=true&w=majority&appName=Cluster0"
def connection(collection):
    client = MongoClient(CONNECTION_STRING)
    db = client['GreenStockApp']
    coll = db[collection]
    return coll

@api_view(['GET'])
@permission_classes([AllowAny])
@cache_page(60 * 15)  # Cache for 15 minutes
def get_stocks_index(request):
    coll = connection(collection="StockIndex")
    stocks = coll.find()
    stocks_list = loads(dumps(stocks))
    serialized_stocks = dumps(stocks_list)
    return JsonResponse(serialized_stocks, safe=False)

# views.py


class GreenNewsView(View):
    CACHE_KEY = 'green_news'
    CACHE_TIMEOUT = 2 * 60 * 60  # 4 hours in seconds

    def get(self, request):
        # Try to get data from cache
        news_data = cache.get(self.CACHE_KEY)

        if news_data is None:
            # If not in cache, fetch new data
            news_data = self.fetch_green_news()
            
            if news_data:
                # Store in cache
                cache.set(self.CACHE_KEY, news_data, self.CACHE_TIMEOUT)
        return JsonResponse(news_data, safe=False)

    def fetch_green_news(self):
        api_key = settings.FINNHUB_API_KEY
        finnhub_client = finnhub.Client(api_key)

        try:
            news_data = finnhub_client.general_news('green Investment', min_id=0)

           #TODO Green and ESG Filtering

            return news_data

        except requests.RequestException as e:
            print(f"Error fetching news: {e}")
            return []

class StockDetailsView(View):

    def get(self, request, ticker):
        cache_key = f'stock_data_{ticker}'
        stock_data = cache.get(cache_key)

        if not stock_data:
            stock_data = self.fetch_stock_data(ticker)
            if stock_data:
                cache.set(cache_key, stock_data, timeout=120)  # Cache timeout set to 120 seconds (2 minutes)
            else:
                return JsonResponse({"error": "Stock not found"}, status=404)

        return JsonResponse(stock_data)

    def fetch_stock_data(self, ticker):
        stock_collection = connection('Stocks')
        stock_data = stock_collection.find_one({"ticker": ticker})
        if stock_data:
            stock_data = loads(dumps(stock_data))
            stock_data.pop('_id', None)
        return stock_data


def get_stock_history(request, ticker, time_frame):
    if not ticker:
        return JsonResponse({"error": "Ticker symbol is required."}, status=400)
    if time_frame not in ['1d', '1m', '1y', 'all']:
        return JsonResponse({"error": "Invalid time frame. Valid options are '1d', '1m', '1y', 'all'."}, status=400)

    stock = yf.Ticker(ticker)
    end_date = datetime.now()

    if time_frame == '1d':
        start_date = end_date
    elif time_frame == '1m':
        start_date = end_date.replace(month=end_date.month - 1)
    elif time_frame == '1y':
        start_date = end_date.replace(year=end_date.year - 1)
    elif time_frame == 'all':
        start_date = None  # yf.Ticker.history defaults to max history when start is None

    if start_date:
        historical_prices = stock.history(start=start_date.strftime('%Y-%m-%d'), end=end_date.strftime('%Y-%m-%d'))
    else:
        historical_prices = stock.history(period="max")

    historical_values = []

    for date, row in historical_prices.iterrows():
        date = date.to_pydatetime().replace(tzinfo=None)  # Make date timezone naive
        historical_values.append({
            "date": date.strftime('%Y-%m-%d'), 
            "value": row['Close']
        })

    return JsonResponse(historical_values, safe=False)