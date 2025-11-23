from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
import requests
import random

from core.models import Employee
from .models import OTPCode  


from .serializers import (
    EmployeeRegisterSerializer,
    LoginSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    UserSerializer,
    RegistrationRequestListSerializer,
    ApprovalActionSerializer
)

User = get_user_model()


def send_sms(to, text):
    """
    ارسال پیامک با سرویس فراز اس‌ام‌اس (ایران‌پیمک)
    داکیومنت: https://docs.iranpayamak.com/
    """
    url = "https://api.payamak-panel.com/post/send.asmx/SendSimpleSMS2"
    payload = {
        'username': settings.FARAZSMS_USERNAME,
        'password': settings.FARAZSMS_PASSWORD,
        'to': to,
        'from': settings.FARAZSMS_FROM,
        'text': text,
        'isFlash': 'false'
    }
    try:
        response = requests.post(url, data=payload, timeout=10)
        # در پروداکشن: لاگ کن
        # print(response.text)
    except Exception as e:
        print(f"[SMS ERROR] {e}")

class AuthViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.none()  # لازم نیست، فقط برای ModelViewSet
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'register':
            return EmployeeRegisterSerializer
        if self.action == 'login':
            return LoginSerializer
        if self.action == 'send_otp':
            return OTPRequestSerializer
        if self.action == 'verify_otp':
            return OTPVerifySerializer
        return UserSerializer

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'درخواست ثبت‌نام با موفقیت ارسال شد. منتظر تأیید مدیر باشید.'}, status=201)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if not user.is_active:
            return Response({'detail': 'حساب شما هنوز توسط مدیر تأیید نشده است.'}, status=403)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    
    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone_number']

        try:
            user = User.objects.get(phone_number=phone, is_active=True)
        except User.DoesNotExist:
            return Response({'detail': 'کاربر یافت نشد یا حساب شما تأیید نشده است.'}, status=404)

        code = ''.join(random.choices('0123456789', k=6))
        OTPCode.objects.filter(phone_number=phone).delete()
        OTPCode.objects.create(phone_number=phone, code=code)


        return Response({'detail': 'کد تأیید با موفقیت ارسال شد.'})

    # تأیید OTP و ورود
    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone_number']
        code = serializer.validated_data['code']

        try:
            otp = OTPCode.objects.get(phone_number=phone, code=code)
            if not otp.is_valid():
                otp.delete()
                return Response({'detail': 'کد منقضی شده است.'}, status=400)

            user = User.objects.get(phone_number=phone)
            otp.delete()

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        except OTPCode.DoesNotExist:
            return Response({'detail': 'کد وارد شده اشتباه است.'}, status=400)



class RegistrationRequestViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('user').all()
    serializer_class = RegistrationRequestListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        if self.action == 'pending_requests':
            return self.queryset.filter(status='pending')
        if self.action == 'rejected_requests':
            return self.queryset.filter(status='rejected')
        return self.queryset.filter(status__in=['pending', 'rejected','approved'])

    # لیست درخواست‌های در انتظار
    @action(detail=False, methods=['get'])
    def pending_requests(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # لیست درخواست‌های رد شده
    @action(detail=False, methods=['get'])
    def rejected_requests(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # تأیید درخواست
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        employee = self.get_object() 
        if employee.status != 'pending':
            return Response({'detail': 'این درخواست قبلاً بررسی شده است.'}, status=400)

        # فعال کردن کاربر
        employee.user.is_active = True
        employee.user.is_approved = True
        employee.user.save()

        # تغییر وضعیت کارمند
        employee.status = 'approved'
        employee.save()

        return Response({
            'detail': 'درخواست با موفقیت تأیید شد.'
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        employee = self.get_object()
        
        if employee.status != 'pending':
            return Response({'detail': 'این درخواست قبلاً بررسی شده است.'}, status=400)

        employee.status = 'rejected'
        employee.save()

        return Response({
            'detail': 'درخواست با موفقیت رد شد.'
        })   

