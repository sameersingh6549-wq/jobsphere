#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== 1. Installing dependencies ==="
pip install -r requirements.txt

echo "=== 2. Collecting static files ==="
python manage.py collectstatic --noinput

echo "=== 3. Running PostgreSQL database migrations ==="
python manage.py migrate
