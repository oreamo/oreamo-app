INFRA := postgres redis localstack
SERVICE := web api agent

.PHONY: init up down lint lint-fix format format-fix build run stop logs status help infra service $(INFRA) $(SERVICE)

TARGET_up := service infra
TARGET_down := $(TARGET_up)
TARGET_lint := web agent
TARGET_lint-fix := $(TARGET_lint)
TARGET_format := web api agent
TARGET_format-fix := $(TARGET_format)
TARGET_build := web api agent
TARGET_run := web api agent
TARGET_stop := web api agent
TARGET_logs := web api agent
TARGET_status := infra service $(INFRA) $(SERVICE)

DEFAULT_status := service infra

COMMAND := $(firstword $(MAKECMDGOALS))
ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))

INVALID := $(filter-out $(TARGET_$(COMMAND)),$(ARGS))
ifneq ($(INVALID),)
$(error Invalid targets of $(COMMAND): $(INVALID))
endif

SERVICES := $(patsubst infra,$(INFRA),$(patsubst service,$(SERVICE),$(or $(ARGS),$(DEFAULT_$(COMMAND)),$(TARGET_$(COMMAND)))))

init:
	@bash scripts/init.sh

up down lint lint-fix format format-fix build run stop:
	@bash scripts/task.sh $@ $(SERVICES)

logs:
	@docker compose logs -f $(SERVICES)

status:
	@bash scripts/status.sh $(SERVICES)

help:
	@echo "Usage: make {command} {targets}"
	@echo
	@echo "Commands:"
	@echo "  init         Install dependencies and git hooks"
	@echo "  up           Build and start the containers with Docker   (service, infra)"
	@echo "  down         Stop and remove the containers               (service, infra)"
	@echo "  run          Run the services directly in the background  (web, api, agent)"
	@echo "  stop         Stop the services run directly               (web, api, agent)"
	@echo "  logs         Show the logs of the containers              (web, api, agent)"
	@echo "  status       Show whether the targets are running         (web, api, agent, postgres, redis, localstack, service, infra)"
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
