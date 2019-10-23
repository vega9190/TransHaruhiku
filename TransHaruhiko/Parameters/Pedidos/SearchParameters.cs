using System;
using TransHaruhiko.Models.ViewModel;

namespace TransHaruhiko.Parameters.Pedidos
{
    public class SearchParameters : BaseListViewModel
    {
        public enum PedidoOrderColumn
        {
            Id,
            Fecha,
            Nombre,
            Carnet
        }

        public string Nombre { get; set; }
        public string Carnet { get; set; }
        public string Contenedor { get; set; }
        public DateTime? FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; }
    }
}