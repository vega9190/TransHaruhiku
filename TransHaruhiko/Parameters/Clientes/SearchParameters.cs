using TransHaruhiko.Models.ViewModel;

namespace TransHaruhiko.Parameters.Clientes
{
    public class SearchParameters : BaseListViewModel
    {
        public enum ClienteOrderColumn
        {
            Id,
            Nombre
        }

        public string Nombre { get; set; }
        public string Carnet { get; set; }
    }
}