using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Usuarios")]
    public class Usuario
    {
        [Key]
        [Column("IdUsuario")]
        public int Id { get; set; }
        [Column("Usuario")]
        public string Nickname { get; set; }
        public string Pass { get; set; }
        public bool Activo { get; set; }
        [Column("IdRol")]
        public int RolId { get; set; }
        [ForeignKey(nameof(RolId))]
        public virtual Rol Rol { get; set; }
        [Column("IdTrabajador")]
        public int TrabajadorId { get; set; }
        [ForeignKey(nameof(TrabajadorId))]
        public virtual Trabajador Trabajador { get; set; }
    }
}