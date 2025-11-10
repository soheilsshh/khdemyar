FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# نصب وابستگی‌های سیستم
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# کپی requirements و نصب
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# کپی کد
COPY . .

# ساخت یوزر غیرروت
RUN adduser --disabled-password --gecos '' django
RUN chown -R django:django /app
USER django

EXPOSE 8000


CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn khademyar.wsgi:application --bind 0.0.0.0:8000 --workers 2"]