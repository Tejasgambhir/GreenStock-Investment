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
        return JsonResponse(stock_data, safe=False)

    def fetch_stock_data(self, ticker):
        stock_collection = connection('Stocks')
        stock_data = stock_collection.find_one({"ticker": ticker})
        if stock_data:
            stock_data = loads(dumps(stock_data))
            stock_data.pop('_id', None)
            stock_data.pop('balance_sheet', None)
            stock_data.pop('financials', None)
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




import yfinance as yf
from django.views import View
from django.http import JsonResponse
from django.core.cache import cache
from threading import Timer

class CurrentStockValueView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.stock_updaters = {}

    def get(self, request, ticker):
        if ticker not in self.stock_updaters:
            self.schedule_update(ticker)
        
        cache_key = f'current_stock_value_{ticker}'
        stock_data = cache.get(cache_key)

        if not stock_data:
            return JsonResponse({"error": "Stock not found"}, status=404)

        return JsonResponse(stock_data, safe=False)

    def fetch_current_stock_value(self, ticker):
        try:
            stock = yf.Ticker(ticker)
            stock_info = stock.history(period='1d')
            if not stock_info.empty:
                current_value = stock_info.iloc[-1]['Close']
                return {"ticker": ticker, "current_value": current_value}
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

# def get_green_score_v1(ticker):
#     # session = requests.Session()
    
#     try:
#         session = requests_cache.CachedSession('yfinance.cache')
#         session.verify = False
        
#         stock = yfinance.Ticker(ticker,session)

#         stockInfoAggregated = StringBuilder()

#         # get stock info
#         stockInfo = stock.info
#         businessDescription = stockInfo['longBusinessSummary']
#         stockInfoAggregated.Append(f'{businessDescription} ')

#         # show news
#         dataStockNews = stock.news
#         # dataStockNews = json.loads(stock.news)
#         dfStockNews = pd.json_normalize(dataStockNews)
#         dfStockNews.to_csv(f'{DATA_DIR}\\stocknews_{ticker}.csv')

#         g = Goose()
#         for d in dataStockNews:
#             stockInfoAggregated.Append(f'{d["title"]} ')
#             response = requests.get(d['link'],verify=False)
#             article = g.extract(raw_html = response.text)
#             article_clean = article.cleaned_text
#             article_clean = custom_clean_text(article_clean)
#             stockInfoAggregated.Append(f'{article_clean} ')
#         g.close()

#         with open(f'{DATA_DIR}\\aggtokens_{ticker}.txt', 'w') as f:
#             fcontent = stockInfoAggregated.Text().replace('\n',' ')
#             f.write(fcontent)

#         tokens = [t for t in fcontent.split()]
        
#         clean_tokens = tokens[:]
        
#         stopworden = stopwords.words('english')

#         # add more stop words
#         more =  ['a','the','•','-','&',' ','None','per','none','company''s','Company''s','stock','Stock']
#         for el in more:
#             stopworden.append(el)
#             stopworden.append(el.capitalize())
        
#         for token in tokens:
#             if token in stopworden:
#                 clean_tokens.remove(token)

#         freq = nltk.FreqDist(clean_tokens)

#         green_tokens= 0
#         green_focus = 0 # calculate as sums of occurrences of green tokens in the sum of tokens for first 10 indexes
#         sum_tokens_10 = 0
#         index = 0
#         freq_items = []
#         for key,val in freq.items():
#             index = index + 1
#             # print (str(key) + ':' + str(val))
#             freq_items.append((key,val))
#             if index <= 10:
#                 # get sum of tokens for first 10 indexes
#                 sum_tokens_10 = sum_tokens_10 + val
#             if str(key).upper() in ['CLEAN','ENERGY','GREEN','PLANET','EMMISSIONS','NATURAL']:
#                 if index <= 10:
#                     # if g-tokens found in the first 10 indexes, get a bonus
#                     green_focus = green_focus + val * (10-index)
#                 green_tokens = green_tokens + val
#         # freq.plot(20,cumulative=False,show=False)
        
#         green_focus = round(green_focus / sum_tokens_10,2)
#         green_density = round(100*float(green_tokens/len(freq.items())),2)
#         print('Total Tokens:',len(freq.items()),' G-Tokens:',green_tokens,' Green Focus:',green_focus,' Green Density:',green_density)
#         response = []
#         response.append(('Total Tokens',len(freq.items())))
#         response.append(('Green Tokens',green_tokens))
#         response.append(('Green Score',round(float(green_tokens/len(freq.items())),3)))
#         response.append(('Green Focus',green_focus))
#         response.append(('Green Density',green_density))
#         response.append(('Relevant Tokens',[t for t in freq_items if t[1] >= 5]))
#         return json.dumps(response)
#     except:
#         e = sys.exc_info()[0]
#         return json.dumps(f'Error: {e}'),500 