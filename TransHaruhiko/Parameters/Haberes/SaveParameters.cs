using System;

namespace TransHaruhiko.Parameters.Haberes
{
    public class SaveParameters
    {
        public int? IdHaber { get; set; }
        public int IdEmpresa { get; set; }
        public int IdTipoHaber { get; set; }
        public int IdServicioBasico { get; set; }
        public int IdTipoMoneda { get; set; }
        public DateTime Fecha { get; set; }
        public string Monto { get; set; }
        public string Observacion { get; set; }
    }
}