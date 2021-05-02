using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using TransHaruhiko.Parameters.Usuarios;
using TransHaruhiko.Parameters.TiposPagos;
using TransHaruhiko.Services;

namespace TransHaruhiko.ApiControllers
{
    [RoutePrefix("api/v1")]
    public class PedidoController : ApiController
    {
        private readonly IPagosService _pagosService;
        private readonly IHaberesService _haberesService;
        private readonly IUsuariosService _usuariosService;

        public PedidoController(IPagosService pagosService, IHaberesService haberesService, IUsuariosService usuariosService)
        {
            _pagosService = pagosService;
            _haberesService = haberesService;
            _usuariosService = usuariosService;
        }

        [HttpPost]
        [Route("tipo-pago")]
        public IHttpActionResult GuardarTipoPago(SaveTipoParameters parameters)
        {
            var res = _pagosService.GuardarTipoPago(parameters);
            return Ok(res);
        }
        [HttpPost]
        [Route("servicio-basico")]
        public IHttpActionResult GuardarServicioBasico(string nombre)
        {
            var res = _haberesService.GuardarServicioBasico(nombre);
            return Ok(res);
        }
        [HttpGet]
        [Route("usuario")]
        public IHttpActionResult ObtenerUsuarios(int? idUsuario = null)
        {
            var res = _usuariosService.ObtenerUsuarios(idUsuario);
            return Ok(res);
        }
        [HttpPost]
        [Route("usuario")]
        public IHttpActionResult GuardarUsuario(SaveParameters parameters)
        {
            var res = _usuariosService.GuardarUsuario(parameters);
            return Ok(res);
        }
        [HttpPost]
        [Route("usuario-empresa")]
        public IHttpActionResult GuardarUsuarioEmpresa(SaveUsuarioEmpresaParameters parameters)
        {
            var res = _usuariosService.GuardarUsuarioEmpresa(parameters);
            return Ok(res);
        }
        [HttpGet]
        [Route("roles")]
        public IHttpActionResult ObtenerRoles()
        {
            var res = _usuariosService.ObtenerRoles();
            return Ok(res);
        }
        [HttpGet]
        [Route("empresas")]
        public IHttpActionResult ObtenerEmpresas()
        {
            var res = _usuariosService.ObtenerEmpresas();
            return Ok(res);
        }
        [HttpPost]
        [Route("empresas")]
        public IHttpActionResult GuardarEmpresa(SaveEmpresaParameters parameters)
        {
            var res = _usuariosService.GuardarEmpresa(parameters);
            return Ok(res);
        }
    }
}