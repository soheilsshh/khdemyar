from rest_framework import serializers
from .models import News, AboutUs


class NewsListSerializer(serializers.ModelSerializer):
    """Serializer for listing news with fewer fields"""
    class Meta:
        model = News
        fields = ['id', 'title', 'date', 'image', 'created_at']
        read_only_fields = ['created_at']


class NewsSerializer(serializers.ModelSerializer):
    """Full serializer for CRUD operations"""
    class Meta:
        model = News
        fields = [
            'id',
            'title',
            'date',
            'description',
            'image',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AboutUsSerializer(serializers.ModelSerializer):
    """Serializer for About Us content"""
    class Meta:
        model = AboutUs
        fields = [
            'id',
            'description',
            'image',
            'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']

