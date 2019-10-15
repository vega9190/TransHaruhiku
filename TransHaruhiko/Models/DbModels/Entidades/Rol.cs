using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Roles")]
    public class Rol
    {
        [Key]
        [Column("IdRol")]
        public int Id { get; set; }
        public string Nombre { get; set; }
    }
}