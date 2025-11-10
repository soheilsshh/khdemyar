
set -e  

echo "Waiting for database..."


echo "Running makemigrations..."
python manage.py makemigrations --no-input || echo "No new migrations"

echo "Applying migrations..."
python manage.py migrate --no-input

echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "Starting Gunicorn..."
exec gunicorn khademyar.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --worker-class sync \
    --log-level info \
    --access-logfile - \
    --error-logfile -