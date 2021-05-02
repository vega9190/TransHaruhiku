using System.Data.Entity;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.DbModels.Entidades.Contabilidad;

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
        //TH
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<UsuarioEmpresa> UsuariosEmpresas { get; set; }
        public DbSet<Observacion> Observaciones { get; set; }
        public DbSet<Fichero> Ficheros { get; set; }
        public DbSet<TipoMime> TiposMimes { get; set; }
        public DbSet<EstadoFichero> EstadosFicheros { get; set; }
        public DbSet<Seguimiento> Seguimientos { get; set; }
        public DbSet<TipoFichero> TiposFicheros { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<TipoPago> TiposPagos { get; set; }
        public DbSet<TipoMoneda> TiposMonedas { get; set; }
        public DbSet<Poliza> Polizas { get; set; }
        public DbSet<DetallePoliza> DetallePolizas { get; set; }
        public DbSet<Empresa> Empresas { get; set; }
        public DbSet<Rol> Roles { get; set; }

        //Contabilidad
        public DbSet<Haber> Haberes { get; set; }
        public DbSet<TipoHaber> TiposHaberes { get; set; }
        public DbSet<ServicioBasico> ServiciosBasicos { get; set; }
    }
}