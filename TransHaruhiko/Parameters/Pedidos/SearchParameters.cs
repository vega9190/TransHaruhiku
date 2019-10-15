using System;
using TransHaruhiko.Models.ViewModel;

namespace TransHaruhiko.Parameters.Pedidos
{
    public class SearchParameters : BaseListViewModel
    {
        public enum PedidoOrderColumn
        {
            Id,
            Nombre,
            Carnet,
            Fecha
        }

        public string Nombre { get; set; }
        public string Carnet { get; set; }
        public string Contenedor { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
    }
}