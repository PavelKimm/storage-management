from django.urls import path

from data_parsing.views import (
    load_products_and_categories_to_db, load_entries, EntryListView, load_purchases, AnalyticsView,
    ProductListView, ActiveProductListView, ProductDetailView,
)

urlpatterns = [
    path('load-products-and-categories-to-db/', load_products_and_categories_to_db),
    path('load-entries/', load_entries),
    path('load-purchases/', load_purchases),

    path('entries/', EntryListView.as_view()),
    path('analytics/', AnalyticsView.as_view()),

    path('products/', ProductListView.as_view()),
    path('active-products/', ActiveProductListView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),
]
