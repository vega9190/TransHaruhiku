using System;
using TransHaruhiko.Models.ViewModel;

namespace TransHaruhiko.Parameters.Haberes
{
    public class SearchParameters : BaseListViewModel
    {
        public enum HaberOrderColumn
        {
            Id,
            Fecha
        }
        public int? IdTipoHaber { get; set; }
        public int? IdServicioBasico { get; set; }
        public int? IdTipoMoneda { get; set; }
        public DateTime? FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; }
        public int IdEmpresa { get; set; }
    }
}