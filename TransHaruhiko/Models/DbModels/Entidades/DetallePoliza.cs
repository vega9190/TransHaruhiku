using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.DetallePolizas")]
    public class DetallePoliza
    {
        [Key]
        [Column("IdDetallePoliza")]
        public int Id { get; set; }
        public string Concepto { get; set; }
        public decimal Precio { get; set; }
        [Column("IdPoliza")]
        public int PolizaId { get; set; }
        [ForeignKey(nameof(PolizaId))]
        public virtual Poliza Poliza { get; set; }
    }
}