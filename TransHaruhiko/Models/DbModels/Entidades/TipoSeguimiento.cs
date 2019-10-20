using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.TiposSeguimientos")]
    public class TipoSeguimiento
    {
        [Key]
        [Column("IdTipoSeguimiento")]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
    }
}