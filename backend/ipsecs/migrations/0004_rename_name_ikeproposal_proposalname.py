# Generated by Django 5.1.6 on 2025-03-25 06:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ipsecs', '0003_remove_ikeproposal_lifetime_kilobytes_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ikeproposal',
            old_name='name',
            new_name='proposalname',
        ),
    ]
