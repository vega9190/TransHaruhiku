using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransHaruhiko.Models.DbModels.Entidades
{
    [Table("th.Usuarios_Empresas")]
    public class UsuarioEmpresa
    {
        [Key, Column("IdUsuario", Order = 1)]
        public int UsuarioId { get; set; }
        [Key, Column("IdEmpresa", Order = 2)]
        public int EmpresaId { get; set; }
        public DateTime Fecha { get; set; }
        [ForeignKey(nameof(UsuarioId))]
        public virtual Usuario Usuario { get; set; }
        [ForeignKey(nameof(EmpresaId))]
        public virtual Empresa Empresa { get; set; }
    }
}