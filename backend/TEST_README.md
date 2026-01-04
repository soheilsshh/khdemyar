# راهنمای تست پروژه خادمیار

## مقدمه

این پروژه شامل تست‌های کاملی برای تمامی endpointهای API است. تست‌ها با استفاده از pytest و pytest-django نوشته شده‌اند.

## ساختار تست‌ها

### ۱. تست‌های اپلیکیشن Accounts (`accounts/tests.py`)
- ارسال و تایید OTP
- سیستم ورود و خروج
- مدیریت پروفایل کاربری
- مدیریت درخواست‌های ثبت‌نام (فقط ادمین)

### ۲. تست‌های اپلیکیشن Core (`core/tests.py`)
- مدیریت کارمندان
- مدیریت شیفت‌ها و درخواست‌ها
- مدیریت ادمین‌ها (فقط سوپرادمین)

### ۳. تست‌های اپلیکیشن CMS (`cms/tests.py`)
- مدیریت اخبار
- مدیریت بازخوردها
- اطلاعات تماس و درباره ما
- ردیابی بازدیدها
- داشبورد مدیریتی
- مدیریت زیرنویس‌ها

### ۴. تست جامع همه endpointها (`test_all_endpoints.py`)
- تست همه endpointها در یک فایل
- تست دسترسی‌ها و مجوزها
- تست validation داده‌ها

## پیش‌نیازها

```bash
pip install pytest-django pytest factory-boy
```

## اجرای تست‌ها

### اجرای همه تست‌ها
```bash
# فعال کردن محیط مجازی
venv\Scripts\activate  # Windows
# یا
source venv/bin/activate  # Linux/Mac

# اجرای همه تست‌ها
python -m pytest

# اجرای با جزئیات بیشتر
python -m pytest -v

# اجرای با coverage
python -m pytest --cov=. --cov-report=html
```

### اجرای تست‌های خاص

```bash
# اجرای تست‌های accounts
python -m pytest accounts/tests.py -v

# اجرای تست‌های core
python -m pytest core/tests.py -v

# اجرای تست‌های CMS
python -m pytest cms/tests.py -v

# اجرای تست جامع
python -m pytest test_all_endpoints.py -v

# اجرای تست خاص
python -m pytest accounts/tests.py::TestOTPSystem::test_send_otp_success -v
```

### اجرای تست‌ها با فایل batch (Windows)
```bash
run_tests.bat
```

## تنظیمات تست

### فایل‌های تنظیمات:
- `conftest.py`: Fixtures مشترک
- `pytest.ini`: تنظیمات pytest
- `requirements.txt`: وابستگی‌های تست

### Fixtures موجود:
- `api_client`: کلاینت API
- `regular_user`: کاربر عادی
- `employee`: پروفایل کارمند
- `admin_user`: کاربر ادمین
- `super_admin`: سوپرادمین
- `shift`: شیفت تستی
- `news`: خبر تستی
- `feedback`: بازخورد تستی
- `subtitle`: زیرنویس تستی

## سناریوهای تست اصلی

### ۱. گردش کار کامل کاربر عادی
1. ثبت‌نام با OTP
2. ورود به سیستم
3. مشاهده و بروزرسانی پروفایل
4. مشاهده لیست شیفت‌ها
5. ثبت درخواست برای شیفت
6. ارسال بازخورد

### ۲. گردش کار کامل ادمین
1. ورود به سیستم
2. تایید درخواست‌های ثبت‌نام
3. ایجاد و مدیریت شیفت‌ها
4. مدیریت درخواست‌های شیفت
5. مدیریت اخبار و محتوا
6. مشاهده آمار و داشبورد
7. مدیریت ادمین‌های دیگر (سوپرادمین)

### ۳. تست‌های امنیتی
- دسترسی غیرمجاز به endpointهای ادمین
- Validation داده‌های ورودی
- تست SQL Injection
- Rate limiting

### ۴. تست‌های عملکردی
- زمان پاسخ APIها
- Load testing اولیه
- Memory usage

## پوشش تست‌ها

### Accounts (احراز هویت):
- ✅ ارسال و تایید OTP
- ✅ ورود/خروج
- ✅ مدیریت پروفایل
- ✅ تغییر رمز عبور
- ✅ مدیریت درخواست‌های ثبت‌نام

### Core (مدیریت اصلی):
- ✅ لیست و جزئیات کارمندان
- ✅ بروزرسانی پروفایل کارمند
- ✅ لیست شیفت‌ها
- ✅ ایجاد شیفت (ادمین)
- ✅ درخواست و تایید شیفت
- ✅ مدیریت ادمین‌ها (سوپرادمین)

### CMS (مدیریت محتوا):
- ✅ مدیریت اخبار
- ✅ مدیریت بازخوردها
- ✅ اطلاعات تماس
- ✅ درباره ما
- ✅ ردیابی بازدیدها
- ✅ داشبورد
- ✅ مدیریت زیرنویس‌ها

## نکات مهم

### ۱. تنظیمات Django
- تست‌ها از `khademyar.settings` استفاده می‌کنند
- Database تستی جداگانه ایجاد می‌شود
- Migrations به صورت خودکار اعمال می‌شوند

### ۲. داده‌های تستی
- هر تست داده‌های خود را ایجاد می‌کند
- از fixtures برای جلوگیری از تکرار استفاده شده
- داده‌ها بین تست‌ها ایزوله هستند

### ۳. Permission Testing
- تست‌های دسترسی برای همه endpointها
- بررسی نقش‌های مختلف کاربر
- تست edge cases

### ۴. Validation Testing
- تست داده‌های نامعتبر
- تست محدودیت‌های طول
- تست required fields

## گزارش مشکلات

اگر تست‌ها شکست خوردند:

1. Database migrations را چک کنید:
```bash
python manage.py makemigrations
python manage.py migrate
```

2. Dependencies را نصب کنید:
```bash
pip install -r requirements.txt
```

3. Virtual environment را فعال کنید

4. Logs را بررسی کنید:
```bash
python -m pytest -v -s
```

## بهبودهای آینده

- اضافه کردن تست‌های performance
- تست‌های load با Locust
- تست‌های E2E با Selenium
- Integration tests با Docker
