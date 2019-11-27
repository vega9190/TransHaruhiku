using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Pedidos")]
    public class Pedido
    {
        [Key]
        [Column("IdPedido")]
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public string Direccion { get; set; }
        public string DireccionUrl { get; set; }
        public decimal? Precio { get; set; }
        public bool ParteRecepcion { get; set; }
        [Column("IdCliente")]
        public int ClienteId { get; set; }
        [ForeignKey(nameof(ClienteId))]
        public virtual Cliente Cliente { get; set; }
        [Column("IdEstadoPedido")]
        public int EstadoId { get; set; }
        [ForeignKey(nameof(EstadoId))]
        public virtual EstadoPedido Estado { get; set; }
        public virtual ICollection<Fichero> Ficheros { get; set; }
        public virtual ICollection<Contenedor> Contenedores { get; set; }
    }
}