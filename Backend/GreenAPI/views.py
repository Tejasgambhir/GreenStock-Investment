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

    for stock in stocks_list:
        ticker = stock['ticker']
        stock_info_2 = yf.Ticker(ticker).history(period='1d')
        stock_info_1 = yf.Ticker(ticker).history(period='5d')
        if not stock_info_2.empty and not stock_info_1.empty:
            current_value = stock_info_2.iloc[-1]['Close']
            previous_value = stock_info_1.iloc[-2]['Close']
            value_change = current_value - previous_value
            value_percentage = (value_change / previous_value) * 100

            stock['current_value'] = current_value
            stock['previous_value'] = previous_value
            stock['value_change'] = value_change
            stock['value_percentage'] = value_percentage

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
    projection = {
            'companyname': 1,
            'industry': 1,
            'country': 1,
            'exchangename': 1,
            'Overall Score': 1,
            'Overall Transparency Score': 1,
            'Overall Score Global Rank': 1,
            'Overall Industry Rank': 1,
            'Overall Region Rank': 1,
            'dividend_yield': 1,
            'market_cap': 1,
            'Latest Score Date': 1,
        }
    def get(self, request, ticker):
        cache_key = f'stock_data_{ticker}'
        stock_data = cache.get(cache_key)

        if not stock_data:
            stock_data = self.fetch_stock_data(ticker)
            if stock_data:
                cache.set(cache_key, stock_data, timeout=120)  # Cache timeout set to 120 seconds (2 minutes)
            else:
                return JsonResponse({"error": "Stock not found"}, status=404)
        return JsonResponse(stock_data, safe=False)

    def fetch_stock_data(self, ticker):
        stock_collection = connection('Stocks')
        stock_data = stock_collection.find_one({"ticker": ticker},self.projection)
        if stock_data:
            stock_data = loads(dumps(stock_data))
            stock_data.pop('_id', None)
        return stock_data

from datetime import datetime, timedelta
import yfinance as yf
from django.http import JsonResponse

def get_stock_history(request, ticker, time_frame):
    if not ticker:
        return JsonResponse({"error": "Ticker symbol is required."}, status=400)
    if time_frame not in ['1m', '1y', 'all']:
        return JsonResponse({"error": "Invalid time frame. Valid options are '1m', '1y', 'all'."}, status=400)

    stock = yf.Ticker(ticker)
    end_date = datetime.now()


    if time_frame == '1m':
        start_date = end_date - timedelta(days=30)
    elif time_frame == '1y':
        start_date = end_date - timedelta(days=365)
    elif time_frame == 'all':
        start_date = datetime(2000, 1, 1) # yf.Ticker.history defaults to max history when start is None

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




import yfinance as yf
from django.views import View
from django.http import JsonResponse
from django.core.cache import cache
from threading import Timer

class CurrentStockValueView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.stock_updaters = {}
    def local_get(self,ticker):
        if ticker not in self.stock_updaters:
            self.schedule_update(ticker)
        cache_key = f'current_stock_value_{ticker}'
        stock_data = cache.get(cache_key)
        if not stock_data:
            stock_data = self.fetch_current_stock_value(ticker)
            if stock_data:
                cache.set(cache_key, stock_data)
        return stock_data
    
    def get(self, request,ticker):
        if ticker not in self.stock_updaters:
            self.schedule_update(ticker)
        
        cache_key = f'current_stock_value_{ticker}'
        stock_data = cache.get(cache_key)
        if not stock_data:
            stock_data = self.fetch_current_stock_value(ticker)
            if stock_data:
                cache.set(cache_key, stock_data)  # Cache timeout set to 120 seconds (2 minutes)
            else:
                return JsonResponse({"error": "Stock not found"}, status=404)

        return JsonResponse(stock_data, safe=False)

    def fetch_current_stock_value(self, ticker):
        try:
            stock = yf.Ticker(ticker)
            stock_info_1 = stock.history(period='5d')
            stock_info_2  = stock_info_1.tail(1)

            if not stock_info_2.empty and not stock_info_1.empty:
                current_value = stock_info_2.iloc[-1]['Close']
                previous_value = stock_info_1.iloc[-2]['Close']
                value_change = current_value - previous_value
                value_percentage = (value_change / previous_value) * 100

                stock_data = {
                    "ticker": ticker,
                    "current_value": current_value,
                    "value_change": value_change,
                    "value_percentage": value_percentage
                }

                return stock_data
            else:
                return None
        except Exception as e:
                return None

    def update_stock_value(self, ticker):
        cache_key = f'current_stock_value_{ticker}'
        stock_data = self.fetch_current_stock_value(ticker)
        if stock_data:
            cache.set(cache_key, stock_data, timeout=30)  # Cache timeout set to 30 seconds
        self.schedule_update(ticker)  # Reschedule the update

    def schedule_update(self, ticker):
        self.stock_updaters[ticker] = Timer(30.0, self.update_stock_value, [ticker])
        self.stock_updaters[ticker].start()

    def __del__(self):
        for updater in self.stock_updaters.values():
            updater.cancel()

