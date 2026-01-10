# Estructura del Proyecto - Registro de Estudiantes

## 📁 Archivos y Carpetas Principales

```
RegistroEstudiantes/
│
├── 📄 README.md                      ⭐ INICIO AQUÍ - Guía principal
├── 📄 ESTRUCTURA.md                  📋 Este archivo - Mapa del proyecto
│
├── 🐳 Docker & Scripts
│   ├── docker-compose.yml            Orquestación de servicios
│   ├── docker-compose.dev.yml        Configuración de desarrollo
│   ├── Makefile                      Comandos útiles (make help)
│   ├── start.bat                     Inicio automático (Windows)
│   ├── start.sh                      Inicio automático (Linux/Mac)
│   ├── .dockerignore                 Exclusiones para Docker
│   ├── .env                          Variables de entorno (NO SUBIR A GIT)
│   └── .env.example                  Plantilla de variables
│
├── 📁 RegistroEstudiantes.API/       Backend .NET
│   ├── Controllers/                  Endpoints REST
│   ├── Models/                       Entidades de dominio
│   ├── DTOs/                         Data Transfer Objects
│   ├── Data/                         DbContext
│   ├── Program.cs                    Punto de entrada
│   ├── Dockerfile                    Imagen Docker del backend
│   └── .dockerignore                 Exclusiones Docker
│
├── 📁 RegistroEstudiantes.Web/       Frontend Angular
│   ├── src/app/
│   │   ├── components/               Componentes UI
│   │   ├── services/                 Servicios HTTP
│   │   └── models/                   Interfaces TypeScript
│   ├── Dockerfile                    Imagen Docker del frontend
│   ├── nginx.conf                    Configuración Nginx
│   └── .dockerignore                 Exclusiones Docker
│
├── 📁 scripts/                       Scripts de base de datos
│   └── 01-init-mysql.sql            ⚙️ Inicialización MySQL
│
├── 📁 docs/                          Documentación adicional
│   ├── DOCKER.md                     Guía completa Docker
│   └── INSTRUCCIONES_MYSQL.md        Guía MySQL detallada
│
└── 📁 .claude/                       Configuración de Claude Code
```

---

## 📖 Guía de Documentación

### Para Empezar

1. **README.md** ⭐
   - Primera lectura obligatoria
   - Instalación y configuración
   - Comandos básicos
   - URLs de acceso
   - Solución de problemas

### Para Usar Docker

2. **docs/DOCKER.md**
   - Guía completa de Docker
   - Todos los comandos disponibles
   - Backup y restauración
   - Troubleshooting avanzado

3. **Makefile**
   - Ejecuta `make help` para ver comandos
   - Atajos útiles para Docker

### Para Trabajar con la Base de Datos

4. **docs/INSTRUCCIONES_MYSQL.md**
   - Configuración MySQL
   - Procedimientos almacenados
   - Consultas útiles
   - Estructura detallada

5. **scripts/01-init-mysql.sql**
   - Script de creación de BD
   - Datos iniciales
   - Se ejecuta automáticamente con Docker

---

## 🚀 Comandos de Inicio Rápido

```bash
# Ver este archivo
cat ESTRUCTURA.md

# Leer la guía principal
cat README.md

# Iniciar el proyecto
./start.sh          # Linux/Mac
start.bat           # Windows

# Ver todos los comandos disponibles
make help

# Acceder a la aplicación
http://localhost:4200
```

---

## 🗂️ Archivos Importantes por Función

### Configuración del Proyecto

| Archivo | Propósito |
|---------|-----------|
| `.env` | Variables de entorno (credenciales BD, etc.) |
| `.env.example` | Plantilla para crear .env |
| `.gitignore` | Archivos excluidos de Git |
| `RegistroEstudiantes.slnx` | Solución Visual Studio |

### Docker

