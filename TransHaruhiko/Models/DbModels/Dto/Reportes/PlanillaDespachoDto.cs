using System.Collections.Generic;

namespace TransHaruhiko.Models.DbModels.Dto.Reportes
{
    public class PlanillaDespachoDto
    {
        public string NombreCompleto { get; set; }
        public string NitCi { get; set; }
        public string Descripcion { get; set; }
        public string Poliza { get; set; }
        public string LugarFecha { get; set; }
        public decimal TotalPedido { get; set; }
    }

    public class ContenedorDto
    {
        public int IdContenedor { get; set; }
        public string Nombre { get; set; }
        public string Poliza { get; set; }
        public decimal TotalContenedor { get; set; }
    }

    public class DetalleContenedorDto
    {
        public string Concepto { get; set; }
        public decimal Precio { get; set; }
    }
}