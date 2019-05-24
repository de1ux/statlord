# Generated by Django 2.2.1 on 2019-05-23 23:53

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
            ],
        ),
        migrations.CreateModel(
            name='LayoutItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Layout')),
                ('value', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Gauge')),
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
