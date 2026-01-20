# Alzheimer Classification - Makefile

.PHONY: help up down logs clean db backend frontend

COMPOSE = docker compose

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ===========================================
# Todos los servicios
# ===========================================

up: ## Levanta todo (BD + Backend + Frontend)
	$(COMPOSE) up -d --build

down: ## Detiene todo
	$(COMPOSE) down

logs: ## Logs de todo
	$(COMPOSE) logs -f

clean: ## Limpia todo (contenedores + volumenes)
	$(COMPOSE) down -v --remove-orphans

destroy: ## Elimina TODO de este proyecto (contenedores, volumenes, imagenes)
	$(COMPOSE) down -v --remove-orphans --rmi all

# ===========================================
# Solo Base de Datos
# ===========================================

db: ## Levanta solo la BD
	$(COMPOSE) up -d --build db

db-down: ## Detiene la BD
	$(COMPOSE) stop db

db-logs: ## Logs de la BD
	$(COMPOSE) logs -f db

db-shell: ## Shell SQL Server
	docker exec -it alzheimer-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "P@ssw0rd1234!" -C

# ===========================================
# Solo Backend
# ===========================================

backend: ## Levanta BD + Backend
	$(COMPOSE) up -d --build db backend

backend-down: ## Detiene el Backend
	$(COMPOSE) stop backend

backend-logs: ## Logs del Backend
	$(COMPOSE) logs -f backend

# ===========================================
# Solo Frontend
# ===========================================

frontend: ## Levanta solo el Frontend
	$(COMPOSE) up -d --build frontend

frontend-down: ## Detiene el Frontend
	$(COMPOSE) stop frontend

frontend-logs: ## Logs del Frontend
	$(COMPOSE) logs -f frontend
