INFRA := db redis aws
SERVICE := web api agent

# Map the targets to the docker compose services.
COMPOSE_db := postgres
COMPOSE_redis := redis
COMPOSE_aws := localstack
COMPOSE_web := web
COMPOSE_api := api
COMPOSE_agent := agent

.PHONY: init up down lint lint-fix format format-fix build run stop logs status help infra service $(INFRA) $(SERVICE)

NAMES := $(if $(filter infra,$(MAKECMDGOALS)),$(INFRA)) $(if $(filter service,$(MAKECMDGOALS)),$(SERVICE)) $(filter $(INFRA) $(SERVICE),$(MAKECMDGOALS))
TARGETS := $(sort $(foreach name,$(NAMES),$(COMPOSE_$(name))))

# Allowed targets of the commands.
TARGET_up := infra service $(INFRA) $(SERVICE)
TARGET_down := $(TARGET_up)
TARGET_lint := web agent
TARGET_lint-fix := $(TARGET_lint)
TARGET_format := web api agent
TARGET_format-fix := $(TARGET_format)
TARGET_build := web api agent
TARGET_run := web api agent
TARGET_stop := web api agent
TARGET_logs := web api agent
TARGET_status := $(TARGET_up)

COMMAND := $(firstword $(MAKECMDGOALS))
ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

INVALID := $(filter-out $(TARGET_$(COMMAND)),$(ARGS))
ifneq ($(INVALID),)
$(error Invalid targets of $(COMMAND): $(INVALID))
endif

# Select the given services, or all allowed services if none is given.
SERVICES := $(or $(ARGS),$(TARGET_$(COMMAND)))

init:
	bash scripts/init.sh

up:
	docker compose up -d --build $(TARGETS)

down:
	docker compose down $(TARGETS)

lint:
	$(if $(filter web,$(SERVICES)),pnpm --dir oreamo-web lint)
	$(if $(filter agent,$(SERVICES)),uv run --directory oreamo-agent ruff check .)

lint-fix:
	$(if $(filter web,$(SERVICES)),pnpm --dir oreamo-web lint:fix)
	$(if $(filter agent,$(SERVICES)),uv run --directory oreamo-agent ruff check --fix .)

format:
	$(if $(filter web,$(SERVICES)),pnpm --dir oreamo-web format:check)
	$(if $(filter api,$(SERVICES)),oreamo-api/gradlew -p oreamo-api spotlessCheck)
	$(if $(filter agent,$(SERVICES)),uv run --directory oreamo-agent ruff format --check .)

format-fix:
	$(if $(filter web,$(SERVICES)),pnpm --dir oreamo-web format)
	$(if $(filter api,$(SERVICES)),oreamo-api/gradlew -p oreamo-api spotlessApply)
	$(if $(filter agent,$(SERVICES)),uv run --directory oreamo-agent ruff format .)

build:
	$(if $(filter web,$(SERVICES)),pnpm --dir oreamo-web build)
	$(if $(filter api,$(SERVICES)),oreamo-api/gradlew -p oreamo-api build)
	$(if $(filter agent,$(SERVICES)),uv run --directory oreamo-agent ty check)

run:
	bash scripts/run.sh $(SERVICES)

stop:
	bash scripts/stop.sh $(SERVICES)

logs:
	docker compose logs -f $(SERVICES)

status:
	@bash scripts/status.sh $(foreach name,$(or $(strip $(NAMES)),$(SERVICE) $(INFRA)),$(name):$(COMPOSE_$(name)))

help:
	@echo "Usage: make {command} {targets}"
	@echo
	@echo "Commands:"
	@echo "  init         Install dependencies and git hooks"
	@echo "  up           Build and start the containers with Docker   (web, api, agent, db, redis, aws, service, infra)"
	@echo "  down         Stop and remove the containers               (web, api, agent, db, redis, aws, service, infra)"
	@echo "  run          Run the services directly                    (web, api, agent)"
	@echo "  stop         Stop the services run directly               (web, api, agent)"
	@echo "  logs         Show the logs of the containers              (web, api, agent)"
	@echo "  status       Show whether the targets are running         (web, api, agent, db, redis, aws, service, infra)"
	@echo "  build        Build the services                           (web, api, agent)"
	@echo "  lint         Check lint                                   (web, agent)"
	@echo "  lint-fix     Fix lint                                     (web, agent)"
	@echo "  format       Check format                                 (web, api, agent)"
	@echo "  format-fix   Fix format                                   (web, api, agent)"
	@echo "  help         Show this help"
	@echo
	@echo "Without targets, it runs all targets of the command."

infra service $(INFRA) $(SERVICE):
	@:
