from django.shortcuts import render
from .models import StockIndex
from pymongo import MongoClient
from bson.json_util import dumps, loads

CONNECTION_STRING = "mongodb+srv://vishalgawali2002:SsOrwk3GyqzYhnoI@cluster0.xkevobu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
def connection(collection):
    client = MongoClient(CONNECTION_STRING)
    db = client['GreenStockApp']
    coll = db[collection]
    return coll

def home_view(request):
    coll = connection(collection="StockIndex")
    stocks = coll.find()
    stocks_list = loads(dumps(stocks))  
    print(stocks_list)# Convert cursor to list
    return render(request, 'home.html', {'stocks': stocks_list})

