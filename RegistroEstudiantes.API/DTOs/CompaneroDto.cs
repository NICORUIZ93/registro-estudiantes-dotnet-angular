namespace RegistroEstudiantes.API.DTOs;

public class CompanerosPorMateriaDto
{
    public int MateriaId { get; set; }
    public string MateriaNombre { get; set; } = string.Empty;
    public List<string> Companeros { get; set; } = new();
}
