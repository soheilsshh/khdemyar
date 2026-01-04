from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('news', NewsViewSet, basename='news')
router.register('feedback', FeedbackViewSet, basename='feedback')
router.register('subtitles', SubtitleViewSet, basename='subtitles')

urlpatterns = [
    path('', include(router.urls)),
    path('about-us/', AboutUsView.as_view(), name='about-us'),
    path('contact-info/', ContactInfoView.as_view(), name='contact-info'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('visits/track/', VisitTrackView.as_view(), name='visit-track'),
    path('visits/stats/', VisitStatsView.as_view(), name='visit-stats'),
]

