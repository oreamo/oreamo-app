INFRA := db redis aws
SERVICE := web api agent

# Map the targets to the docker compose services.
COMPOSE_db := postgres
COMPOSE_redis := redis
COMPOSE_aws := localstack
COMPOSE_web := web
COMPOSE_api := api
COMPOSE_agent := agent

.PHONY: up down infra service $(INFRA) $(SERVICE)

NAMES := $(if $(filter infra,$(MAKECMDGOALS)),$(INFRA)) $(if $(filter service,$(MAKECMDGOALS)),$(SERVICE)) $(filter $(INFRA) $(SERVICE),$(MAKECMDGOALS))
TARGETS := $(sort $(foreach name,$(NAMES),$(COMPOSE_$(name))))

up:
	docker compose up -d --build $(TARGETS)

down:
	docker compose down $(TARGETS)

infra service $(INFRA) $(SERVICE):
	@:
