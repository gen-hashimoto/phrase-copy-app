# ==================================================
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
# Production: pull from ECR
# ==================================================
# variables
COMPOSE_PROD_ECR := infra/docker-compose.prod.ecr.yml
DC_PROD_ECR := docker compose -f $(COMPOSE_PROD_ECR) --env-file $(ENV_PROD)

.PHONY: login-ecr pull-prod deploy-prod-ecr

# Log in to ECR using the EC2 instance profile (no access keys in .env)
# Requires AWS_REGION and ECR_REGISTRY in the environment (or pass on the command line).
login-ecr:
	aws ecr get-login-password --region $(AWS_REGION) \
		| docker login --username AWS --password-stdin $(ECR_REGISTRY)

# Pull app images only (caddy/db use public images)
pull-prod: login-ecr
	$(DC_PROD_ECR) pull frontend backend

# Manual / same path as CI (scripts/ec2-deploy.sh)
deploy-prod-ecr:
	set -a && . ./$(ENV_PROD) && set +a && \
	IMAGE_TAG=$${IMAGE_TAG:-latest} bash scripts/ec2-deploy.sh

# Example one-liner after SSH (rollback):
#   IMAGE_TAG=previous-sha make deploy-prod-ecr

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
