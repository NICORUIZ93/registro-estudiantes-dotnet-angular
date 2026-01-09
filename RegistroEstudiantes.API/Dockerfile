# ==========================================
# Dockerfile para Backend .NET API
# ==========================================

# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copiar archivo de proyecto y restaurar dependencias
COPY ["RegistroEstudiantes.API.csproj", "./"]
RUN dotnet restore "RegistroEstudiantes.API.csproj"

# Copiar el resto de los archivos y compilar
COPY . .
RUN dotnet build "RegistroEstudiantes.API.csproj" -c Release -o /app/build

# Etapa 2: Publish
FROM build AS publish
RUN dotnet publish "RegistroEstudiantes.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etapa 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Instalar herramientas de diagnóstico (opcional)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copiar archivos publicados
COPY --from=publish /app/publish .

# Exponer puerto
EXPOSE 8080
EXPOSE 8081

# Variables de entorno
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Punto de entrada
ENTRYPOINT ["dotnet", "RegistroEstudiantes.API.dll"]
