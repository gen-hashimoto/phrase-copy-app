#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/phrase-copy-app}"
COMPOSE_FILE="${COMPOSE_FILE:-infra/docker-compose.prod.ecr.yml}"
ENV_FILE="${ENV_FILE:-infra/.env.prod}"

cd "$APP_DIR"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE" >&2
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Missing $COMPOSE_FILE" >&2
  exit 1
fi

: "${IMAGE_TAG:?IMAGE_TAG is required}"
: "${ECR_REGISTRY:?ECR_REGISTRY is required}"
: "${AWS_REGION:?AWS_REGION is required}"

echo "==> ECR login ($ECR_REGISTRY)"
aws ecr get-login-password --region "$AWS_REGION" |
  docker login --username AWS --password-stdin "$ECR_REGISTRY"

DC=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE")

echo "==> Pull images (tag: $IMAGE_TAG)"
IMAGE_TAG="$IMAGE_TAG" ECR_REGISTRY="$ECR_REGISTRY" "${DC[@]}" pull frontend backend

echo "==> Up services"
IMAGE_TAG="$IMAGE_TAG" ECR_REGISTRY="$ECR_REGISTRY" "${DC[@]}" up -d

echo "==> Prune dangling images"
docker image prune -f

echo "==> Done"
"${DC[@]}" ps
