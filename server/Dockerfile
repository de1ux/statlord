FROM python:3.7

COPY . /srv
WORKDIR /srv

RUN pip install -r requirements.txt

CMD ["./manage.py", "runserver"]