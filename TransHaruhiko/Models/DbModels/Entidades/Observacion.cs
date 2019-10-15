using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.observaciones")]
    public class Observacion
    {
        [Key]
        [Column("IdObservacion")]
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public string Descripcion { get; set; }
        [Column("IdPedido")]
        public int PedidoId { get; set; }
        [ForeignKey(nameof(PedidoId))]
        public virtual Pedido Pedido { get; set; }
        [Column("IdUsuario")]
        public int UsuarioId { get; set; }
        [ForeignKey(nameof(UsuarioId))]
        public virtual Usuario Usuario { get; set; }
    }
}