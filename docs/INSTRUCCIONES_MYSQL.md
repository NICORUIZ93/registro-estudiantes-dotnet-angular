# Configuración con MySQL

Este proyecto ahora está configurado para usar **MySQL 8.0** como base de datos, cumpliendo con el requisito de la prueba técnica.

## Requisitos

- Docker Desktop instalado y ejecutándose
- .NET 10 SDK
- Node.js 18+ y npm

## Inicio Rápido con MySQL

### 1. Levantar la Base de Datos MySQL

```bash
# Desde el directorio raíz del proyecto
docker-compose up -d
```

Esto iniciará:
- **MySQL 8.0** en el puerto `3306`
- **phpMyAdmin** en el puerto `8080`

### 2. Verificar que los contenedores estén corriendo

```bash
docker-compose ps
```

Deberías ver:
- `registro_estudiantes_db` (MySQL)
- `registro_estudiantes_phpmyadmin` (phpMyAdmin)

### 3. Acceder a phpMyAdmin

- URL: `http://localhost:8080`
- Usuario: `admin`
- Contraseña: `Admin123!`

### 4. Configurar el Backend para MySQL

Actualizar el archivo `RegistroEstudiantes.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=RegistroEstudiantesDB;User=admin;Password=Admin123!;"
  }
}
```

**NOTA IMPORTANTE**: Para que el backend .NET funcione con MySQL, necesitas instalar el paquete NuGet correspondiente:

```bash
cd RegistroEstudiantes.API
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.0
```

Y actualizar `Program.cs` para usar MySQL:

```csharp
// Cambiar de:
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// A:
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
```

### 5. Iniciar el Backend

```bash
cd RegistroEstudiantes.API
dotnet restore
dotnet run
```

La API estará disponible en:
- HTTP: `http://localhost:5096`
- Swagger: `http://localhost:5096/swagger`

### 6. Iniciar el Frontend

```bash
cd RegistroEstudiantes.Web
npm install
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

## Script de Base de Datos

El script `scripts/01-init-mysql.sql` incluye:

✅ Creación de todas las tablas
✅ 5 Profesores (Carlos Rodriguez, Maria Garcia, Juan Martinez, Ana Lopez, Pedro Sanchez)
✅ 10 Materias (2 por profesor, todas con 3 créditos)
✅ Relaciones y constraints (Foreign Keys, Unique, Cascadas)
✅ Índices para optimización
✅ Vistas útiles
✅ Procedimientos almacenados para validaciones

## Estructura de Tablas

```
profesores
├── id (AUTO_INCREMENT PRIMARY KEY)
├── nombre VARCHAR(100)
├── apellido VARCHAR(100)
└── created_at TIMESTAMP

materias
├── id (AUTO_INCREMENT PRIMARY KEY)
├── nombre VARCHAR(100)
├── creditos INT (DEFAULT 3)
├── profesor_id INT (FK -> profesores)
└── created_at TIMESTAMP

estudiantes
├── id (AUTO_INCREMENT PRIMARY KEY)
├── nombre VARCHAR(100)
├── apellido VARCHAR(100)
├── email VARCHAR(150) UNIQUE
└── created_at TIMESTAMP

inscripciones
├── id (AUTO_INCREMENT PRIMARY KEY)
├── estudiante_id INT (FK -> estudiantes)
├── materia_id INT (FK -> materias)
├── fecha_inscripcion TIMESTAMP
└── UNIQUE(estudiante_id, materia_id)
```

## Comandos Útiles

### Ver logs de Docker

```bash
docker-compose logs -f mysql
```

### Conectarse a MySQL desde línea de comandos

```bash
docker exec -it registro_estudiantes_db mysql -uadmin -pAdmin123! RegistroEstudiantesDB
```

### Detener los servicios

```bash
docker-compose down
```

### Reiniciar desde cero (elimina datos)

```bash
docker-compose down -v
docker-compose up -d
```

## Validaciones Implementadas en la Base de Datos

1. **Email único** por estudiante (UNIQUE constraint)
2. **Máximo 3 materias** por estudiante (validado en backend)
3. **No repetir profesor** (validado en backend y en procedimiento almacenado)
4. **Integridad referencial** con Foreign Keys
5. **Cascada en eliminaciones** de estudiantes (elimina inscripciones automáticamente)

## Procedimientos Almacenados

### sp_inscribir_estudiante
Inscribe a un estudiante validando:
- No más de 3 materias
- No repetir profesor

```sql
CALL sp_inscribir_estudiante(1, 3);
```

### sp_obtener_companeros
Obtiene los compañeros de un estudiante por materia:

```sql
CALL sp_obtener_companeros(1);
```

## Consultas de Verificación

```sql
-- Ver todos los profesores
SELECT * FROM profesores;

-- Ver materias con profesores
SELECT
    m.nombre AS materia,
    m.creditos,
    CONCAT(p.nombre, ' ', p.apellido) AS profesor
FROM materias m
INNER JOIN profesores p ON m.profesor_id = p.id;

-- Ver estudiantes con sus materias
SELECT * FROM vista_estudiantes_materias;
```

## Solución de Problemas

### Error: "Can't connect to MySQL server"
- Verificar que Docker esté corriendo
- Verificar que el contenedor MySQL esté activo: `docker-compose ps`

### Error: "Access denied for user"
- Verificar las credenciales en `.env`
- Verificar la cadena de conexión en `appsettings.json`

### El script no se ejecuta al iniciar
- Eliminar el volumen y volver a crear: `docker-compose down -v && docker-compose up -d`

## Datos de Acceso

### MySQL
- Host: `localhost`
- Puerto: `3306`
- Base de datos: `RegistroEstudiantesDB`
- Usuario: `admin`
- Contraseña: `Admin123!`

### phpMyAdmin
- URL: `http://localhost:8080`
- Usuario: `admin`
- Contraseña: `Admin123!`

---

**Nota**: Este proyecto cumple con el requisito de la prueba técnica: "Base de datos o scripts para su creación en MySql / SQL"
