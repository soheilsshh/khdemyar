from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['register', 'login']:
            return [permissions.AllowAny()]
        elif self.action in ['approve', 'reject', 'pending_requests']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'register':
            return RegisterSerializer
        if self.action == 'login':
            return LoginSerializer

        return UserSerializer


    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_active=False, is_staff=False, is_admin=False)
        return Response({'detail': 'درخواست ثبت‌نام با موفقیت ارسال شد. منتظر تأیید مدیر باشید.'},
                        status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if not user.is_active:
            return Response({'detail': 'حساب شما هنوز توسط مدیر تأیید نشده است.'},
                            status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })


    @action(detail=False, methods=['get'])
    def pending_requests(self, request):
        users = User.objects.filter(is_active=False, is_staff=False)
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)


    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        try:
            user = self.get_object()
            if user.is_active:
                return Response({'detail': 'این کاربر قبلاً تأیید شده است.'}, status=400)
            user.is_active = True
            user.save()
            return Response({'detail': f'کاربر {user.username} تأیید شد.'})
        except User.DoesNotExist:
            return Response({'detail': 'کاربر یافت نشد.'}, status=404)


    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        try:
            user = self.get_object()
            if user.is_active:
                return Response({'detail': 'کاربر فعال را نمی‌توان حذف کرد.'}, status=400)
            username = user.username
            user.delete()
            return Response({'detail': f'درخواست {username} رد شد و کاربر حذف گردید.'})
        except User.DoesNotExist:
            return Response({'detail': 'کاربر یافت نشد.'}, status=404)
