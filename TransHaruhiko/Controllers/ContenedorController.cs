using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Contenedores;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    [Authorize]
    public class ContenedorController : Controller
    {
        private readonly IContenedoresService _contenedorService;
        public ContenedorController(IContenedoresService contenedorService)
        {
            _contenedorService = contenedorService;
        }
        public ActionResult List(int? id)
        {
            if (!id.HasValue) return RedirectToError(new [] {"No existe el contenedor para el acta"});
            ViewBag.IdPedido = id;
            return View();
        }
        public ActionResult Buscar(SearchParameters parameters)
        {
            var queriable = _contenedorService.Buscar();
            queriable = queriable.Where(a => a.PedidoId == parameters.IdPedido);

            var querySelect = queriable.Select(a => new
            {
                Contenedor = new
                {
                    a.Id,
                    a.Codigo,
                    a.Nombre
                }
            });

            querySelect = querySelect.OrderByDescending(a => a.Contenedor.Id);

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
            var queriable = _contenedorService.BuscarDetalle();

            queriable = queriable.Where(a => a.ContenedorId == parameters.IdContenedor);
            

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
        public ActionResult ObtenerDetalle(int idContenedor)
        {
            var transfer = new ClientTransfer();
            var contenedor = _contenedorService.Get(idContenedor);


            if (contenedor == null)
            {
                return null;
            }
            transfer.Data = new
            {
                Contenedor = new
                {
                    contenedor.Id,
                    contenedor.Codigo,
                    contenedor.Nombre,
                    contenedor.Poliza,
                    DatalleContenedor = contenedor.DespachoContenedores.Select(a => new {
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
            
            var res = _contenedorService.Guardar(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        public ActionResult Eliminar(int idContenedor)
        {
            var transfer = new ClientTransfer();
            
            var res = _contenedorService.Eliminar(idContenedor);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
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