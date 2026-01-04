from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('news', NewsViewSet, basename='news')

urlpatterns = [
    path('', include(router.urls)),
    path('about-us/', AboutUsView.as_view(), name='about-us'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('visits/track/', VisitTrackView.as_view(), name='visit-track'),
    path('visits/stats/', VisitStatsView.as_view(), name='visit-stats'),
]