class StockScoresView(View):
    def get(self, request, ticker):
        cache_key = f'stock_scores_{ticker}'
        stock_data = cache.get(cache_key)

        if not stock_data:
            stock_data = self.fetch_stock_scores(ticker)
            if stock_data:
                cache.set(cache_key, stock_data, timeout=120)  # Cache timeout set to 120 seconds (2 minutes)
            else:
                return JsonResponse({"error": "Stock not found"}, status=404)
        return JsonResponse(stock_data, safe=False)

    def fetch_stock_scores(self, ticker):
        stock_collection = connection('Stocks')
        stock_data = stock_collection.find_one({"ticker": ticker}, {"_id": 0,
                                                                     "green_score": 1,
                                                                       "Recommendation_score": 1,
                                                                         "Governance Pillar Score": 1,
                                                                         "Environmental Pillar Score": 1,
                                                                         "Social Pillar Score": 1,})
        if stock_data:
            stock_data = loads(dumps(stock_data))  # Convert MongoDB BSON to JSON
        return stock_data


# import requests
# import requests_cache
# import yfinance as yf
# import pandas as pd
# from goose3 import Goose
# from nltk.corpus import stopwords
# import nltk
# from collections import defaultdict
# from django.core.cache import cache
# from django.http import JsonResponse
# import json
# import sys
# import os



# def custom_clean_text(text):
#     # Add your custom text cleaning function here
#     return text

# class StockGreenScoresView(View):
#     nltk.download('stopwords')
#     DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')

#     def get(self, request, ticker):
#         cache_key = f'green_score_{ticker}'
#         cached_response = cache.get(cache_key)
#         sustainability_tokens = [
#     'CLEAN', 'ENERGY', 'GREEN', 'PLANET', 'EMISSIONS', 'NATURAL', 
#     'SUSTAINABLE', 'RENEWABLE', 'SOLAR', 'WIND', 'HYDRO', 'BIOFUEL', 
#     'ECO-FRIENDLY', 'RECYCLING', 'CONSERVATION', 'CARBON', 'FOOTPRINT', 
#     'OFFSET', 'CLIMATE', 'CHANGE', 'ENVIRONMENTAL', 'RESPONSIBILITY', 
#     'SOCIAL', 'GOVERNANCE', 'ESG', 'ETHICAL', 'RESPONSIBLE', 'INVESTMENT', 
#     'CIRCULAR', 'ECONOMY', 'WASTE', 'MANAGEMENT', 'POLLUTION', 'REDUCTION', 
#     'BIODIVERSITY', 'HABITAT', 'PRESERVATION', 'WILDLIFE', 'PROTECTION', 
#     'SUSTAINABILITY', 'WATER', 'EFFICIENCY', 'RENEWABLES', 'ELECTRIC VEHICLE', 
#     'GREENHOUSE', 'WASTE', 'NET', 'ZERO', 'CARBON', 'NEUTRAL', 'DECARBONIZATION',
#     'ECOLOGICAL', 'IMPACT', 'ORGANIC', 'FAIR', 'SOCIALJUSTICE', 'COMMUNITY', 'INCLUSION', 'GOVERNANCE', 'TRANSPARENCY', 
#     'ACCOUNTABILITY', 'ETHICS', 
#     'SUSTAINABILITY'
# ]

