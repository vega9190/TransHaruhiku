using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades.Contabilidad
{
    [Table("conta.Haberes")]
    public class Haber
    {
        [Key]
        [Column("IdHaber")]
        public int Id { get; set; }
        public string Observacion { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
        [Column("IdServicioBasico")]
        public int ServicioBasicoId { get; set; }
        [Column("IdTipoHaber")]
        public int TipoHaberId { get; set; }
        [Column("IdTipoMoneda")]
        public int TipoMonedaId { get; set; }
        public virtual  ServicioBasico ServicioBasico { get; set; }
        public virtual TipoHaber TipoHaber { get; set; }
        public virtual TipoMoneda TipoMoneda { get; set; }

    }
}