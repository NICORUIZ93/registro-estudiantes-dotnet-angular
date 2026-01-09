using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RegistroEstudiantes.API.Models;

[Table("materias")]
public class Materia
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Column("creditos")]
    public int Creditos { get; set; } = 3;

    [Column("profesor_id")]
    public int ProfesorId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("ProfesorId")]
    public Profesor Profesor { get; set; } = null!;

    public ICollection<Inscripcion> Inscripciones { get; set; } = new List<Inscripcion>();
}
