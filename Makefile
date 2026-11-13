.PHONY: init up down run stop

SERVICES := frontend backend agent

init:
	bash scripts/init.sh

up:
	docker compose up -d --build

down:
	docker compose down

run:
	docker compose restart $(SERVICES)

stop:
	docker compose stop $(SERVICES)
