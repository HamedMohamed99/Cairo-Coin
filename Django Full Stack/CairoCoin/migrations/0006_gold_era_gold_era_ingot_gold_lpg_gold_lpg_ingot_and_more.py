# Generated by Django 4.2.8 on 2024-01-28 14:04

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('CairoCoin', '0005_xplus'),
    ]

    operations = [
        migrations.CreateModel(
            name='gold_ERA',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('buy21', models.FloatField()),
                ('sell21', models.FloatField()),
                ('buy24', models.FloatField()),
                ('sell24', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='gold_ERA_ingot',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('buy_5g', models.FloatField()),
                ('sell_5g', models.FloatField()),
                ('buy_10g', models.FloatField()),
                ('sell_10g', models.FloatField()),
                ('buy_20g', models.FloatField()),
                ('sell_20g', models.FloatField()),
                ('buy_ounce', models.FloatField()),
                ('sell_ounce', models.FloatField()),
                ('buy_50g', models.FloatField()),
                ('sell_50g', models.FloatField()),
                ('buy_100g', models.FloatField()),
                ('sell_100g', models.FloatField()),
                ('buy_halfPound', models.FloatField()),
                ('sell_halfPound', models.FloatField()),
                ('buy_pound', models.FloatField()),
                ('sell_pound', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='gold_LPG',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('buy21', models.FloatField()),
                ('sell21', models.FloatField()),
                ('buy24', models.FloatField()),
                ('sell24', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='gold_LPG_ingot',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('buy_5g', models.FloatField()),
                ('sell_5g', models.FloatField()),
                ('buy_10g', models.FloatField()),
                ('sell_10g', models.FloatField()),
                ('buy_20g', models.FloatField()),
                ('sell_20g', models.FloatField()),
                ('buy_ounce', models.FloatField()),
                ('sell_ounce', models.FloatField()),
                ('buy_50g', models.FloatField()),
                ('sell_50g', models.FloatField()),
                ('buy_100g', models.FloatField()),
                ('sell_100g', models.FloatField()),
                ('buy_halfPound', models.FloatField()),
                ('sell_halfPound', models.FloatField()),
                ('buy_pound', models.FloatField()),
                ('sell_pound', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='gold_SAGHA',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('buy21', models.FloatField()),
                ('sell21', models.FloatField()),
                ('buy24', models.FloatField()),
                ('sell24', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='gold_SAGHA_ingot',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('time', models.DateTimeField(default=django.utils.timezone.now)),
                ('buy_5g', models.FloatField()),
                ('sell_5g', models.FloatField()),
                ('buy_10g', models.FloatField()),
                ('sell_10g', models.FloatField()),
                ('buy_20g', models.FloatField()),
                ('sell_20g', models.FloatField()),
                ('buy_ounce', models.FloatField()),
                ('sell_ounce', models.FloatField()),
                ('buy_50g', models.FloatField()),
                ('sell_50g', models.FloatField()),
                ('buy_100g', models.FloatField()),
                ('sell_100g', models.FloatField()),
                ('buy_halfPound', models.FloatField()),
                ('sell_halfPound', models.FloatField()),
                ('buy_pound', models.FloatField()),
                ('sell_pound', models.FloatField()),
            ],
        ),
    ]
