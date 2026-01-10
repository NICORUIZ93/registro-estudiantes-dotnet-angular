using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RegistroEstudiantes.API.Data;
using RegistroEstudiantes.API.DTOs;

namespace RegistroEstudiantes.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfesoresController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProfesoresController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProfesorDto>>> GetProfesores()
    {
        // Cargamos profesores + materias desde la BD y luego mapeamos en memoria
        var profesoresDb = await _context.Profesores
            .Include(p => p.Materias)
            .ToListAsync();

        var profesores = profesoresDb
            .Select(p => new ProfesorDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Apellido = p.Apellido,
                Materias = p.Materias.Select(m => new MateriaDto
                {
                    Id = m.Id,
                    Nombre = m.Nombre,
                    Creditos = m.Creditos,
                    ProfesorId = m.ProfesorId,
                    ProfesorNombre = $"{p.Nombre} {p.Apellido}"
                }).ToList()
            })
            .ToList();

        return Ok(profesores);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProfesorDto>> GetProfesor(int id)
    {
        var profesorDb = await _context.Profesores
            .Include(p => p.Materias)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (profesorDb == null)
        {
            return NotFound(new { message = "Profesor no encontrado" });
        }

        var profesor = new ProfesorDto
        {
            Id = profesorDb.Id,
            Nombre = profesorDb.Nombre,
            Apellido = profesorDb.Apellido,
            Materias = profesorDb.Materias.Select(m => new MateriaDto
            {
                Id = m.Id,
                Nombre = m.Nombre,
                Creditos = m.Creditos,
                ProfesorId = m.ProfesorId,
                ProfesorNombre = $"{profesorDb.Nombre} {profesorDb.Apellido}"
            }).ToList()
        };

        return Ok(profesor);
    }
}
