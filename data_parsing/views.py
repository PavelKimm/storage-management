import os
from datetime import datetime, timedelta
from xml.etree import ElementTree

from django.db import transaction, IntegrityError
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK
)
from rest_framework.views import APIView

from data_parsing.models import Category, Product, Entry, ProductInEntry, Purchase
from data_parsing.serializers import EntrySerializer, ProductListSerializer


@api_view(['POST'])
@transaction.atomic
# @permission_classes((IsAuthenticated, IsAdminUser))
def load_data(request, *args, **kwargs):
    clear_db()

    files = request.FILES.getlist('files')
    result = {"recorded items": 0, "passed items": 0}

    load_products_and_categories(files, result)
    print(result)
    print(files)

    load_purchases(files, result)
    print(result)

    load_entries(files, result)
    print(result)

    return Response({"message": result}, status=HTTP_200_OK)


def clear_db():
    Category.objects.all().delete()
    Entry.objects.all().delete()
    Product.objects.all().delete()


def load_products_and_categories(files, result):
    for file in files:
        _, file_ext = os.path.splitext(str(file))
        if file_ext == ".xml":
            xml_file = ElementTree.parse(file)
            file.seek(0)  # reset pointer back to the start of the file
            root_element = xml_file.getroot()
            for dump_element in root_element:
                if dump_element.tag != "DumpElement":
                    print("Not DumpElement!!!")
                    print(f"Filename: {file}")
                    continue
                for catalog_object__product in dump_element:
                    db_object = {}

                    if catalog_object__product.tag.endswith('CatalogObject.Номенклатура'):
                        for product_info_row in catalog_object__product:
                            if product_info_row.tag.endswith('IsFolder'):
                                if product_info_row.text == 'true':
                                    is_folder = True
                                else:
                                    is_folder = False
                                db_object['is_folder'] = is_folder

                            elif product_info_row.tag.endswith('Ref'):
                                ref = product_info_row.text
                                db_object['ref'] = ref

                            elif product_info_row.tag.endswith('DeletionMark'):
                                if product_info_row.text == 'true':
                                    deletion_mark = True
                                else:
                                    deletion_mark = False
                                db_object['deletion_mark'] = deletion_mark

                            elif product_info_row.tag.endswith('Description'):
                                description = product_info_row.text
                                db_object['description'] = description

                            elif product_info_row.tag.endswith('Parent') and db_object['is_folder'] is False:
                                db_object['category_ref'] = product_info_row.text

                        try:
                            if db_object['deletion_mark'] is True:
                                print(f"Deletion mark on {db_object['description']}")
                            else:
                                if db_object['is_folder'] is True:
                                    Category.objects.create(ref=db_object['ref'], name=db_object['description'])
                                elif db_object['is_folder'] is False:
                                    Product.objects.create(ref=db_object['ref'], category_ref=db_object['category_ref'],
                                                           name=db_object['description'])
                                result['recorded items'] += 1
                        except IntegrityError:
                            result['passed items'] += 1


def load_purchases(files, result):
    for file in files:
        _, file_ext = os.path.splitext(str(file))
        if file_ext == ".xml":
            xml_file = ElementTree.parse(file)
            file.seek(0)
            root_element = xml_file.getroot()
            for dump_element in root_element:
                if dump_element.tag != "DumpElement":
                    print("Not DumpElement!!!")
                    print(f"Filename: {file}")
                    continue

                for purchases_record in dump_element:
                    if purchases_record.tag.endswith('AccountingRegisterRecordSet.Налоговый'):

                        for separate_record in purchases_record:
                            if separate_record.tag.endswith('Record') and list(separate_record[0].attrib.values())[0] \
                                    .endswith('ПоступлениеТоваровУслуг'):
                                db_object = {}

                                for info_row in separate_record:
                                    if info_row.tag.endswith('Period'):
                                        datetime_ = info_row.text
                                        db_object['datetime'] = datetime_
                                    elif info_row.tag.endswith('Active'):
                                        if info_row.text == 'true':
                                            is_active = True
                                        else:
                                            is_active = False
                                        db_object['is_active'] = is_active
                                    elif info_row.tag.endswith('ExtDimensionsDr'):
                                        db_object['product_ref'] = info_row[1].text
                                    elif info_row.tag.endswith('КоличествоDr'):
                                        db_object['quantity'] = info_row.text

                                if db_object['is_active']:
                                    try:
                                        product = Product.objects.get(ref=db_object['product_ref'])
                                        Purchase.objects.create(product=product, created_at=db_object['datetime'],
                                                                quantity=db_object['quantity'])
                                        result['recorded items'] += 1
                                    except Product.DoesNotExist:
                                        print(f"{db_object['product_ref']} does not exist!")
                                    except Exception as e:
                                        print(str(e))
                                        result['passed items'] += 1
                                else:
                                    print('is_active == False')


