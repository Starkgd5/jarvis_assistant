# assistant/views.py
from django.conf import settings
from .models import Query, ResponseModel
from .serializers import QuerySerializer, ResponseSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
import google.generativeai as genai
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class QueryViewSet(viewsets.ModelViewSet):
    queryset = Query.objects.all().select_related('response')
    serializer_class = QuerySerializer
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        query_text = serializer.validated_data['question']
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            chat = model.start_chat(history=[])
            response = chat.send_message(query_text, stream=True)
            response_text = "".join([chunk.text for chunk in response])

            response_obj = ResponseModel.objects.create(query=serializer.instance, text=response_text)
            query_with_response = Query.objects.select_related('response').get(id=serializer.instance.id)
            serializer = self.get_serializer(query_with_response)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().order_by('-created_at'))
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ResponseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ResponseModel.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().order_by('-created_at'))
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)