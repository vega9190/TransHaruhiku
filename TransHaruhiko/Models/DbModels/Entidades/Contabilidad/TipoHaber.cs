using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades.Contabilidad
{
    [Table("conta.TiposHaberes")]
    public class TipoHaber
    {
        [Key]
        [Column("IdTipoHaber")]
        public int Id { get; set; }
        public string Nombre { get; set; }
    }
}