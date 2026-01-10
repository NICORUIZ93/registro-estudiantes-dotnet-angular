using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using RegistroEstudiantes.API.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Servicios básicos
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Base de datos
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    // Detectar si es PostgreSQL o MySQL por la cadena de conexión
    if (connectionString?.Contains("Server=") == true || connectionString?.Contains("Host=") == true)
    {
        // Intentar MySQL primero
        if (connectionString.Contains("Server=") || connectionString.Contains("Port=3306"))
        {
            // MySQL
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 0));
            options.UseMySql(connectionString, serverVersion);
        }
        else
        {
            // PostgreSQL
            options.UseNpgsql(connectionString);
        }
    }
    else
    {
        throw new InvalidOperationException("Cadena de conexión no configurada correctamente");
    }
});

// 3. Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("database");

// 4. Autenticación JWT (opcional)
var jwtKey = builder.Configuration["Jwt:Key"];
if (!string.IsNullOrEmpty(jwtKey))
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });
}

// 5. CORS
var corsOrigins = builder.Configuration["CORS:Origins"]?.Split(',') ?? new[]
{
    "http://localhost:4200",
    "https://localhost:4200",
    "http://localhost",
    "http://frontend"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// 6. Pipeline
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 7. Health Check endpoint
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = System.Text.Json.JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description,
                duration = e.Value.Duration.ToString()
            }),
            totalDuration = report.TotalDuration.ToString()
        });
        await context.Response.WriteAsync(result);
    }
});

app.UseCors("AllowAngular");

if (!string.IsNullOrEmpty(jwtKey))
{
    app.UseAuthentication();
}

app.UseAuthorization();
app.MapControllers();

app.Run();