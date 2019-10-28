using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Pagos")]
    public class Pago
    {
        [Key]
        [Column("IdPago")]
        public int Id { get; set; }
        public string NombreFile { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
        [Column("IdPedido")]
        public int PedidoId { get; set; }
        [ForeignKey(nameof(PedidoId))]
        public virtual Pedido Pedido { get; set; }
        [Column("IdTipoPago")]
        public int TipoId { get; set; }
        [ForeignKey(nameof(TipoId))]
        public virtual TipoPago Tipo { get; set; }
        [Column("IdUsuario")]
        public int UsuarioId { get; set; }
        [ForeignKey(nameof(UsuarioId))]
        public virtual Usuario Usuario { get; set; }
        [Column("IdTipoMoneda")]
        public int TipoMonedaId { get; set; }
        [ForeignKey(nameof(TipoMonedaId))]
        public virtual TipoMoneda TipoMoneda { get; set; }
    }
}