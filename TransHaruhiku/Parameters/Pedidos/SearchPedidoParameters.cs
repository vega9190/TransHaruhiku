using System;
using TransHaruhiku.Models.ViewModel;

namespace TransHaruhiku.Parameters.Pedidos
{
    public class SearchPedidoParameters : BaseListViewModel
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