using System.Collections.Generic;

namespace TransHaruhiko.Models.DbModels.Dto.Entidades
{
    public class UsuarioDto
    {
        public int IdUsuario { get; set; }
        public string Usuario { get; set; }
        public string Pass { get; set; }
        public bool Activo { get; set; }
        public int IdRol { get; set; }
        public int IdTrabajador { get; set; }
        public List<EmpresaDto> Empresas { get; set; }
    }
}