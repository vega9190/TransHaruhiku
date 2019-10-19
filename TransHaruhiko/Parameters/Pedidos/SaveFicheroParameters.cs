using TransHaruhiko.CustomHelpers.FileManager;

namespace TransHaruhiko.Parameters.Pedidos
{
    public class SaveFicheroParameters : FileActionParameters
    {
        public int? IdPedido { get; set; }
        public int? IdTipo { get; set; }
    }
}