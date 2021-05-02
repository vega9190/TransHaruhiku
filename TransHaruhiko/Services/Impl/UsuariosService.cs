using System;
using System.Collections.Generic;
using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Dto.Entidades;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.RestModel;
using TransHaruhiko.Parameters.Usuarios;

namespace TransHaruhiko.Services.Impl
{
    public class UsuariosService : IUsuariosService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public UsuariosService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Usuario Get(string userName, string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                var id = int.Parse(userName);
                return _dbContext.Usuarios.Find(id);
            }
            else
            {
                return _dbContext.Usuarios.FirstOrDefault(a => a.Nickname == userName && a.Pass == password);
            }
        }
        public CommonRestModel GuardarUsuario(SaveParameters parameters)
        {
            var res = new CommonRestModel();

            if (parameters.IdUsuario.HasValue)
            {
                var usuario = _dbContext.Usuarios.Find(parameters.IdUsuario);
                usuario.Nickname = parameters.Usuario;
                usuario.Pass = parameters.Pass;
                usuario.Activo = parameters.Activo;
                usuario.RolId = parameters.IdRol;
                usuario.TrabajadorId = parameters.IdTrabajador;
            }
            else
            {
                var usuario = new Usuario
                {
                    Nickname = parameters.Usuario,
                    Pass = parameters.Pass,
                    Activo = parameters.Activo,
                    RolId = parameters.IdRol,
                    TrabajadorId = parameters.IdTrabajador
                };
                _dbContext.Usuarios.Add(usuario);
            }

            _dbContext.SaveChanges();
            res.CodigoResultado = "0";
            res.Mensaje = "Ok";
            return res;
        }
        public List<UsuarioDto> ObtenerUsuarios(int? idUsuario)
        {
            var res = new List<UsuarioDto>();
            if (idUsuario.HasValue)
            {
                var usuario = _dbContext.Usuarios.Find(idUsuario);
                res.Add(new UsuarioDto
                {
                    IdUsuario = usuario.Id,
                    Usuario = usuario.Nickname,
                    Pass = usuario.Pass,
                    Activo = usuario.Activo,
                    IdRol = usuario.RolId,
                    IdTrabajador = usuario.TrabajadorId,
                    Empresas = usuario.UsuarioEmpresas.Select(a=> new EmpresaDto { IdEmpresa = a.EmpresaId, Nombre = a.Empresa.Nombre, Activa = a.Empresa.Activa }).ToList()
                });
            }
            else
            {
                var usuarios = _dbContext.Usuarios.ToList();
                res.AddRange(usuarios.Select(usuario=> new UsuarioDto {
                    IdUsuario = usuario.Id,
                    Usuario = usuario.Nickname,
                    Pass = usuario.Pass,
                    Activo = usuario.Activo,
                    IdRol = usuario.RolId,
                    IdTrabajador = usuario.TrabajadorId,
                    Empresas = usuario.UsuarioEmpresas.Select(a => new EmpresaDto { IdEmpresa = a.EmpresaId, Nombre = a.Empresa.Nombre, Activa = a.Empresa.Activa }).ToList()
                }));
            }
            return res;
        }
        public CommonRestModel GuardarUsuarioEmpresa(SaveUsuarioEmpresaParameters usuarioEmpresa)
        {
            var res = new CommonRestModel();
            var usuariosEmpresas = _dbContext.UsuariosEmpresas.Where(a => a.UsuarioId == usuarioEmpresa.IdUsuario).ToList();
            _dbContext.UsuariosEmpresas.RemoveRange(usuariosEmpresas);

            foreach(var empresa in usuarioEmpresa.IdsEmpresas)
            {
                var usuarioEmp = new UsuarioEmpresa
                {
                    UsuarioId = usuarioEmpresa.IdUsuario,
                    EmpresaId = empresa,
                    Fecha = DateTime.Now
                };
                _dbContext.UsuariosEmpresas.Add(usuarioEmp);
            }
            
            _dbContext.SaveChanges();
            res.CodigoResultado = "0";
            res.Mensaje = "Ok";
            return res;
        }
        public List<RolesDto> ObtenerRoles()
        {
            var res = new List<RolesDto>();
         
            var roles = _dbContext.Roles.ToList();
            res.AddRange(roles.Select(a => new RolesDto
            {
                IdRol = a.Id,
                Nombre = a.Nombre,
            }));
            
            return res;
        }
        public List<EmpresaDto> ObtenerEmpresas()
        {
            var res = new List<EmpresaDto>();

            var empresas = _dbContext.Empresas.ToList();
            res.AddRange(empresas.Select(a => new EmpresaDto
            {
                IdEmpresa = a.Id,
                Nombre = a.Nombre,
                Activa = a.Activa
            }));

            return res;
        }
        public CommonRestModel GuardarEmpresa(SaveEmpresaParameters parameters)
        {
            var res = new CommonRestModel();

            if (parameters.IdEmpresa.HasValue)
            {
                var empresa = _dbContext.Empresas.Find(parameters.IdEmpresa);
                empresa.Nombre = parameters.Nombre;
                empresa.Activa = parameters.Activa;
            }
            else
            {
                var empresa = new Empresa
                {
                    Nombre = parameters.Nombre,
                    Activa = parameters.Activa
                };
                _dbContext.Empresas.Add(empresa);
            }

            _dbContext.SaveChanges();
            res.CodigoResultado = "0";
            res.Mensaje = "Ok";
            return res;
        }
    }
}