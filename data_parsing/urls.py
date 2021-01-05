from django.urls import path

from data_parsing.views import (
    load_data, EntryListView, AnalyticsView,
    ProductListView, ActiveProductListView, ProductDetailView,
)

urlpatterns = [
    path('load-data/', load_data),

    path('entries/', EntryListView.as_view()),
    path('analytics/', AnalyticsView.as_view()),

    path('products/', ProductListView.as_view()),
    path('active-products/', ActiveProductListView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),
]
