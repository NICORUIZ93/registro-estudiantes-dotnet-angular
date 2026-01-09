using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RegistroEstudiantes.API.Models;

[Table("inscripciones")]
public class Inscripcion
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("estudiante_id")]
    public int EstudianteId { get; set; }

    [Column("materia_id")]
    public int MateriaId { get; set; }

    [Column("fecha_inscripcion")]
    public DateTime FechaInscripcion { get; set; } = DateTime.UtcNow;

    [ForeignKey("EstudianteId")]
    public Estudiante Estudiante { get; set; } = null!;

    [ForeignKey("MateriaId")]
    public Materia Materia { get; set; } = null!;
}
