INFRA := postgres redis localstack
SERVICE := frontend backend agent

.PHONY: up down run infra service $(INFRA) $(SERVICE)

TARGETS := $(if $(filter infra,$(MAKECMDGOALS)),$(INFRA)) $(if $(filter service,$(MAKECMDGOALS)),$(SERVICE))

up:
	docker compose up -d --build $(TARGETS)

down:
	docker compose down $(TARGETS)

run:
	docker compose up -d --build --no-deps $(filter $(INFRA) $(SERVICE),$(MAKECMDGOALS))

infra service $(INFRA) $(SERVICE):
	@:
