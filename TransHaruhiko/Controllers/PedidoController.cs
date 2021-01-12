using System.Web.Mvc;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pedidos;
using TransHaruhiko.Services;
using System.Linq;
using TransHaruhiko.Globalization.Controllers;
using TransHaruhiko.Models.Enum;

namespace TransHaruhiko.Controllers
{
    [Authorize]
    public class PedidoController : Controller
    {
        private readonly IPedidosService _pedidosService;
        private readonly IReportesService _reportesService;
        
        public PedidoController(IPedidosService pedidosService, IReportesService reportesService)
        {
            _pedidosService = pedidosService;
            _reportesService = reportesService;
        }

        public ActionResult List()
        {
            return View();
        }
        public ActionResult Editar(int? id)
        {
            ViewBag.IdPedido = id;
            ViewBag.UploadSizeLimit = 20480;
            return View();
        }
        public ActionResult Buscar(SearchParameters parameters)
        {
            var queriable = _pedidosService.Buscar();
            queriable = queriable.Where(a => a.EstadoId != (int)EstadosEnum.Cancelado && a.EmpresaId == parameters.IdEmpresa);

            if (parameters.IdPedido.HasValue)
            {
                queriable = queriable.Where(a => a.Id == parameters.IdPedido.Value);
            }

            if (parameters.Finalizados.HasValue)
            {
                queriable = parameters.Finalizados.Value 
                    ? queriable.Where(a => a.EstadoId == (int)EstadosEnum.Finalizado) 
                    : queriable.Where(a => a.EstadoId != (int)EstadosEnum.Finalizado);
            }
            else
            {
                queriable = queriable.Where(a => a.EstadoId != (int)EstadosEnum.Finalizado);
            }

            if (!string.IsNullOrEmpty(parameters.Nombre))
            {
                queriable = queriable.Where(a => (a.Cliente.Nombres + " " + a.Cliente.Apellidos).Contains(parameters.Nombre));
            }
            if (!string.IsNullOrEmpty(parameters.Carnet))
            {
                queriable = queriable.Where(a => a.Cliente.Carnet.Contains(parameters.Carnet));
            }
            if (!string.IsNullOrEmpty(parameters.Contenedor))
            {
                queriable = queriable.Where(a => a.Contenedores.Contains(parameters.Contenedor));
            }

            if (parameters.FechaDesde.HasValue && parameters.FechaHasta.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha >= parameters.FechaDesde.Value && a.Fecha <= parameters.FechaHasta.Value);
            }
            else if (parameters.FechaDesde.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha >= parameters.FechaDesde.Value);
            }
            else if (parameters.FechaHasta.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha <= parameters.FechaHasta.Value);
            }
            var querySelect = queriable.Select(a => new
            {
                Pedido = new
                {
                    a.Id,
                    a.Descripcion,
                    Contenedores = a.Contenedores,
                    a.Fecha,
                    a.Precio,
                    Cliente = new
                    {
                        a.Cliente.Id,
                        a.Cliente.Carnet,
                        a.Cliente.Nombres,
                        a.Cliente.Apellidos,
                        NombreCompleto = (a.Cliente.Nombres + " " + a.Cliente.Apellidos).Trim()
                    },
                    Estado = new
                    {
                        a.Estado.Id,
                        a.Estado.Nombre
                    }
                }
            });

            var order = parameters.GetEnum(SearchParameters.PedidoOrderColumn.Fecha);
            switch (order)
            {
                case SearchParameters.PedidoOrderColumn.Id:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Pedido.Id)
                        : querySelect.OrderByDescending(a => a.Pedido.Id);
                    break;
                case SearchParameters.PedidoOrderColumn.Nombre:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Pedido.Cliente.Nombres).ThenBy(a=> a.Pedido.Cliente.Apellidos)
                        : querySelect.OrderByDescending(a => a.Pedido.Cliente.Nombres).ThenByDescending(a=> a.Pedido.Cliente.Apellidos);
                    break;
                case SearchParameters.PedidoOrderColumn.Fecha:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderByDescending(a => a.Pedido.Fecha)
                        : querySelect.OrderByDescending(a => a.Pedido.Fecha);
                    break;
            }

            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();

            var returnList = listado.Select(a =>
            {
                var returnData = new
                {
                    a.Pedido,
                    FechaPedido = a.Pedido.Fecha.ToString("dd/MM/yyyy"),
                    Contenedor = string.Join(", ", a.Pedido.Contenedores)
                };
                return returnData;
            });
            var transfer = new ClientTransfer();
            var totalElements = querySelect.Count();
            var totalPages = totalElements / parameters.ItemsPerPage;
            transfer.Data = returnList;
            transfer.Pagination.TotalPages = totalPages + ((totalElements % parameters.ItemsPerPage) > 0 ? 1 : 0);
            transfer.Pagination.TotalRecords = totalElements; //Total de elementos segun filtro
            transfer.Pagination.TotalDisplayRecords = listado.Count; //Total de elementos segun pagina
            return Json(transfer);
        }
        public ActionResult Obtener(int idPedido)
        {
            var transfer = new ClientTransfer();
            var pedido = _pedidosService.Get(idPedido);
            
            
            if(pedido == null)
            {
                return null;
            }
            transfer.Data = new
            {
                Pedido = new
                {
                    pedido.Id,
                    pedido.Direccion,
                    pedido.DireccionUrl,
                    pedido.ParteRecepcion,
                    Contenedor = pedido.Contenedores,
                    Cliente = new
                    {
                        pedido.Cliente.Id,
                        pedido.Cliente.Telefono,
                        NombreCompleto = pedido.Cliente.NombreCompleto
                    },
                    Estado = new
                    {
                        pedido.Estado.Id,
                        pedido.Estado.Nombre
                    },
                    Ficheros = pedido.Ficheros.Select(a => new {
                        a.Id,
                        a.Nombre,
                        Estado = new {
                            a.Estado.Id,
                            a.Estado.Nombre
                        },
                        Tipo = new
                        {
                            a.Tipo.Id,
                            a.Tipo.Nombre
                        }
                    }),
                    TienePolizas = pedido.Polizas.Any(),
                    Empresa = new {
                        pedido.EmpresaId,
                        pedido.Empresa.Nombre
                    }
                }
            };
            
            return Json(transfer);
        }

        public ActionResult Guardar(SaveParameters parameters)
        {
            var transfer = new ClientTransfer();

            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }
            parameters.IdUsuario = int.Parse(user.Name);
            var res = _pedidosService.Guardar(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        public ActionResult GuardarPrecio(SaveParameters parameters)
        {
            var transfer = new ClientTransfer();

            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }
            parameters.IdUsuario = int.Parse(user.Name);
            var res = _pedidosService.GuardarPrecio(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        public ActionResult GuardarParteRecepcion(SaveParameters parameters)
        {
            var transfer = new ClientTransfer();

            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }
            parameters.IdUsuario = int.Parse(user.Name);
            var res = _pedidosService.GuardarParteRecepcion(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            var cambiarEstado = _pedidosService.CambiarEstado(parameters.IdPedido.Value, parameters.IdUsuario.Value);
            var pedido = _pedidosService.Get(parameters.IdPedido.Value);

            transfer.Data = new { EstadoModificado = cambiarEstado, Estado = pedido.Estado.Nombre };
            return Json(transfer);
        }
        public ActionResult Eliminar(int idPedido)
        {
            var transfer = new ClientTransfer();
            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }
            
            var res = _pedidosService.Eliminar(idPedido, int.Parse(user.Name));

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            return Json(transfer);
        }
        [HttpGet]
        [Route("GenedarRecibiConforme/{idPedido}")]
        public ActionResult GenedarRecibiConforme(int idPedido)
        {
            _reportesService.GenerarRecibiConforme(idPedido, Response);
            return null;
        }

        #region PopUps
        public ActionResult PopUpCrear()
        {
            return View();
        }

        public ActionResult PopUpObservacion()
        {
            return View();
        }
        public ActionResult PopUpPago()
        {
            return View();
        }
        public ActionResult PopUpCobro()
        {
            return View();
        }
        #endregion


    }
}