.PHONY: build up start down logs logs-api ps db-shell

DOCKER_CMD=docker-compose -f docker-compose.yml

default-env-files:
	cp api/.env.example api/.env
	cp database/.env.example database/.env
build:
	$(DOCKER_CMD) build
up:
	$(DOCKER_CMD) up -d
start:
	$(DOCKER_CMD) start
down:
	$(DOCKER_CMD) down
test:
	$(DOCKER_CMD) exec -it api yarn test
logs:
	$(DOCKER_CMD) logs
logs-api:
	$(DOCKER_CMD) logs api
ps:
	$(DOCKER_CMD) ps
db-shell:
	$(DOCKER_CMD) exec db psql -Upostgres
