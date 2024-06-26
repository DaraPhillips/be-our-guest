# Generated by Django 5.0.2 on 2024-04-23 08:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('be_our_guest', '0002_alter_user_managers'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='weddingTitle',
            field=models.CharField(default='Wedding Title', max_length=255),
        ),
        migrations.AlterField(
            model_name='event',
            name='host_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to=settings.AUTH_USER_MODEL),
        ),
    ]
