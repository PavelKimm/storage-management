from django.db import models


class Category(models.Model):
    ref = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} [id: {self.id}]"

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']


class Product(models.Model):
    ref = models.CharField(max_length=50, unique=True)
    category_ref = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    price = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} [id: {self.id}]"

    class Meta:
        ordering = ['name']


class Purchase(models.Model):
    created_at = models.DateTimeField()
    quantity = models.PositiveIntegerField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='purchases')


class Entry(models.Model):
    ref = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField()
    products = models.ManyToManyField(Product, through='ProductInEntry')

    # def __str__(self):
    #     return None

    class Meta:
        verbose_name_plural = "Entries"

    def get_total_sum(self):
        entry_products = self.entry_products.all()
        total_sum = sum([entry_product.price * entry_product.quantity for entry_product in entry_products])
        return total_sum


class ProductInEntry(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='entry_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()

    # def __str__(self):
    #     return None

    class Meta:
        verbose_name_plural = "Entry products"
