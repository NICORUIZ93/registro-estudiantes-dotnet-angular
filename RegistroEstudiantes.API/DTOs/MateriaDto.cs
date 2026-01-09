namespace RegistroEstudiantes.API.DTOs;

public class MateriaDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int Creditos { get; set; }
    public int ProfesorId { get; set; }
    public string ProfesorNombre { get; set; } = string.Empty;
}

public class ProfesorDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public List<MateriaDto> Materias { get; set; } = new();
}
