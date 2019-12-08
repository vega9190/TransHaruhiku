using System.Collections.Generic;

namespace TransHaruhiko.Parameters.Polizas
{
    public class SaveParameters
    {
        public int? IdPoliza { get; set; }
        public int IdPedido { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string Poliza { get; set; }
        public List<SaveDetallePolizaPrameters> Detalles { get; set; }
    }
    public class SaveDetallePolizaPrameters
    {
        public string Concepto { get; set; }
        public string Precio { get; set; }
    }
}