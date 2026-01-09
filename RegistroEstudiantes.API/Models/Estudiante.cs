using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RegistroEstudiantes.API.Models;

[Table("estudiantes")]
public class Estudiante
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("apellido")]
    public string Apellido { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [EmailAddress]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();
}
