using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Clientes")]
    public class Cliente
    {
        [Key]
        [Column("IdCliente")]
        public int Id { get; set; }
        public string Carnet { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Direccion { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string NombreCompleto => (Nombres + " " + Apellidos).Trim();
        public bool Activo { get; set; }
        [Column("IdEmpresa")]
        public int EmpresaId { get; set; }
        [ForeignKey(nameof(EmpresaId))]
        public virtual Empresa Empresa { get; set; }
    }
}