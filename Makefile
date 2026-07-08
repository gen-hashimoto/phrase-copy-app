# variables
COMPOSE_PROD := infra/docker-compose.prod.yml
ENV_PROD := infra/.env.prod
DC_PROD := docker compose -f $(COMPOSE_PROD) --env-file $(ENV_PROD)

COMPOSE_DEV := infra/docker-compose.local.yml
ENV_DEV := infra/.env.local
DC_DEV := docker compose -f $(COMPOSE_DEV) --env-file $(ENV_DEV)

.PHONY: deploy-prod deploy-dev \
				logs-prod logs-dev down-prod down-dev \
				restart-prod restart-dev ps-prod ps-dev

# ==================================================
# Production
# ==================================================
deploy-prod:
	git pull --ff-only
	$(DC_PROD) up -d --build
	docker image prune -f

logs-prod:
	$(DC_PROD) logs -f

down-prod:
	$(DC_PROD) down

# docker compose restart ignores healthchecks; recreate waits for db
restart-prod:
	$(DC_PROD) up -d --force-recreate

ps-prod:
	$(DC_PROD) ps

# ==================================================
# Development
# ==================================================
deploy-dev:
	$(DC_DEV) up --build

logs-dev:
	$(DC_DEV) logs -f

down-dev:
	$(DC_DEV) down

# docker compose restart ignores healthchecks; recreate waits for db
restart-dev:
	$(DC_DEV) up -d --force-recreate

ps-dev:
	$(DC_DEV) ps
