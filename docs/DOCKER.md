# Guía Docker - Registro de Estudiantes

## Inicio Rápido

### Opción 1: Script Automático (Recomendado)

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

### Opción 2: Docker Compose Manual

```bash
# Construir e iniciar
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### Opción 3: Makefile

```bash
make up      # Iniciar servicios
make status  # Ver estado
make logs    # Ver logs
make help    # Ver todos los comandos
```

## Servicios Disponibles

| Servicio | Puerto | URL | Credenciales |
|----------|--------|-----|--------------|
| Frontend | 4200 | http://localhost:4200 | N/A |
| Backend API | 5096 | http://localhost:5096/api | N/A |
| Swagger | 5096 | http://localhost:5096/swagger | N/A |
| Health Check | 5096 | http://localhost:5096/health | N/A |
| MySQL | 3306 | localhost:3306 | admin / Admin123! |
| phpMyAdmin | 8080 | http://localhost:8080 | admin / Admin123! |

## Comandos Útiles

### Gestión Básica

```bash
# Iniciar
docker-compose up -d
make up

# Detener
docker-compose down
make down

# Reiniciar
docker-compose restart
make restart

# Ver estado
docker-compose ps
make status

# Ver logs
docker-compose logs -f
docker-compose logs -f api        # Solo API
docker-compose logs -f mysql      # Solo MySQL
```

### Construcción

```bash
# Construir todas las imágenes
docker-compose build

# Construir sin cache
docker-compose build --no-cache
make build-no-cache

# Construir servicio específico
docker-compose build api
docker-compose build frontend
```

### Acceso a Contenedores

```bash
# Shell en API
docker-compose exec api /bin/bash

# Shell en MySQL
docker-compose exec mysql bash
make shell-mysql

# Ejecutar consulta SQL
docker-compose exec mysql mysql -uadmin -pAdmin123! RegistroEstudiantesDB -e "SELECT * FROM estudiantes;"
```

### Backup y Restauración

```bash
# Crear backup
docker-compose exec -T mysql mysqldump -uadmin -pAdmin123! RegistroEstudiantesDB > backup.sql
make backup-db

# Restaurar backup
docker-compose exec -T mysql mysql -uadmin -pAdmin123! RegistroEstudiantesDB < backup.sql
make restore-db FILE=backup.sql
```

### Limpieza

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: elimina datos)
docker-compose down -v

# Limpieza completa
docker-compose down -v --rmi all
make clean
```

## Arquitectura

```
┌────────────────────────────────────────────────┐
│           Docker Network (Bridge)              │
├────────────────────────────────────────────────┤
│                                                │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  MySQL  │→ │ .NET API │→ │   Angular   │  │
│  │  :3306  │  │  :5096   │  │    :4200    │  │
│  └────┬────┘  └──────────┘  └─────────────┘  │
│       │                                        │
│  ┌────▼──────┐                                │
│  │phpMyAdmin │                                 │
│  │  :8080    │                                 │
│  └───────────┘                                 │
└────────────────────────────────────────────────┘
```

## Health Checks

Todos los servicios tienen health checks configurados:

```bash
# Ver salud de servicios
docker inspect --format='{{.State.Health.Status}}' registro_estudiantes_api
docker inspect --format='{{.State.Health.Status}}' registro_estudiantes_db

# Usando Makefile
make health
```

Estados:
- `starting` - Iniciando
- `healthy` - Funcionando correctamente
- `unhealthy` - Con problemas

## Modo Desarrollo

Para desarrollo con logs verbosos:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
make up-dev
```

## Solución de Problemas

### Puerto ya en uso

```bash
# Windows
netstat -ano | findstr :5096
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5096
kill -9 <PID>
```

### Contenedor no inicia

```bash
# Ver logs
docker-compose logs <servicio>

# Ejemplo
docker-compose logs mysql
docker-compose logs api
```

### Error de conexión a BD

```bash
# Verificar MySQL
docker-compose ps mysql

# Reiniciar MySQL
docker-compose restart mysql

# Reconstruir desde cero
docker-compose down -v
docker-compose up -d
```

### Cambios no se reflejan

```bash
# Reconstruir sin cache
docker-compose build --no-cache
docker-compose up -d
```

## Variables de Entorno

Edita `.env` para configurar:

```env
# MySQL
MYSQL_ROOT_PASSWORD=rootpass123
MYSQL_DATABASE=RegistroEstudiantesDB
MYSQL_USER=admin
MYSQL_PASSWORD=Admin123!
```

## Volúmenes Persistentes

Los datos se guardan en volúmenes Docker:

```bash
# Listar volúmenes
docker volume ls | grep registro_estudiantes

# Inspeccionar volumen
docker volume inspect registro_estudiantes_mysql_data

# Eliminar volúmenes (CUIDADO: elimina datos)
docker volume rm registro_estudiantes_mysql_data
```

## Comandos Makefile Completos

```bash
make help              # Mostrar ayuda
make build             # Construir imágenes
make build-no-cache    # Construir sin cache
make up                # Iniciar servicios
make up-dev            # Iniciar en modo desarrollo
make down              # Detener servicios
make down-volumes      # Detener + eliminar volúmenes
make logs              # Ver logs de todos
make logs-api          # Ver logs del API
make logs-frontend     # Ver logs del frontend
make logs-mysql        # Ver logs de MySQL
make restart           # Reiniciar todos
make restart-api       # Reiniciar solo API
make restart-frontend  # Reiniciar solo frontend
make status            # Ver estado
make health            # Verificar salud
make clean             # Limpieza completa
make shell-api         # Shell en API
make shell-mysql       # Shell MySQL
make shell-frontend    # Shell en frontend
make backup-db         # Backup de BD
make restore-db        # Restaurar BD (uso: FILE=backup.sql)
make prune             # Limpiar sistema Docker
```

## Notas Importantes

- Los datos de MySQL persisten en volúmenes Docker
- Use `docker-compose down -v` solo si quiere eliminar todos los datos
- Los scripts SQL se ejecutan automáticamente al crear MySQL por primera vez
- Para resetear la BD: `docker-compose down -v && docker-compose up -d`
