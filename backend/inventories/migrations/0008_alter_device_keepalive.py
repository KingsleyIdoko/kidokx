# Generated by Django 5.2.1 on 2025-05-28 20:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventories', '0007_device_last_checked'),
    ]

    operations = [
        migrations.AlterField(
            model_name='device',
            name='keepalive',
            field=models.IntegerField(default=60),
        ),
    ]
