using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RegistroEstudiantes.API.Data;
using RegistroEstudiantes.API.DTOs;
using RegistroEstudiantes.API.Models;
using BCrypt.Net;

namespace RegistroEstudiantes.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "El email ya está registrado" });
        }

        if (await _context.Usuarios.AnyAsync(u => u.Username == dto.Username))
        {
            return BadRequest(new { message = "El nombre de usuario ya existe" });
        }

        var usuario = new Usuario
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(usuario);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Username = usuario.Username,
            Email = usuario.Email
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
        {
            return Unauthorized(new { message = "Email o contraseña incorrectos" });
        }

        var token = GenerateJwtToken(usuario);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Username = usuario.Username,
            Email = usuario.Email
        });
    }

    private string GenerateJwtToken(Usuario usuario)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key not configured");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "RegistroEstudiantesAPI";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "RegistroEstudiantesWeb";

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Username),
            new Claim(ClaimTypes.Email, usuario.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
