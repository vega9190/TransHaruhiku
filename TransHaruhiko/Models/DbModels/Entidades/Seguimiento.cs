using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Seguimientos")]
    public class Seguimiento
    {
        [Key]
        [Column("IdSeguimiento")]
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public string Descripcion { get; set; }
        [Column("IdPedido")]
        public int PedidoId { get; set; }
        [ForeignKey(nameof(PedidoId))]
        public virtual Pedido Pedido { get; set; }
        [Column("IdTipoSeguimiento")]
        public int TipoId { get; set; }
        [ForeignKey(nameof(TipoId))]
        public virtual TipoSeguimiento Tipo { get; set; }
        [Column("IdUsuario")]
        public int UsuarioId { get; set; }
        [ForeignKey(nameof(UsuarioId))]
        public virtual Usuario Usuario { get; set; }
    }
}