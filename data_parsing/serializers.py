from rest_framework import serializers

from data_parsing.models import Entry, Product


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'ref', 'name', 'price', 'category_ref')


class EntrySerializer(serializers.ModelSerializer):
    total_sum = serializers.SerializerMethodField()
    entry_products = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = ('id', 'created_at', 'entry_products', 'total_sum')

    @staticmethod
    def get_total_sum(obj):
        return obj.get_total_sum()

    @staticmethod
    def get_entry_products(obj):
        entry_products_info = [{
            "id": entry_product.id,
            "product": {
                "id": entry_product.product.id,
                "name": entry_product.product.name
            },
            "quantity": entry_product.quantity,
            "sold_price": entry_product.price
        } for entry_product in obj.entry_products.all()]
        return entry_products_info
