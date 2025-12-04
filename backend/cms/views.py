from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from core.permissions import IsActiveAdmin, CanManageBlog
from .models import News
from .serializers import NewsSerializer, NewsListSerializer


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
