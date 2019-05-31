rm -rf db.sqlite3
python manage.py makemigrations
python manage.py migrate
sleep 3
python manage.py runserver 8000