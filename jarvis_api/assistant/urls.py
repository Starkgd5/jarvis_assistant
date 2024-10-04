# assistant/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QueryViewSet, ResponseViewSet

router = DefaultRouter()
router.register(r'queries', QueryViewSet)
router.register(r'responses', ResponseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
