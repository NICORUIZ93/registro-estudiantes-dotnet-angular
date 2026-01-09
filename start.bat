@echo off
REM ==========================================
REM Script de inicio para Windows
REM ==========================================

echo.
echo ==========================================
echo   REGISTRO DE ESTUDIANTES
echo   Sistema de Gestion Academica
echo ==========================================
echo.

REM Verificar Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta instalado
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta ejecutandose
    pause
    exit /b 1
)

echo [OK] Docker esta disponible

REM Verificar Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose no esta instalado
    pause
    exit /b 1
)

echo [OK] Docker Compose esta disponible

REM Verificar archivo .env
if not exist .env (
    echo [ADVERTENCIA] Archivo .env no encontrado
    echo Copiando desde .env.example...
    copy .env.example .env
    echo Por favor, edita el archivo .env con tus configuraciones
    pause
)

echo [OK] Archivo .env encontrado

REM Limpiar contenedores anteriores
echo.
echo Deteniendo contenedores anteriores...
docker-compose down 2>nul

REM Construir imagenes
echo.
echo Construyendo imagenes...
docker-compose build --parallel

REM Levantar servicios
echo.
echo Levantando servicios...
docker-compose up -d

REM Esperar a que los servicios esten listos
echo.
echo Esperando a que los servicios esten listos...
timeout /t 10 /nobreak >nul

REM Verificar estado
echo.
echo Estado de los servicios:
docker-compose ps

REM Mostrar informacion
echo.
echo ==========================================
echo   SERVICIOS INICIADOS CORRECTAMENTE
echo ==========================================
echo.
echo MySQL:          localhost:3306
echo Backend API:    http://localhost:5096
echo Frontend:       http://localhost:4200
echo phpMyAdmin:     http://localhost:8080
echo Swagger:        http://localhost:5096/swagger
echo.
echo Credenciales MySQL:
echo   Usuario: admin
echo   Password: Admin123!
echo   Base de datos: RegistroEstudiantesDB
echo.
echo Para ver logs: docker-compose logs -f
echo Para detener: docker-compose down
echo.
pause
