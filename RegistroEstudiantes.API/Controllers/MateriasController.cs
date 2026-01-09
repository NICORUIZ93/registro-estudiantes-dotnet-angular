using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RegistroEstudiantes.API.Data;
using RegistroEstudiantes.API.DTOs;

namespace RegistroEstudiantes.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MateriasController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MateriasController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MateriaDto>>> GetMaterias()
    {
        var materias = await _context.Materias
            .Include(m => m.Profesor)
            .Select(m => new MateriaDto
            {
                Id = m.Id,
                Nombre = m.Nombre,
                Creditos = m.Creditos,
                ProfesorId = m.ProfesorId,
                ProfesorNombre = $"{m.Profesor.Nombre} {m.Profesor.Apellido}"
            })
            .ToListAsync();

        return Ok(materias);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MateriaDto>> GetMateria(int id)
    {
        var materia = await _context.Materias
            .Include(m => m.Profesor)
            .Where(m => m.Id == id)
            .Select(m => new MateriaDto
            {
                Id = m.Id,
                Nombre = m.Nombre,
                Creditos = m.Creditos,
                ProfesorId = m.ProfesorId,
                ProfesorNombre = $"{m.Profesor.Nombre} {m.Profesor.Apellido}"
            })
            .FirstOrDefaultAsync();

        if (materia == null)
        {
            return NotFound(new { message = "Materia no encontrada" });
        }

        return Ok(materia);
    }
}
