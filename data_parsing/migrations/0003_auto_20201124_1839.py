# Generated by Django 3.1.3 on 2020-11-24 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_parsing', '0002_auto_20201124_1838'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='category_ref',
            field=models.CharField(default=None, max_length=50, unique=True),
            preserve_default=False,
        ),
    ]
