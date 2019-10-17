using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Ficheros")]
    public class Fichero
    {
        [Key]
        [Column("IdFichero")]
        public int Id { get; set; }
        public string Nombre { get; set; }
        [Column("IdPedido")]
        public int PedidoId { get; set; }
        [ForeignKey(nameof(PedidoId))]
        public virtual Pedido Pedido { get; set; }
        [Column("IdEstadoFichero")]
        public int EstadoId { get; set; }
        [ForeignKey(nameof(EstadoId))]
        public virtual EstadoFichero Estado { get; set; }
        [Column("IdTipoFichero")]
        public int TipoId { get; set; }
        [ForeignKey(nameof(TipoId))]
        public virtual TipoFichero Tipo { get; set; }
    }
}