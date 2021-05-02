using System;

namespace TransHaruhiko.Models.DbModels.Dto.Reportes
{
    public class HaberDto
    {
        public string ServicioBasico { get; set; }
        public decimal Monto { get; set; }
        public string Moneda { get; set; }
        public string Observacion { get; set; }
        public DateTime Fecha { get; set; }
    }
}