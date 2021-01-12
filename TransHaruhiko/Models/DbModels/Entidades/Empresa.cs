using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Empresas")]
    public class Empresa
    {
        [Key]
        [Column("IdEmpresa")]
        public int Id { get; set; }
        public string Nombre { get; set; }
        public bool Activa { get; set; }
    }
}