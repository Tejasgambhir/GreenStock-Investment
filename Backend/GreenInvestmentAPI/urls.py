"""
URL configuration for GreenInvestmentAPI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path ,include
from GreenAPI import views


urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/stocksindex/', views.get_stocks_index, name='get_stocks'),
    path('api/news/',view=views.GreenNewsView.as_view(),name="get_news"),
    path('api/stocks/<str:ticker>', views.StockDetailsView.as_view(), name='get_stocks'),
    path('api/graph_stock/<str:ticker>/<str:time_frame>', views.get_stock_history, name='graph_stock'),
    path('api/currentvalue/<str:ticker>', views.CurrentStockValueView.as_view(), name='get_current_value'),
    path('api/getscores/<str:ticker>', views.StockScoresView.as_view(), name='get_score'),
    path('api/getgreenscores/<str:ticker>', views.StockGreenScoresView.as_view(), name='get_score'),
]
 