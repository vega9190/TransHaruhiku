using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Polizas;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    [Authorize]
    public class PolizaController : Controller
    {
        private readonly IPolizasService _polizaService;
        private readonly IReportesService _reportesService;
        public PolizaController(IPolizasService polizaService, IReportesService reportesService)
        {
            _polizaService = polizaService;
            _reportesService = reportesService;
        }
        public ActionResult List(int? id)
        {
            if (!id.HasValue) return RedirectToError(new [] {"No existe el contenedor para el pedido."});
            ViewBag.IdPedido = id;
            return View();
        }
        public ActionResult Buscar(SearchParameters parameters)
        {
            var queriable = _polizaService.Buscar();
            queriable = queriable.Where(a => a.PedidoId == parameters.IdPedido);

            var querySelect = queriable.Select(a => new
            {
                Poliza = new
                {
                    a.Id,
                    a.Codigo,
                    a.Nombre
                }
            });

            querySelect = querySelect.OrderByDescending(a => a.Poliza.Id);

            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();


            var transfer = new ClientTransfer();
            var totalElements = querySelect.Count();
            var totalPages = totalElements / parameters.ItemsPerPage;
            transfer.Data = listado;
            transfer.Pagination.TotalPages = totalPages + ((totalElements % parameters.ItemsPerPage) > 0 ? 1 : 0);
            transfer.Pagination.TotalRecords = totalElements; //Total de elementos segun filtro
            transfer.Pagination.TotalDisplayRecords = listado.Count; //Total de elementos segun pagina
            return Json(transfer);
        }
        public ActionResult BuscarDetalle(SearchDetalleParameters parameters)
        {
            var queriable = _polizaService.BuscarDetalle();

            queriable = queriable.Where(a => a.PolizaId == parameters.IdPoliza);
            

            var querySelect = queriable.Select(a => new
            {
                Detalle = new
                {
                    a.Id,
                    a.Concepto,
                    a.Precio
                }
            });

            querySelect = querySelect.OrderByDescending(a => a.Detalle.Id);

            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();


            var transfer = new ClientTransfer();
            var totalElements = querySelect.Count();
            var totalPages = totalElements / parameters.ItemsPerPage;
            transfer.Data = listado;
            transfer.Pagination.TotalPages = totalPages + ((totalElements % parameters.ItemsPerPage) > 0 ? 1 : 0);
            transfer.Pagination.TotalRecords = totalElements; //Total de elementos segun filtro
            transfer.Pagination.TotalDisplayRecords = listado.Count; //Total de elementos segun pagina
            return Json(transfer);
        }
        public ActionResult ObtenerDetalle(int idPoliza)
        {
            var transfer = new ClientTransfer();
            var poliza = _polizaService.Get(idPoliza);


            if (poliza == null)
            {
                return null;
            }
            transfer.Data = new
            {
                Poliza = new
                {
                    poliza.Id,
                    poliza.Codigo,
                    poliza.Nombre,
                    DatallePoliza = poliza.DetallePolizas.Select(a => new {
                        a.Id,
                        a.Concepto,
                        a.Precio
                    })
                }
            };

            return Json(transfer);
        }
        public ActionResult Guardar(SaveParameters parameters)
        {
            var transfer = new ClientTransfer();
            
            var res = _polizaService.Guardar(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        public ActionResult Eliminar(int idPoliza)
        {
            var transfer = new ClientTransfer();
            
            var res = _polizaService.Eliminar(idPoliza);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        [HttpGet]
        [Route("GenerarPlanillaDespacho/{idPedido}")]
        public ActionResult GenerarPlanillaDespacho(int idPedido)
        {
            _reportesService.GenerarPlanillaDespacho(idPedido, Response);
            return null;
        }
        public ActionResult PopUpCrear()
        {
            return View();
        }
        public RedirectToRouteResult RedirectToError(string[] errors)
        {
            return RedirectToAction("FatalMessage", "ApplicationError", new RouteValueDictionary()
            {
                {
                    "message",
                    (object) string.Join(";", errors)
                }
            });
        }
    }
}