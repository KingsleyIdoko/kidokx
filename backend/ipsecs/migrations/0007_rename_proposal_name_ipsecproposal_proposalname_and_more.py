# Generated by Django 5.2.1 on 2025-05-29 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ipsecs', '0006_alter_ikegateway_gatewayname'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ipsecproposal',
            old_name='proposal_name',
            new_name='proposalname',
        ),
        migrations.AlterField(
            model_name='ipsecproposal',
            name='authentication_algorithm',
            field=models.CharField(choices=[('hmac-md5-96', 'Md5'), ('hmac-sha-256-128', 'Sha'), ('hmac-sha1-96', 'Sha1')], default='hmac-sha-256-128', max_length=50),
        ),
    ]