| Archivo | Propósito |
|---------|-----------|
| `docker-compose.yml` | Configuración principal de servicios |
| `docker-compose.dev.yml` | Sobrescribe config para desarrollo |
| `Makefile` | Comandos abreviados (make up, make down) |
| `start.bat/sh` | Scripts de inicio automático |
| `.dockerignore` | Exclusiones para contexto Docker |

### Backend (.NET)

| Archivo/Carpeta | Propósito |
|-----------------|-----------|
| `Controllers/` | Endpoints REST de la API |
| `Models/` | Clases de entidad (Estudiante, Materia, etc.) |
| `DTOs/` | Objetos de transferencia de datos |
| `Data/ApplicationDbContext.cs` | Configuración Entity Framework |
| `Program.cs` | Configuración de la aplicación |
| `Dockerfile` | Imagen Docker del backend |

### Frontend (Angular)

| Archivo/Carpeta | Propósito |
|-----------------|-----------|
| `src/app/components/` | Componentes de UI |
| `src/app/services/` | Servicios para llamar a la API |
| `src/app/models/` | Interfaces TypeScript |
| `nginx.conf` | Configuración del servidor web |
| `Dockerfile` | Imagen Docker del frontend |

### Base de Datos

| Archivo | Propósito |
|---------|-----------|
| `scripts/01-init-mysql.sql` | Creación de tablas y datos iniciales |
| `docs/INSTRUCCIONES_MYSQL.md` | Documentación MySQL |

---

## 🎯 Flujos de Trabajo Comunes

### 1. Iniciar el Proyecto por Primera Vez

```bash
1. Leer README.md
2. Ejecutar start.bat o ./start.sh
3. Esperar 30 segundos
4. Abrir http://localhost:4200
```

### 2. Hacer Cambios en el Código

```bash
# Si NO usas Docker:
cd RegistroEstudiantes.API && dotnet run    # Backend
cd RegistroEstudiantes.Web && ng serve      # Frontend

# Si usas Docker:
docker-compose restart api       # Reiniciar backend
docker-compose restart frontend  # Reiniciar frontend

# O reconstruir:
docker-compose build api
docker-compose up -d
```

### 3. Ver Logs

```bash
make logs           # Todos los servicios
make logs-api       # Solo backend
make logs-mysql     # Solo base de datos
```

### 4. Backup de Base de Datos

```bash
make backup-db                    # Crea backup.sql
make restore-db FILE=backup.sql   # Restaura desde backup
```

### 5. Limpiar y Empezar de Nuevo

```bash
docker-compose down -v   # Elimina TODO (incluye datos)
docker-compose up -d     # Reinicia desde cero
```

---

## ❓ ¿Qué Archivo Necesito?

### Quiero...

- **Instalar el proyecto** → `README.md`
- **Usar Docker** → `docs/DOCKER.md` + `Makefile`
- **Ver la base de datos** → `docs/INSTRUCCIONES_MYSQL.md`
- **Entender la estructura** → Este archivo (`ESTRUCTURA.md`)
- **Configurar variables** → `.env` (basado en `.env.example`)
- **Ver comandos disponibles** → `make help` en terminal
- **Modificar el backend** → `RegistroEstudiantes.API/`
- **Modificar el frontend** → `RegistroEstudiantes.Web/src/app/`
- **Cambiar la BD** → `scripts/01-init-mysql.sql`

---

## 🔍 Archivos que NO Debes Modificar (Sin Razón)

- `.dockerignore` (optimización de builds)
- `nginx.conf` (configuración del servidor web)
- Archivos en `node_modules/`, `bin/`, `obj/`
- `.env` (NO subir a Git, contiene credenciales)

---

## 📝 Notas Finales

- **Siempre lee `README.md` primero**
- El proyecto está completamente dockerizado
- Usa `make help` para ver comandos disponibles
- Los archivos en `docs/` son referencias adicionales
- `.env` NO se sube a Git (está en .gitignore)

---

**¿Dudas?** Consulta `README.md` o ejecuta `make help`
