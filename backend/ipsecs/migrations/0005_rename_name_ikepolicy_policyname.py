# Generated by Django 5.1.7 on 2025-03-27 06:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ipsecs', '0004_rename_name_ikeproposal_proposalname'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ikepolicy',
            old_name='name',
            new_name='policyname',
        ),
    ]
