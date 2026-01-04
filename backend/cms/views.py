from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import extend_schema

from core.permissions import IsActiveAdmin, CanManageBlog
from .models import News, AboutUs
from .serializers import NewsSerializer, NewsListSerializer, AboutUsSerializer


class NewsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing News content.
    Only users with can_manage_blog=True can perform CRUD operations.
    """
    queryset = News.objects.all().order_by('-date')
    serializer_class = NewsSerializer

    def get_permissions(self):
        """All CRUD operations require IsAuthenticated, IsActiveAdmin, and CanManageBlog"""
        return [IsAuthenticated(), IsActiveAdmin(), CanManageBlog()]

    def get_serializer_class(self):
        """Use NewsListSerializer for list action, NewsSerializer for others"""
        if self.action == 'list':
            return NewsListSerializer
        return NewsSerializer


class AboutUsView(APIView):
    """
    API View for managing About Us content (singleton).
    GET: Retrieve the single AboutUs record
    PATCH/PUT: Update the AboutUs record
    """
    permission_classes = [IsAuthenticated, IsActiveAdmin, CanManageBlog]
    
    @extend_schema(
        responses={200: AboutUsSerializer},
        description="Retrieve the single AboutUs record"
    )
    def get(self, request):
        """Get the single AboutUs record, create if it doesn't exist"""
        about_us = AboutUs.get_instance()
        serializer = AboutUsSerializer(about_us)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=AboutUsSerializer,
        responses={200: AboutUsSerializer},
        description="Partially update the AboutUs record"
    )
    def patch(self, request):
        """Partially update the AboutUs record"""
        about_us = AboutUs.get_instance()
        serializer = AboutUsSerializer(about_us, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=AboutUsSerializer,
        responses={200: AboutUsSerializer},
        description="Full update of the AboutUs record"
    )
    def put(self, request):
        """Full update of the AboutUs record"""
        about_us = AboutUs.get_instance()
        serializer = AboutUsSerializer(about_us, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
