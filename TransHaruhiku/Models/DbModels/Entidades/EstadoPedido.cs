using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiku.Models.DbModels.Entidades
{
    [Table("th.EstadosPedidos")]
    public class EstadoPedido
    {
        [Key]
        [Column("IdEstadoPedido")]
        public int Id { get; set; }
        public string Nombre { get; set; }
    }
}