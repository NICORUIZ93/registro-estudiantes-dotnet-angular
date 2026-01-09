#!/bin/bash

# ==========================================
# Script de inicio para el proyecto
# ==========================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=========================================="
echo "  REGISTRO DE ESTUDIANTES"
echo "  Sistema de Gestión Académica"
echo "=========================================="
echo -e "${NC}"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker no está ejecutándose${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker está disponible${NC}"

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose está disponible${NC}"

# Verificar archivo .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ Archivo .env no encontrado, copiando desde .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠ Por favor, edita el archivo .env con tus configuraciones${NC}"
    read -p "¿Continuar con valores por defecto? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Archivo .env encontrado${NC}"

# Limpiar contenedores anteriores
echo -e "${YELLOW}Deteniendo contenedores anteriores...${NC}"
docker-compose down 2>/dev/null || true

# Construir imágenes
echo -e "${BLUE}Construyendo imágenes...${NC}"
docker-compose build --parallel

# Levantar servicios
echo -e "${BLUE}Levantando servicios...${NC}"
docker-compose up -d

# Esperar a que los servicios estén listos
echo -e "${YELLOW}Esperando a que los servicios estén listos...${NC}"
sleep 10

# Verificar estado
echo -e "${BLUE}Estado de los servicios:${NC}"
docker-compose ps

# Mostrar información de acceso
echo -e "${GREEN}"
echo "=========================================="
echo "  SERVICIOS INICIADOS CORRECTAMENTE"
echo "=========================================="
echo -e "${NC}"
echo -e "${BLUE}MySQL:${NC}          localhost:3306"
echo -e "${BLUE}Backend API:${NC}    http://localhost:5096"
echo -e "${BLUE}Frontend:${NC}       http://localhost:4200"
echo -e "${BLUE}phpMyAdmin:${NC}     http://localhost:8080"
echo -e "${BLUE}Swagger:${NC}        http://localhost:5096/swagger"
echo ""
echo -e "${YELLOW}Credenciales MySQL:${NC}"
echo "  Usuario: admin"
echo "  Password: Admin123!"
echo "  Base de datos: RegistroEstudiantesDB"
echo ""
echo -e "${GREEN}Para ver logs: docker-compose logs -f${NC}"
echo -e "${GREEN}Para detener: docker-compose down${NC}"
echo ""
