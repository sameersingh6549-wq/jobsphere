#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== 1. Building React SaaS Frontend ==="
cd frontend
npm install
npm run build
cd ..

echo "=== 2. Installing Python Backend Dependencies ==="
pip install -r requirements.txt

echo "=== 3. Collecting All Static Files & Bundles ==="
python manage.py collectstatic --noinput

echo "=== 4. Running PostgreSQL Database Migrations ==="
python manage.py migrate

echo "=== 5. Loading Data Fixtures into PostgreSQL ==="
python manage.py loaddata datadump.json || true

echo "=== 6. Ensuring Media Storage Directories Exist ==="
mkdir -p media media/resumes media/application_resumes media/profile_photo
