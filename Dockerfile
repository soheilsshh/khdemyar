FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-openbsd \     
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .


COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


RUN adduser --disabled-password --gecos '' django
RUN chown -R django:django /app
USER django

EXPOSE 8000


ENTRYPOINT ["/entrypoint.sh"]