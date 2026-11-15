INFRA := postgres redis localstack
SERVICE := web api agent

.PHONY: up down run infra service $(SERVICE)

TARGETS := $(sort $(if $(filter infra,$(MAKECMDGOALS)),$(INFRA)) $(if $(filter service,$(MAKECMDGOALS)),$(SERVICE)) $(filter $(SERVICE),$(MAKECMDGOALS)))

up:
	docker compose up -d --build $(TARGETS)

down:
	docker compose down $(TARGETS)

run:
	docker compose up -d --build --no-deps $(TARGETS)

infra service $(SERVICE):
	@:
