# Sistema de Registro de Estudiantes

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-21.0.0-DD0031?logo=angular)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

Sistema fullstack para la gestión de registro de estudiantes en materias académicas, con validaciones de negocio y arquitectura completamente dockerizada.

---

## 🚀 Inicio Rápido (Con Docker)

### Requisito: Tener Docker instalado

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

Espera 30 segundos y accede a:
- **Aplicación**: http://localhost:4200
- **API**: http://localhost:5096/swagger
- **phpMyAdmin**: http://localhost:8080

¡Eso es todo! 🎉

---

## 📋 Características Principales

### Reglas de Negocio Implementadas

✅ **CRUD completo de estudiantes**
- Crear, leer, actualizar y eliminar estudiantes

✅ **Sistema de créditos**
- 10 materias disponibles
- Cada materia vale 3 créditos
- Estudiantes se inscriben exactamente en 3 materias (9 créditos total)

✅ **Gestión de profesores**
- 5 profesores en el sistema
- Cada profesor imparte 2 materias

✅ **Validaciones automáticas**
- No se pueden repetir materias del mismo profesor
- Email único por estudiante
- Exactamente 3 materias por inscripción

✅ **Visualización de compañeros**
- Ver otros estudiantes registrados
- Ver compañeros por cada materia inscrita

### Tecnologías

**Backend:**
- .NET 10.0 Web API
- Entity Framework Core
- MySQL 8.0
- Swagger/OpenAPI

**Frontend:**
- Angular 21.0
- TypeScript 5.9
- RxJS 7.8
- Bootstrap 5

**DevOps:**
- Docker & Docker Compose
- Multi-stage builds
- Health checks
- Nginx

---

## 🎯 URLs de Acceso

| Servicio | URL | Usuario | Contraseña |
|----------|-----|---------|------------|
| **Aplicación Web** | http://localhost:4200 | - | - |
| **API REST** | http://localhost:5096/api | - | - |
| **Documentación API** | http://localhost:5096/swagger | - | - |
| **Health Check** | http://localhost:5096/health | - | - |
| **Base de Datos** | localhost:3306 | admin | Admin123! |
| **phpMyAdmin** | http://localhost:8080 | admin | Admin123! |

---

## 📦 Instalación

### Opción 1: Docker (Recomendado)

**Requisitos:**
- Docker Desktop instalado y ejecutándose

**Pasos:**

1. Clonar el repositorio
```bash
git clone https://github.com/NICORUIZ93/registro-estudiantes-dotnet-angular.git
cd RegistroEstudiantes
```

2. Ejecutar script de inicio
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

3. Esperar a que los servicios estén listos (~30 segundos)

4. Acceder a http://localhost:4200

### Opción 2: Desarrollo Local (Sin Docker)

**Requisitos:**
- .NET 10 SDK
- Node.js 18+
- MySQL 8.0
- Angular CLI 21

**Backend:**
```bash
cd RegistroEstudiantes.API
dotnet restore
dotnet run
```

**Frontend:**
```bash
cd RegistroEstudiantes.Web
npm install
ng serve
```

**Base de Datos:**
```bash
# Ejecutar el script de inicialización
mysql -u root -p < scripts/01-init-mysql.sql
```

---

## 🗂️ Estructura del Proyecto

```
RegistroEstudiantes/
├── RegistroEstudiantes.API/          # Backend .NET
│   ├── Controllers/                   # Endpoints REST
│   ├── Models/                        # Entidades
│   ├── DTOs/                          # Data Transfer Objects
│   ├── Data/                          # DbContext
│   └── Dockerfile                     # Docker backend
│
├── RegistroEstudiantes.Web/          # Frontend Angular
│   ├── src/app/
│   │   ├── components/                # Componentes UI
│   │   ├── services/                  # Servicios HTTP
│   │   └── models/                    # Interfaces
│   ├── Dockerfile                     # Docker frontend
│   └── nginx.conf                     # Config Nginx
│
├── scripts/
│   └── 01-init-mysql.sql             # Script BD
│
├── docs/                              # Documentación
│   ├── DOCKER.md                      # Guía Docker
│   └── INSTRUCCIONES_MYSQL.md         # Guía MySQL
│
├── docker-compose.yml                 # Orquestación principal
├── docker-compose.dev.yml             # Config desarrollo
├── Makefile                           # Comandos útiles
├── start.bat                          # Inicio Windows
├── start.sh                           # Inicio Linux/Mac
└── README.md                          # Este archivo
```

---

## 📚 Endpoints de la API

### Estudiantes

```http
GET    /api/estudiantes              # Listar todos (paginado)
GET    /api/estudiantes/{id}         # Obtener por ID
POST   /api/estudiantes              # Crear nuevo
PUT    /api/estudiantes/{id}         # Actualizar
DELETE /api/estudiantes/{id}         # Eliminar
GET    /api/estudiantes/{id}/companeros  # Ver compañeros
```

### Materias

```http
GET    /api/materias                 # Listar todas
GET    /api/materias/{id}            # Obtener por ID
```

### Profesores

```http
GET    /api/profesores               # Listar todos
GET    /api/profesores/{id}          # Obtener por ID
```

