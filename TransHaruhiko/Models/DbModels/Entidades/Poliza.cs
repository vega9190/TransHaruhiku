using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Polizas")]
    public class Poliza
    {
        [Key]
        [Column("IdPoliza")]
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        [Column("IdPedido")]
        public int PedidoId { get; set; }
        [ForeignKey(nameof(PedidoId))]
        public virtual Pedido Pedido { get; set; }
        public virtual ICollection<DetallePoliza> DetallePolizas { get; set; }
    }
}