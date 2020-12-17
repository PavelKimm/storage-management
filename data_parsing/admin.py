from django.contrib import admin
from django.contrib.auth.models import Group

from data_parsing.models import Category, Product, Purchase, Entry, ProductInEntry

admin.site.unregister(Group)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Purchase)
admin.site.register(Entry)
admin.site.register(ProductInEntry)