**Ver documentación completa en:** http://localhost:5096/swagger

---

## 🐳 Comandos Docker

### Básicos

```bash
# Iniciar todo
docker-compose up -d
make up

# Detener todo
docker-compose down
make down

# Ver estado
docker-compose ps
make status

# Ver logs
docker-compose logs -f
make logs
```

### Gestión

```bash
# Reiniciar servicios
docker-compose restart
make restart

# Reconstruir imágenes
docker-compose build --no-cache
make build-no-cache

# Limpiar todo (ELIMINA DATOS)
docker-compose down -v
make clean
```

### Acceso

```bash
# Shell en contenedores
docker-compose exec api /bin/bash
docker-compose exec mysql bash

# MySQL directo
docker-compose exec mysql mysql -uadmin -pAdmin123! RegistroEstudiantesDB
make shell-mysql
```

### Backup

```bash
# Crear backup
docker-compose exec -T mysql mysqldump -uadmin -pAdmin123! RegistroEstudiantesDB > backup.sql
make backup-db

# Restaurar backup
docker-compose exec -T mysql mysql -uadmin -pAdmin123! RegistroEstudiantesDB < backup.sql
make restore-db FILE=backup.sql
```

**Ver más comandos:** [docs/DOCKER.md](docs/DOCKER.md) o ejecutar `make help`

---

## 💾 Base de Datos

### Estructura

```sql
profesores        (5 profesores)
├── id
├── nombre
└── apellido

materias          (10 materias, 3 créditos c/u)
├── id
├── nombre
├── creditos      (siempre 3)
└── profesor_id   (2 materias por profesor)

estudiantes
├── id
├── nombre
├── apellido
└── email         (único)

inscripciones     (relación N:M)
├── id
├── estudiante_id
└── materia_id
```

### Datos Iniciales

El script `scripts/01-init-mysql.sql` crea automáticamente:

**5 Profesores:**
1. Carlos Rodriguez
2. Maria Garcia
3. Juan Martinez
4. Ana Lopez
5. Pedro Sanchez

**10 Materias (2 por profesor):**
- Matemáticas I y II (Carlos Rodriguez)
- Programación I y II (Maria Garcia)
- Base de Datos I y II (Juan Martinez)
- Redes I y II (Ana Lopez)
- Sistemas Operativos y Arquitectura de Computadores (Pedro Sanchez)

---

## 🛠️ Desarrollo

### Ejecutar en modo desarrollo (con Docker)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
make up-dev
```

Esto habilita:
- Logs verbosos
- Hot reload (cuando esté configurado)
- Debugging habilitado

### Ejecutar tests

**Backend:**
```bash
cd RegistroEstudiantes.API
dotnet test
```

**Frontend:**
```bash
cd RegistroEstudiantes.Web
npm test
```

### Ver logs en desarrollo

```bash
# Todos los logs
docker-compose logs -f

# Solo API
docker-compose logs -f api
make logs-api

# Solo MySQL
docker-compose logs -f mysql
make logs-mysql
```

---

## 🔧 Solución de Problemas

### Puerto ya en uso

**Windows:**
```cmd
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :4200
kill -9 <PID>
```

### Contenedores no inician

```bash
# Ver logs de error
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose up -d
```

### Error de conexión a MySQL

```bash
# Verificar que MySQL esté healthy
docker-compose ps mysql

# Reiniciar MySQL
docker-compose restart mysql
```

### Limpiar y empezar de nuevo

```bash
# CUIDADO: Esto elimina TODOS los datos
docker-compose down -v
docker-compose up -d
```

---

## 📖 Documentación Adicional

- **[Docker](docs/DOCKER.md)** - Guía completa de Docker
- **[MySQL](docs/INSTRUCCIONES_MYSQL.md)** - Configuración y queries MySQL
- **[Makefile](Makefile)** - Ver todos los comandos disponibles (`make help`)

---

## 🎯 Características Técnicas

### Backend
- ✅ API REST con .NET 10
- ✅ Entity Framework Core ORM
- ✅ Validaciones de negocio robustas
- ✅ DTOs para transfer de datos
- ✅ Paginación en listados
- ✅ Health checks
- ✅ Swagger/OpenAPI
- ✅ CORS configurado
- ✅ Manejo de errores centralizado

### Frontend
- ✅ Angular 21 standalone components
- ✅ Reactive Forms
- ✅ RxJS para programación reactiva
- ✅ Interceptors HTTP
- ✅ Change Detection optimizado
- ✅ Routing configurado
- ✅ Bootstrap 5
- ✅ Responsive design

### DevOps
- ✅ Docker multi-stage builds
- ✅ Docker Compose orquestación
- ✅ Health checks automáticos
- ✅ Volúmenes persistentes
- ✅ Red bridge dedicada
- ✅ Scripts de automatización
- ✅ Nginx optimizado
- ✅ Makefile con +20 comandos

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👤 Autor

Desarrollado como prueba técnica de aplicación web.

---

## 🙏 Agradecimientos

- .NET Team por el excelente framework
- Angular Team por el framework frontend
- Docker por la containerización
- MySQL por la base de datos

---

**Estado del Proyecto:** ✅ Producción

**Última Actualización:** Enero 2026
