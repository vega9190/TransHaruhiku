using System.Data.Entity;
using TransHaruhiko.Models.DbModels.Entidades;

namespace TransHaruhiko.Models.DbModels
{
    public class TransHaruhikoDbContext : DbContext
    {
        public TransHaruhikoDbContext() : base("TransHaruhikoDb")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Mapeo de posibles relaciones muchos a muchos
            // Mapeo de relaciones especiales
        }
        //Expedientes
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Observacion> Observaciones { get; set; }
        public DbSet<Fichero> Ficheros { get; set; }
        public DbSet<TipoMime> TiposMimes { get; set; }
        public DbSet<EstadoFichero> EstadosFicheros { get; set; }
        public DbSet<Seguimiento> Seguimientos { get; set; }
        public DbSet<TipoFichero> TiposFicheros { get; set; }
    }
}