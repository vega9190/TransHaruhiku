using TransHaruhiko.Models.ViewModel;

namespace TransHaruhiko.Parameters.Seguimientos
{
    public class SearchParameters : BaseListViewModel
    {
        public enum SeguimientosOrderColumn
        {
            Fecha
        }
        public int IdPedido { get; set; }
    }
}