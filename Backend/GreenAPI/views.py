from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from pymongo import MongoClient
from bson.json_util import dumps, loads

CONNECTION_STRING = "mongodb+srv://vishalgawali2002:SsOrwk3GyqzYhnoI@cluster0.xkevobu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
def connection(collection):
    client = MongoClient(CONNECTION_STRING)
    db = client['GreenStockApp']
    coll = db[collection]
    return coll

@api_view(['GET'])
@permission_classes([AllowAny])
def get_stocks_index(request):
    coll = connection(collection="StockIndex")
    stocks = coll.find()
    stocks_list = loads(dumps(stocks))
    serialized_stocks = dumps(stocks_list)
    return JsonResponse(serialized_stocks, safe=False)

