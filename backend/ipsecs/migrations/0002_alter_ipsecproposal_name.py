# Generated by Django 5.1.6 on 2025-02-24 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ipsecs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ipsecproposal',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
