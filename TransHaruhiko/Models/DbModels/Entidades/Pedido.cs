using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Pedidos")]
    public class Pedido
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public string Contenedor { get; set; }
        public DateTime Fecha { get; set; }
        [Column("IdCliente")]
        public int ClienteId { get; set; }
        [ForeignKey(nameof(ClienteId))]
        public Cliente Cliente { get; set; }
        [Column("IdEstadoPedido")]
        public int EstadoId { get; set; }
        [ForeignKey(nameof(EstadoId))]
        public EstadoPedido Estado { get; set; }
    }
}