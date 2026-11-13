.PHONY: up down infra service

INFRA := postgres redis localstack
SERVICE := frontend backend agent

TARGETS := $(if $(filter infra,$(MAKECMDGOALS)),$(INFRA)) $(if $(filter service,$(MAKECMDGOALS)),$(SERVICE))

up:
	docker compose up -d --build $(TARGETS)

down:
	docker compose down $(TARGETS)

infra service:
	@:
