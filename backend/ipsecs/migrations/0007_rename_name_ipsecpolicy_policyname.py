# Generated by Django 5.1.7 on 2025-03-27 09:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ipsecs', '0006_rename_name_ikegateway_gatewayname'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ipsecpolicy',
            old_name='name',
            new_name='policyname',
        ),
    ]
