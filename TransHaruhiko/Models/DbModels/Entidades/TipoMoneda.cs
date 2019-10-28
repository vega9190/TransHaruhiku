using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.TiposMonedas")]
    public class TipoMoneda
    {
        [Key]
        [Column("IdTipoMoneda")]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Abreviacion { get; set; }
    }
}