psql -h localhost statlord -c "DROP SCHEMA public CASCADE;CREATE SCHEMA public;"
python manage.py migrate
sleep 3
python manage.py runserver 8000