def load_entries(files, result):
    for file in files:
        _, file_ext = os.path.splitext(str(file))
        if file_ext == ".xml":
            xml_file = ElementTree.parse(file)
            file.seek(0)
            root_element = xml_file.getroot()
            for dump_element in root_element:
                if dump_element.tag != "DumpElement":
                    print("Not DumpElement!!!")
                    print(f"Filename: {file}")
                    continue

                for product_entry in dump_element:
                    if product_entry.tag.endswith('DocumentObject.РеализацияТоваровУслуг'):
                        db_object = {}
                        products = []

                        for info_row in product_entry:

                            if info_row.tag.endswith('Ref'):
                                ref = info_row.text
                                db_object['ref'] = ref

                            elif info_row.tag.endswith('DeletionMark'):
                                if info_row.text == 'true':
                                    deletion_mark = True
                                else:
                                    deletion_mark = False
                                db_object['deletion_mark'] = deletion_mark

                            elif info_row.tag.endswith('Date'):
                                datetime_ = info_row.text
                                db_object['datetime'] = datetime_

                            elif info_row.tag.endswith('Товары'):
                                product_info = {}
                                for product_info_row in info_row:
                                    if product_info_row.tag.endswith('Номенклатура'):
                                        ref = product_info_row.text
                                        product_info['ref'] = ref
                                    elif product_info_row.tag.endswith('Количество'):
                                        quantity = product_info_row.text
                                        product_info['quantity'] = quantity
                                    elif product_info_row.tag.endswith('Цена'):
                                        price = product_info_row.text
                                        product_info['price'] = price
                                products.append(product_info)

                        try:
                            with transaction.atomic():
                                if db_object['deletion_mark'] is True:
                                    print(f"Deletion mark on {db_object['ref']}")
                                else:
                                    entry = Entry.objects.create(ref=db_object['ref'], created_at=db_object['datetime'])
                                    for product in products:
                                        product_obj = Product.objects.get(ref=product['ref'])
                                        ProductInEntry.objects.create(entry=entry, product=product_obj,
                                                                      quantity=product['quantity'],
                                                                      price=product['price'])
                                    result['recorded items'] += 1
                        except IntegrityError:
                            result['passed items'] += 1


class EntryListView(generics.ListAPIView):
    serializer_class = EntrySerializer
    # permission_classes = (IsAuthenticated, IsAdminUser)

    def get_queryset(self):
        # ref = self.request.query_params.get('ref')
        # print(ref)
        # product = Product.objects.get(ref=ref)
        # print(product.name)
        # exit()

        queryset = Entry.objects.all()
        period_from = self.request.query_params.get('period-from')
        period_to = self.request.query_params.get('period-to')
        # if period_from:
        #     queryset = queryset.filter()

        grand_total = sum([entry.get_total_sum() for entry in queryset])
        print(grand_total)

        return queryset


class AnalyticsView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        purchases = Purchase.objects.all()
        entries = Entry.objects.all()

        # filtering
        period_from = self.request.query_params.get('period_from')
        period_to = self.request.query_params.get('period_to')
        if period_from:
            period_from = list(map(int, period_from.split('-')))
            period_from = datetime(period_from[0], period_from[1], period_from[2]).date()
            entries = entries.filter(created_at__gte=period_from)
        if period_to:
            period_to = list(map(int, period_to.split('-')))
            period_to = datetime(period_to[0], period_to[1], period_to[2]).date()
            purchases = purchases.filter(created_at__lte=period_to)
            entries = entries.filter(created_at__lte=period_to)

        # analytics
        purchased_products = {purchase.product.ref for purchase in purchases}
        product_statistics = {
            product_ref: {
                "name": Product.objects.get(ref=product_ref).name,
                "num_in_stock": 0
            } for product_ref in purchased_products
        }

        for purchase in purchases:
            product_statistics[purchase.product.ref]['num_in_stock'] += purchase.quantity
        for entry in entries:
            for sold_product_info in entry.entry_products.all():
                product_statistics[sold_product_info.product.ref]['num_in_stock'] -= sold_product_info.quantity

        dates = {entry.created_at.date() for entry in entries}
        dates = sorted(dates)
        dates = dates[0], dates[-1]
        print(dates)

        return Response(product_statistics, status=HTTP_200_OK)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        return queryset


