.PHONY: build up start down logs logs-api ps db-shell

build:
	docker-compose -f docker-compose.yml build
up:
	docker-compose -f docker-compose.yml up -d
start:
	docker-compose -f docker-compose.yml start
down:
	docker-compose -f docker-compose.yml down
logs:
	docker-compose -f docker-compose.yml logs --tail=100 -f
logs-api:
	docker-compose -f docker-compose.yml logs --tail=100 -f api
ps:
	docker-compose -f docker-compose.yml ps
db-shell:
	docker-compose -f docker-compose.yml exec db psql -Upostgres
