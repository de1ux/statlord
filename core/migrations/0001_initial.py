# Generated by Django 2.2.1 on 2019-05-27 16:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Gauge',
            fields=[
                ('key', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('value', models.CharField(max_length=600)),
            ],
        ),
        migrations.CreateModel(
            name='Layout',
            fields=[
                ('key', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('data', models.BinaryField()),
            ],
        ),
        migrations.CreateModel(
            name='Display',
            fields=[
                ('key', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('available', models.BooleanField(default=False)),
                ('resolution_x', models.IntegerField(default=0)),
                ('resolution_y', models.IntegerField(default=0)),
                ('current_layout', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.Layout')),
            ],
        ),
    ]
