# RegistroEstudiantes

Aplicacion fullstack para registro academico de estudiantes con reglas de inscripcion y validaciones de negocio.

## Resumen
Este proyecto cumple una prueba tecnica de aplicacion web cliente-servidor para gestionar estudiantes, materias y profesores.

Incluye:
- API REST en .NET 10.
- Frontend en Angular 21.
- Base de datos MySQL 8.
- Orquestacion completa con Docker Compose.

## Requisitos de la prueba
- CRUD de estudiantes.
- Programa de creditos.
- 10 materias totales.
- 3 creditos por materia.
- Cada estudiante debe seleccionar exactamente 3 materias.
- 5 profesores, 2 materias por profesor.
- El estudiante no puede inscribir dos materias con el mismo profesor.
- Ver registros de otros estudiantes en linea.
- Ver nombres de companeros por cada materia.
- Entregar aplicacion y script SQL.

## Estado de cumplimiento
- CRUD estudiantes: implementado en API y UI.
- Reglas de seleccion de materias: implementadas en backend y frontend.
- Visualizacion de companeros por materia: implementada.
- Script SQL de creacion y datos semilla: incluido.

## Stack tecnico
- Backend: ASP.NET Core Web API (.NET 10), Entity Framework Core.
- Frontend: Angular 21, TypeScript, Bootstrap 5.
- Base de datos: MySQL 8.
- Infraestructura: Docker, Docker Compose, Nginx.

## Estructura del proyecto
```text
RegistroEstudiantes/
|-- RegistroEstudiantes.API/
|-- RegistroEstudiantes.Web/
|-- scripts/
|   `-- 01-init-mysql.sql
|-- docs/
|-- docker-compose.yml
|-- docker-compose.dev.yml
|-- start.bat
`-- start.sh
```

## Ejecucion rapida con Docker
Desde la raiz del proyecto:

```bash
docker-compose up -d --build
```

Si usas Compose v2:

```bash
docker compose up -d --build
```

### URLs de acceso
- Frontend: `http://localhost:4200`
- API base: `http://localhost:5096/api`
- Swagger: `http://localhost:5096/swagger`
- Health check API: `http://localhost:5096/health`
- phpMyAdmin: `http://localhost:8081`
- MySQL: `localhost:3306`

### Credenciales por defecto
- MySQL
  - Usuario: `admin`
  - Password: `Admin123!`
  - Base de datos: `RegistroEstudiantesDB`
- phpMyAdmin
  - Servidor: `mysql`
  - Usuario: `admin`
  - Password: `Admin123!`

## Endpoints principales
### Estudiantes
- `GET /api/estudiantes`
- `GET /api/estudiantes/{id}`
- `POST /api/estudiantes`
- `PUT /api/estudiantes/{id}`
- `DELETE /api/estudiantes/{id}`
- `GET /api/estudiantes/{id}/companeros`

### Catalogos
- `GET /api/materias`
- `GET /api/materias/{id}`
- `GET /api/profesores`
- `GET /api/profesores/{id}`

## Desarrollo local (sin Docker)
### Requisitos
- .NET 10 SDK
- Node.js 20+
- MySQL 8

### 1) Base de datos
```bash
mysql -u root -p < scripts/01-init-mysql.sql
```

### 2) API
```bash
cd RegistroEstudiantes.API
dotnet restore
dotnet run
```

### 3) Frontend
```bash
cd RegistroEstudiantes.Web
npm install
npm run start
```

## Operacion y mantenimiento
```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volumenes
docker-compose down -v
```

## Base de datos y script entregable
El archivo `scripts/01-init-mysql.sql` incluye:
- Creacion de tablas y relaciones.
- Indices.
- Datos semilla: 5 profesores y 10 materias.
- Vistas y procedimientos para validaciones y consultas.

## Observaciones
- El build del frontend puede mostrar warnings de budget de Angular; no bloquean despliegue.
- Si cambias puertos o credenciales, actualiza `.env` y `docker-compose.yml`.
