using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.DespachoContenedores")]
    public class DespachoContenedor
    {
        [Key]
        [Column("IdDespachoCOntenedor")]
        public int Id { get; set; }
        public string Concepto { get; set; }
        public decimal Precio { get; set; }
        [Column("IdContenedor")]
        public int ContenedorId { get; set; }
        [ForeignKey(nameof(ContenedorId))]
        public virtual Contenedor Contenedor { get; set; }
    }
}