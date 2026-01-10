# ==========================================
# Dockerfile para Frontend Angular
# ==========================================

# Etapa 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Compilar la aplicación para producción
RUN npm run build -- --configuration production

# Etapa 2: Runtime con Nginx
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Copiar archivos compilados (coincidir con la ruta generada por Angular)
COPY --from=build /app/dist/RegistroEstudiantes.Web/browser /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
