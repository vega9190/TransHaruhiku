using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Contenedores")]
    public class Contenedor
    {
        [Key]
        [Column("IdContenedor")]
        public int Id { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string Poliza { get; set; }
        [Column("IdPedido")]
        public int PedidoId { get; set; }
        [ForeignKey(nameof(PedidoId))]
        public virtual Pedido Pedido { get; set; }
        public virtual ICollection<DespachoContenedor> DespachoContenedores { get; set; }
    }
}