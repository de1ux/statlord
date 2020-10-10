tag := $(git rev-parse --short HEAD)

install: install-server install-client

install-server:
	cd server && \
	pip install -r requirements.txt

install-client:
	cd client && \
	npm i

run-server:
	cd server && \
	./manage.py runserver 0.0.0.0:8000

run-client:
	cd client && \
	npm run dev

run:
	make -j 2 run-server run-client

build:
	docker build -t statlord:$(tag) .

