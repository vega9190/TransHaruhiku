using System.Collections.Generic;

namespace TransHaruhiko.Parameters.Usuarios
{
    public class SaveUsuarioEmpresaParameters
    {
        public int IdUsuario { get; set; }
        public List<int> IdsEmpresas { get; set; }
    }
}