# ==========================================
# Makefile para gestión del proyecto
# ==========================================

.PHONY: help build up down logs clean restart status health

# Colores para output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Mostrar esta ayuda
	@echo "$(GREEN)Comandos disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Construir todas las imágenes
	@echo "$(GREEN)Construyendo imágenes...$(NC)"
	docker-compose build --parallel

build-no-cache: ## Construir sin usar cache
	@echo "$(GREEN)Construyendo imágenes sin cache...$(NC)"
	docker-compose build --no-cache --parallel

up: ## Levantar todos los servicios
	@echo "$(GREEN)Levantando servicios...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)Servicios iniciados!$(NC)"
	@make status

up-dev: ## Levantar en modo desarrollo
	@echo "$(GREEN)Levantando servicios en modo desarrollo...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@make status

down: ## Detener todos los servicios
	@echo "$(RED)Deteniendo servicios...$(NC)"
	docker-compose down

down-volumes: ## Detener servicios y eliminar volúmenes
	@echo "$(RED)Deteniendo servicios y eliminando volúmenes...$(NC)"
	docker-compose down -v

logs: ## Ver logs de todos los servicios
	docker-compose logs -f

logs-api: ## Ver logs del backend
	docker-compose logs -f api

logs-frontend: ## Ver logs del frontend
	docker-compose logs -f frontend

logs-mysql: ## Ver logs de MySQL
	docker-compose logs -f mysql

restart: ## Reiniciar todos los servicios
	@echo "$(YELLOW)Reiniciando servicios...$(NC)"
	docker-compose restart
	@make status

restart-api: ## Reiniciar solo el backend
	@echo "$(YELLOW)Reiniciando API...$(NC)"
	docker-compose restart api

restart-frontend: ## Reiniciar solo el frontend
	@echo "$(YELLOW)Reiniciando frontend...$(NC)"
	docker-compose restart frontend

status: ## Ver estado de los servicios
	@echo "$(GREEN)Estado de los servicios:$(NC)"
	@docker-compose ps

health: ## Verificar salud de los servicios
	@echo "$(GREEN)Verificando salud de los servicios...$(NC)"
	@docker inspect --format='{{.Name}}: {{.State.Health.Status}}' $$(docker-compose ps -q) 2>/dev/null || echo "Health checks en progreso..."

clean: ## Limpiar todo (contenedores, imágenes, volúmenes)
	@echo "$(RED)Limpiando todo...$(NC)"
	docker-compose down -v --rmi all
	@echo "$(GREEN)Limpieza completada!$(NC)"

shell-api: ## Abrir shell en el contenedor del backend
	docker-compose exec api /bin/bash

shell-mysql: ## Abrir shell MySQL
	docker-compose exec mysql mysql -u admin -pAdmin123! RegistroEstudiantesDB

shell-frontend: ## Abrir shell en el contenedor del frontend
	docker-compose exec frontend /bin/sh

backup-db: ## Hacer backup de la base de datos
	@echo "$(GREEN)Creando backup de la base de datos...$(NC)"
	docker-compose exec -T mysql mysqldump -u admin -pAdmin123! RegistroEstudiantesDB > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup creado!$(NC)"

restore-db: ## Restaurar base de datos desde backup (uso: make restore-db FILE=backup.sql)
	@echo "$(YELLOW)Restaurando base de datos...$(NC)"
	docker-compose exec -T mysql mysql -u admin -pAdmin123! RegistroEstudiantesDB < $(FILE)
	@echo "$(GREEN)Base de datos restaurada!$(NC)"

test-api: ## Ejecutar tests del backend
	@echo "$(GREEN)Ejecutando tests del backend...$(NC)"
	cd RegistroEstudiantes.API && dotnet test

test-frontend: ## Ejecutar tests del frontend
	@echo "$(GREEN)Ejecutando tests del frontend...$(NC)"
	cd RegistroEstudiantes.Web && npm test

dev: ## Iniciar desarrollo local (sin Docker)
	@echo "$(GREEN)Iniciando desarrollo local...$(NC)"
	@echo "$(YELLOW)Asegúrate de tener MySQL corriendo en localhost:3306$(NC)"
	@make -j2 dev-api dev-frontend

dev-api: ## Iniciar solo backend en desarrollo
	cd RegistroEstudiantes.API && dotnet watch run

dev-frontend: ## Iniciar solo frontend en desarrollo
	cd RegistroEstudiantes.Web && npm start

install: ## Instalar dependencias
	@echo "$(GREEN)Instalando dependencias del backend...$(NC)"
	cd RegistroEstudiantes.API && dotnet restore
	@echo "$(GREEN)Instalando dependencias del frontend...$(NC)"
	cd RegistroEstudiantes.Web && npm install

prune: ## Limpiar recursos Docker no utilizados
	@echo "$(YELLOW)Limpiando recursos Docker...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)Limpieza completada!$(NC)"
