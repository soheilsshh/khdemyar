from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NewsViewSet, AboutUsView

router = DefaultRouter()
router.register('news', NewsViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
    path('about-us/', AboutUsView.as_view(), name='about-us'),
]

