# Generated by Django 2.2.1 on 2019-05-31 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='layout',
            name='display_positions',
            field=models.TextField(default=''),
        ),
    ]
