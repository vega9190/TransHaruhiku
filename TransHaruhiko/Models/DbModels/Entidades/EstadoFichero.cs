using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.EstadosFicheros")]
    public class EstadoFichero
    {
        [Key]
        [Column("IdEstadoFichero")]
        public int Id { get; set; }
        public string Nombre { get; set; }
    }
}