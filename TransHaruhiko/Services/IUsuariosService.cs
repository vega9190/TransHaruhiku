using System.Collections.Generic;
using TransHaruhiko.Models.DbModels.Dto.Entidades;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.RestModel;
using TransHaruhiko.Parameters.Usuarios;

namespace TransHaruhiko.Services
{
    public interface IUsuariosService
    {
        Usuario Get(string userName, string password);
        CommonRestModel GuardarUsuario(SaveParameters parameters);
        List<UsuarioDto> ObtenerUsuarios(int? idUsuario);
        CommonRestModel GuardarUsuarioEmpresa(SaveUsuarioEmpresaParameters usuarioEmpresa);
        List<RolesDto> ObtenerRoles();
        List<EmpresaDto> ObtenerEmpresas();
        CommonRestModel GuardarEmpresa(SaveEmpresaParameters parameters);
    }
}