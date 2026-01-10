
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["RegistroEstudiantes.API.csproj", "./"]
RUN dotnet restore "RegistroEstudiantes.API.csproj"

COPY . .
RUN dotnet build "RegistroEstudiantes.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RegistroEstudiantes.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

EXPOSE 8080
EXPOSE 8081

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "RegistroEstudiantes.API.dll"]
