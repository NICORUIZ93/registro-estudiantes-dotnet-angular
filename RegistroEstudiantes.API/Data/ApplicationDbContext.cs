using Microsoft.EntityFrameworkCore;
using RegistroEstudiantes.API.Models;

namespace RegistroEstudiantes.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Profesor> Profesores { get; set; }
    public DbSet<Materia> Materias { get; set; }
    public DbSet<Estudiante> Estudiantes { get; set; }
    public DbSet<Inscripcion> Inscripciones { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Profesor>()
            .HasMany(p => p.Materias)
            .WithOne(m => m.Profesor)
            .HasForeignKey(m => m.ProfesorId);

        modelBuilder.Entity<Estudiante>()
            .HasMany(e => e.Inscripciones)
            .WithOne(i => i.Estudiante)
            .HasForeignKey(i => i.EstudianteId);

        modelBuilder.Entity<Materia>()
            .HasMany(m => m.Inscripciones)
            .WithOne(i => i.Materia)
            .HasForeignKey(i => i.MateriaId);

        modelBuilder.Entity<Inscripcion>()
            .HasIndex(i => new { i.EstudianteId, i.MateriaId })
            .IsUnique();

        modelBuilder.Entity<Estudiante>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");
            entity.Property(u => u.Id).HasColumnName("id");
            entity.Property(u => u.Username).HasColumnName("username");
            entity.Property(u => u.Email).HasColumnName("email");
            entity.Property(u => u.PasswordHash).HasColumnName("password_hash");
            entity.Property(u => u.CreatedAt).HasColumnName("created_at");
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.Username).IsUnique();
        });
    }
}