class ActiveProductListView(APIView):
    @staticmethod
    def get(request, *args, **kwargs):
        purchases = Purchase.objects.all()
        entries = Entry.objects.all()
        products_statistics = {}
        for purchase in purchases:
            product_id = purchase.product.id
            if product_id in products_statistics:
                products_statistics[product_id]['num_in_stock'] += purchase.quantity
            else:
                products_statistics.update({
                    product_id: {
                        "name": purchase.product.name,
                        "num_in_stock": purchase.quantity
                    }})
        for entry in entries:
            for sold_product_info in entry.entry_products.all():
                product_id = sold_product_info.product.id
                if product_id in products_statistics:
                    products_statistics[product_id]['num_in_stock'] -= sold_product_info.quantity
                else:
                    print("Product id", product_id, "not in list!!!")
        return Response(products_statistics, status=HTTP_200_OK)


class ProductDetailView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        product = Product.objects.get(pk=kwargs['pk'])

        purchases = Purchase.objects.filter(product=product)
        entries = Entry.objects.all()

        # analytics
        product_statistics = {
            "name": product.name,
            "num_in_stock": 0
        }
        purchase_stats = {}
        entry_stats = {}

        for purchase in purchases:
            product_statistics['num_in_stock'] += purchase.quantity
            date = purchase.created_at.date()
            if date in purchase_stats:
                purchase_stats[date] += purchase.quantity
            else:
                purchase_stats.update({date: purchase.quantity})
        for entry in entries:
            for sold_product_info in entry.entry_products.all():
                if sold_product_info.product == product:
                    sold_product_quantity = sold_product_info.quantity
                    product_statistics['num_in_stock'] -= sold_product_quantity
                    date = sold_product_info.entry.created_at.date()
                    if date in entry_stats:
                        entry_stats[date]['quantity'] += sold_product_quantity
                    else:
                        entry_stats.update({
                            date: {
                                "quantity": sold_product_quantity,
                                "price": sold_product_info.price
                            }
                        })

        dates = set(purchase_stats.keys()) | set(entry_stats.keys())
        dates = sorted(dates)

        first_date = dates[0]
        last_date = dates[-1]
        print("PERIOD: from ", first_date, " to ", last_date)

        # dates = [datetime.strptime(str(date).split(' ')[0], "%Y-%m-%d").date()
        #          for date in pd.date_range(start=first_date, end=last_date)]

        stats = {
            date: {
                "purchase": purchase_stats.get(date, 0),
                "entry": entry_stats.get(date, {"quantity": 0, "price": None})
            } for date in dates
        }

        def get_first_day_of_the_week(date_):
            return date_ - timedelta(days=date_.weekday() % 7)

        first_date_range = get_first_day_of_the_week(first_date)
        week_ranges = [first_date_range]
        while True:
            next_range = week_ranges[-1] + timedelta(weeks=1)
            week_ranges.append(next_range)
            if next_range > last_date:
                break

        weekly_statistics = {
            week_range: {
                "purchase": 0,
                "entry": {"quantity": 0, "price": None}
            } for week_range in week_ranges
        }
        # containing the weekly statistics
        for date in stats:
            week_range = get_first_day_of_the_week(date)
            weekly_statistics[week_range]['purchase'] += stats[date]['purchase']
            weekly_statistics[week_range]['entry']['quantity'] += stats[date]['entry']['quantity']
            if weekly_statistics[week_range]['entry']['price'] is not None \
                    and weekly_statistics[week_range]['entry']['price'] != stats[date]['entry']['price']:
                print("!!!PRICE CHANGED WITHIN THE WEEK!!!")
            weekly_statistics[week_range]['entry']['price'] = stats[date]['entry']['price']

        num_in_stock_set = []
        num_in_stock = 0
        for week_range in weekly_statistics:
            num_in_stock += weekly_statistics[week_range]['purchase']
            num_in_stock -= weekly_statistics[week_range]['entry']['quantity']
            num_in_stock_set.append(num_in_stock)

        chart_data = {
            "name": product.name,
            "dates": weekly_statistics.keys(),
            "purchase_values": [weekly_statistics[week_range]['purchase'] for week_range in weekly_statistics],
            "entry_values_quantity": [weekly_statistics[week_range]['entry']['quantity']
                                      for week_range in weekly_statistics],
            "entry_values_price": [weekly_statistics[week_range]['entry']['price'] for week_range in weekly_statistics],
            "num_in_stock": num_in_stock_set
        }
        return Response(chart_data, status=HTTP_200_OK)
