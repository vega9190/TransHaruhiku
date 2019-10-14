﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Pedidos")]
    public class Pedido
    {
        [Key]
        [Column("IdPedido")]
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public string Contenedor { get; set; }
        public DateTime Fecha { get; set; }
        public string Direccion { get; set; }
        public string DireccionUrl { get; set; }
        [Column("IdCliente")]
        public int ClienteId { get; set; }
        [ForeignKey(nameof(ClienteId))]
        public virtual Cliente Cliente { get; set; }
        [Column("IdEstadoPedido")]
        public int EstadoId { get; set; }
        [ForeignKey(nameof(EstadoId))]
        public virtual EstadoPedido Estado { get; set; }
    }
}