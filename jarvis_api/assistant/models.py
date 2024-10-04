# assistant/models.py
from django.db import models
from django.contrib.auth.models import User


class Query(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.question[:50]}..."

class ResponseModel(models.Model):
    query = models.OneToOneField(Query, on_delete=models.CASCADE, related_name='response')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to: {self.query.question[:50]}..."