#         if cached_response:
#             return JsonResponse(cached_response, safe=False)

#         try:
#             session = requests_cache.CachedSession('yfinance.cache')
#             session.verify = False
            
#             stock = yf.Ticker(ticker, session=session)
#             stock_info_aggregated = []

#             # get stock info
#             stock_info = stock.info
#             business_description = stock_info.get('longBusinessSummary', '')
#             stock_info_aggregated.append(business_description)

#             # show news
#             data_stock_news = stock.news
#             df_stock_news = pd.json_normalize(data_stock_news)
#             df_stock_news.to_csv(f'{self.DATA_DIR}/stocknews_{ticker}.csv', index=False)

#             g = Goose()
#             for d in data_stock_news:
#                 stock_info_aggregated.append(d["title"])
#                 response = requests.get(d['link'], verify=False)
#                 article = g.extract(raw_html=response.text)
#                 article_clean = custom_clean_text(article.cleaned_text)
#                 stock_info_aggregated.append(article_clean)
#             g.close()

#             aggregated_text = ' '.join(stock_info_aggregated).replace('\n', ' ')

#             with open(f'{self.DATA_DIR}/aggtokens_{ticker}.txt', 'w') as f:
#                 f.write(aggregated_text)

#             tokens = aggregated_text.split()
#             stopworden = set(stopwords.words('english'))
#             additional_stopwords = {'a', 'the', '•', '-', '&', ' ', 'None', 'per', 'none', 'company', 'Company', 'stock', 'Stock'}
#             stopworden.update(additional_stopwords)

#             clean_tokens = [token for token in tokens if token not in stopworden]
#             freq = nltk.FreqDist(clean_tokens)

#             green_tokens = 0
#             green_focus = 0
#             sum_tokens_10 = 0
#             freq_items = []

#             for index, (key, val) in enumerate(freq.items(), start=1):
#                 freq_items.append((key, val))
#                 if index <= 10:
#                     sum_tokens_10 += val
#                 if key.upper() in sustainability_tokens :
#                     if index <= 10:
#                         green_focus += val * (10 - index)
#                     green_tokens += val

#             green_focus = round(green_focus / sum_tokens_10, 2) if sum_tokens_10 > 0 else 0

#             response_data = {
#                 'Total Tokens': len(freq.items()),
#                 'Green Tokens': green_tokens,
#                 'Green Score': round(green_tokens * 10 / len(freq.items()), 2),
#                 'Green Focus': green_focus,
#                 'Relevant Tokens': [t for t in freq_items if t[1] >= 5]
#             }

#             cache.set(cache_key, response_data, timeout=60*60)  # Cache for 1 hour
#             return JsonResponse(response_data, safe=False)
#         except Exception as e:
#             error_message = str(e)
#             return JsonResponse({'error': error_message}, status=500)

#     def fetch_stock_scores(self, ticker):
#         # Assuming the MongoDB connection is properly configured
#         client = MongoClient('localhost', 27017)
#         db = client['StockDatabase']  # Replace with your database name
#         stock_collection = db['Stocks']  # Replace with your collection name

#         stock_data = stock_collection.find_one(
#             {"ticker": ticker},
#             {
#                 "_id": 0,
#                 "green_score": 1,
#                 "Recommendation_score": 1,
#                 "Governance Pillar Score": 1,
#                 "Environmental Pillar Score": 1,
#                 "Social Pillar Score": 1,
#             }
#         )
#         if stock_data:
#             stock_data = loads(dumps(stock_data))  # Convert MongoDB BSON to JSON
#         return stock_data