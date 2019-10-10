using System.Data.Entity;
using TransHaruhiku.Models.DbModels.Entidades;

namespace TransHaruhiku.Models.DbModels
{
    public class TransHaruhikuDbContext : DbContext
    {
        public TransHaruhikuDbContext() : base("TransHaruhikuDb")
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
    }
}