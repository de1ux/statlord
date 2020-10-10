FROM python:3.7

# TODO - install a fixed version of npm
RUN apt-get update && \
    apt-get install -y curl nodejs && \
    curl -L https://www.npmjs.com/install.sh | sh

COPY client /client
WORKDIR client

RUN npm install && \
    npm run build

# TODO - merge index.html beforehand
RUN cp index.html dist/ && \
    mkdir -p /server && \
    cp -R dist /server/static

COPY server /server
WORKDIR /server

RUN pip install -r requirements.txt

# TODO - use real wsgi server
CMD ["./manage.py", "runserver"]