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
        var profesores = await _context.Profesores
            .Include(p => p.Materias)
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
            .ToListAsync();

        return Ok(profesores);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProfesorDto>> GetProfesor(int id)
    {
        var profesor = await _context.Profesores
            .Include(p => p.Materias)
            .Where(p => p.Id == id)
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
            .FirstOrDefaultAsync();

        if (profesor == null)
        {
            return NotFound(new { message = "Profesor no encontrado" });
        }

        return Ok(profesor);
    }
}
