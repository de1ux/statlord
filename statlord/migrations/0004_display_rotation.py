# Generated by Django 2.2.1 on 2019-06-10 22:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('statlord', '0003_display_display_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='display',
            name='rotation',
            field=models.IntegerField(default=0),
        ),
    ]