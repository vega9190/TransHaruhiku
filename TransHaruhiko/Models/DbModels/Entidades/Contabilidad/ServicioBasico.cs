using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades.Contabilidad
{
    [Table("conta.ServiciosBasicos")]
    public class ServicioBasico
    {
        [Key]
        [Column("IdServicioBasico")]
        public int Id { get; set; }
        public string Nombre { get; set; }
    }
}