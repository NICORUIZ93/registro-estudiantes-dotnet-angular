using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RegistroEstudiantes.API.Data;
using RegistroEstudiantes.API.DTOs;
using RegistroEstudiantes.API.Models;

namespace RegistroEstudiantes.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstudiantesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public EstudiantesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponseDto<EstudianteResponseDto>>> GetEstudiantes(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        var totalItems = await _context.Estudiantes.CountAsync();

        var estudiantes = await _context.Estudiantes
            .Include(e => e.Inscripciones)
                .ThenInclude(i => i.Materia)
                    .ThenInclude(m => m.Profesor)
            .OrderBy(e => e.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => new EstudianteResponseDto
            {
                Id = e.Id,
                Nombre = e.Nombre,
                Apellido = e.Apellido,
                Email = e.Email,
                CreatedAt = e.CreatedAt,
                TotalCreditos = e.Inscripciones.Sum(i => i.Materia.Creditos),
                Materias = e.Inscripciones.Select(i => new MateriaInscritaDto
                {
                    Id = i.Materia.Id,
                    Nombre = i.Materia.Nombre,
                    Creditos = i.Materia.Creditos,
                    ProfesorNombre = $"{i.Materia.Profesor.Nombre} {i.Materia.Profesor.Apellido}"
                }).ToList()
            })
            .ToListAsync();

        var response = new PaginatedResponseDto<EstudianteResponseDto>
        {
            Items = estudiantes,
            TotalItems = totalItems,
            Page = page,
            PageSize = pageSize
        };

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EstudianteResponseDto>> GetEstudiante(int id)
    {
        var estudiante = await _context.Estudiantes
            .Include(e => e.Inscripciones)
                .ThenInclude(i => i.Materia)
                    .ThenInclude(m => m.Profesor)
            .Where(e => e.Id == id)
            .Select(e => new EstudianteResponseDto
            {
                Id = e.Id,
                Nombre = e.Nombre,
                Apellido = e.Apellido,
                Email = e.Email,
                CreatedAt = e.CreatedAt,
                TotalCreditos = e.Inscripciones.Sum(i => i.Materia.Creditos),
                Materias = e.Inscripciones.Select(i => new MateriaInscritaDto
                {
                    Id = i.Materia.Id,
                    Nombre = i.Materia.Nombre,
                    Creditos = i.Materia.Creditos,
                    ProfesorNombre = $"{i.Materia.Profesor.Nombre} {i.Materia.Profesor.Apellido}"
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (estudiante == null)
        {
            return NotFound(new { message = "Estudiante no encontrado" });
        }

        return Ok(estudiante);
    }

    [HttpPost]
    public async Task<ActionResult<EstudianteResponseDto>> CreateEstudiante(CrearEstudianteDto dto)
    {
        if (await _context.Estudiantes.AnyAsync(e => e.Email == dto.Email))
        {
            return BadRequest(new { message = "Ya existe un estudiante con ese email" });
        }

        if (dto.MateriasIds.Count != 3)
        {
            return BadRequest(new { message = "Debe seleccionar exactamente 3 materias" });
        }

        var materias = await _context.Materias
            .Include(m => m.Profesor)
            .Where(m => dto.MateriasIds.Contains(m.Id))
            .ToListAsync();

        if (materias.Count != 3)
        {
            return BadRequest(new { message = "Una o mas materias no existen" });
        }

        var profesoresIds = materias.Select(m => m.ProfesorId).ToList();
        if (profesoresIds.Distinct().Count() != 3)
        {
            return BadRequest(new { message = "No puede seleccionar materias del mismo profesor. Cada materia debe ser de un profesor diferente." });
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var estudiante = new Estudiante
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Email = dto.Email
            };

            _context.Estudiantes.Add(estudiante);
            await _context.SaveChangesAsync();

            foreach (var materiaId in dto.MateriasIds)
            {
                var inscripcion = new Inscripcion
                {
                    EstudianteId = estudiante.Id,
                    MateriaId = materiaId
                };
                _context.Inscripciones.Add(inscripcion);
            }
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return CreatedAtAction(nameof(GetEstudiante), new { id = estudiante.Id }, await GetEstudiante(estudiante.Id));
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEstudiante(int id, ActualizarEstudianteDto dto)
    {
        var estudiante = await _context.Estudiantes
            .Include(e => e.Inscripciones)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (estudiante == null)
        {
            return NotFound(new { message = "Estudiante no encontrado" });
        }

        if (await _context.Estudiantes.AnyAsync(e => e.Email == dto.Email && e.Id != id))
        {
            return BadRequest(new { message = "Ya existe otro estudiante con ese email" });
        }

        if (dto.MateriasIds.Count != 3)
        {
            return BadRequest(new { message = "Debe seleccionar exactamente 3 materias" });
        }

        var materias = await _context.Materias
            .Where(m => dto.MateriasIds.Contains(m.Id))
            .ToListAsync();

        if (materias.Count != 3)
        {
            return BadRequest(new { message = "Una o mas materias no existen" });
        }

        var profesoresIds = materias.Select(m => m.ProfesorId).ToList();
        if (profesoresIds.Distinct().Count() != 3)
        {
            return BadRequest(new { message = "No puede seleccionar materias del mismo profesor. Cada materia debe ser de un profesor diferente." });
        }

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
        estudiante.Nombre = dto.Nombre;
        estudiante.Apellido = dto.Apellido;
        estudiante.Email = dto.Email;

        _context.Inscripciones.RemoveRange(estudiante.Inscripciones);
        await _context.SaveChangesAsync();

        var nuevasInscripciones = dto.MateriasIds.Select(materiaId => new Inscripcion
        {
            EstudianteId = estudiante.Id,
            MateriaId = materiaId
        });

        _context.Inscripciones.AddRange(nuevasInscripciones);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEstudiante(int id)
    {
        var estudiante = await _context.Estudiantes.FindAsync(id);

        if (estudiante == null)
        {
            return NotFound(new { message = "Estudiante no encontrado" });
        }

        _context.Estudiantes.Remove(estudiante);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}/companeros")]
    public async Task<ActionResult<IEnumerable<CompanerosPorMateriaDto>>> GetCompaneros(int id)
    {
        var estudiante = await _context.Estudiantes
            .Include(e => e.Inscripciones)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (estudiante == null)
        {
            return NotFound(new { message = "Estudiante no encontrado" });
        }

        var materiasEstudiante = estudiante.Inscripciones.Select(i => i.MateriaId).ToList();

        var companerosPorMateria = await _context.Inscripciones
            .Where(i => materiasEstudiante.Contains(i.MateriaId) && i.EstudianteId != id)
            .Include(i => i.Materia)
            .Include(i => i.Estudiante)
            .Select(i => new
            {
                i.MateriaId,
                i.Materia.Nombre,
                EstudianteNombre = i.Estudiante.Nombre
            })
            .ToListAsync();

        var resultado = materiasEstudiante.Select(materiaId =>
        {
            var companerosDeLaMateria = companerosPorMateria
                .Where(c => c.MateriaId == materiaId)
                .ToList();

            return new CompanerosPorMateriaDto
            {
                MateriaId = materiaId,
                MateriaNombre = companerosDeLaMateria.FirstOrDefault()?.Nombre ?? "",
                Companeros = companerosDeLaMateria.Select(c => c.EstudianteNombre).ToList()
            };
        }).ToList();

        return Ok(resultado);
    }
}
