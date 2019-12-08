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

    public class PolizaDto
    {
        public int IdPoliza { get; set; }
        public string Nombre { get; set; }
        public string Codigo { get; set; }
        public decimal TotalPoliza { get; set; }
    }

    public class DetallePolizaDto
    {
        public string Concepto { get; set; }
        public decimal Precio { get; set; }
    }
}