# Generated by Django 2.2.1 on 2019-05-17 21:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='layout',
            name='name',
            field=models.CharField(default='default', max_length=100),
            preserve_default=False,
        ),
    ]