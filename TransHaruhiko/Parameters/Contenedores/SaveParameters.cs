using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TransHaruhiko.Parameters.Contenedores
{
    public class SaveParameters
    {
        public int? IdContenedor { get; set; }
        public int IdPedido { get; set; }
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string Poliza { get; set; }
        public List<SaveDespachoContenedorPrameters> Despachos { get; set; }
    }
    public class SaveDespachoContenedorPrameters
    {
        public string Concepto { get; set; }
        public string Precio { get; set; }
    }
}