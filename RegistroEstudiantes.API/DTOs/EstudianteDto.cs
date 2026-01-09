using System.ComponentModel.DataAnnotations;

namespace RegistroEstudiantes.API.DTOs;

public class CrearEstudianteDto
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es requerido")]
    [MaxLength(100)]
    public string Apellido { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress(ErrorMessage = "Email no valido")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Debe seleccionar 3 materias")]
    [MinLength(3, ErrorMessage = "Debe seleccionar exactamente 3 materias")]
    [MaxLength(3, ErrorMessage = "Debe seleccionar exactamente 3 materias")]
    public List<int> MateriasIds { get; set; } = new();
}

public class ActualizarEstudianteDto
{
    [Required(ErrorMessage = "El nombre es requerido")]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El apellido es requerido")]
    [MaxLength(100)]
    public string Apellido { get; set; } = string.Empty;

    [Required(ErrorMessage = "El email es requerido")]
    [EmailAddress(ErrorMessage = "Email no valido")]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;
}

public class EstudianteResponseDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int TotalCreditos { get; set; }
    public List<MateriaInscritaDto> Materias { get; set; } = new();
}

public class MateriaInscritaDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int Creditos { get; set; }
    public string ProfesorNombre { get; set; } = string.Empty;
}
