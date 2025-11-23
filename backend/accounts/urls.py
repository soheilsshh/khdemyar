from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, RegistrationRequestViewSet

router = DefaultRouter()

router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'users', RegistrationRequestViewSet, basename='registration')

urlpatterns = router.urls