# assistant/serializers.py
from rest_framework import serializers
from .models import Query, ResponseModel
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResponseModel
        fields = ['id', 'text', 'created_at']

class QuerySerializer(serializers.ModelSerializer):
    response = ResponseSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Query
        fields = ['id', 'user', 'question', 'created_at', 'response']
        read_only_fields = ['id', 'created_at']
