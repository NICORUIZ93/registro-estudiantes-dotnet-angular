# RegistroEstudiantes

Aplicacion fullstack para gestion de estudiantes con reglas academicas de inscripcion.

## Objetivo de la prueba tecnica
Construir una aplicacion web cliente-servidor que permita:
- CRUD de estudiantes.
- Inscripcion de cada estudiante a un programa de creditos.
- 10 materias totales, 3 creditos por materia.
- Cada estudiante debe seleccionar exactamente 3 materias.
- 5 profesores, 2 materias por profesor.
- Un estudiante no puede tomar dos materias con el mismo profesor.
- Visualizar estudiantes registrados y companeros por materia.
- Entregar aplicacion web y script SQL para creacion de base de datos.

## Stack
- Backend: .NET 10 Web API + Entity Framework Core
- Frontend: Angular 21 + Bootstrap 5
- Base de datos: MySQL 8
- Infra: Docker + Docker Compose + Nginx

## Estructura del repositorio
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

## Reglas de negocio implementadas
- Estudiante con email unico.
- Seleccion obligatoria de exactamente 3 materias.
- Materias seleccionadas deben pertenecer a profesores distintos.
- Total esperado por estudiante: 9 creditos.
- Consulta de companeros por cada materia del estudiante.

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

Swagger: `http://localhost:5096/swagger`

## Levantar con Docker (recomendado)
Desde la carpeta raiz `RegistroEstudiantes`:

```bash
docker-compose up -d --build
```

Si tu entorno usa Compose v2 tambien funciona:

```bash
docker compose up -d --build
```

### URLs
- Frontend: `http://localhost:4200`
- API: `http://localhost:5096/api`
- Swagger: `http://localhost:5096/swagger`
- Health API: `http://localhost:5096/health`
- phpMyAdmin: `http://localhost:8081`
- MySQL: `localhost:3306`

### Credenciales por defecto
- MySQL
  - Usuario: `admin`
  - Password: `Admin123!`
  - DB: `RegistroEstudiantesDB`
- phpMyAdmin
  - Servidor: `mysql`
  - Usuario: `admin`
  - Password: `Admin123!`

## Desarrollo local (sin Docker)
### Requisitos
- .NET 10 SDK
- Node.js 20+
- MySQL 8

### 1) Base de datos
Ejecutar script:

```bash
mysql -u root -p < scripts/01-init-mysql.sql
```

### 2) Backend
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

## Comandos utiles
```bash
# estado
docker-compose ps

# logs
docker-compose logs -f

# detener
docker-compose down

# detener y borrar volumenes
docker-compose down -v
```

## Estado actual del CRUD
- Create: implementado en API y UI.
- Read: listado y detalle implementados.
- Update: implementado en API y UI (incluye actualizacion de materias con validaciones).
- Delete: implementado en API y UI.

## Archivo SQL entregable
El script `scripts/01-init-mysql.sql` incluye:
- Creacion de tablas.
- Relaciones e indices.
- Datos semilla (5 profesores y 10 materias).
- Vistas y procedimientos almacenados para validaciones y consultas de companeros.

## Notas
- El frontend tiene warnings de budget en build de Angular; no bloquean el despliegue.
- Si cambias puertos o credenciales, actualiza `.env` y `docker-compose.yml`.
