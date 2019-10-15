using System.Linq;
using System.Web.Mvc;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Observaciones;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    [Authorize]
    public class ObservacionController : Controller
    {
        private readonly IObservacionesService _observacionesService;

        public ObservacionController(IObservacionesService observacionesService)
        {
            _observacionesService = observacionesService;
        }
        public ActionResult Buscar(SearchParameters parameters)
        {
            var queriable = _observacionesService.Buscar();
            queriable = queriable.Where(a => a.PedidoId == parameters.IdPedido);
            
            var querySelect = queriable.Select(a => new
            {
                Observacion = new
                {
                    a.Id,
                    a.Descripcion,
                    a.Fecha,
                    Usuario = new
                    {
                        a.Usuario.Id,
                        NombreCompleto = (a.Usuario.Trabajador.Nombres + " " + a.Usuario.Trabajador.Apellidos).Trim()
                    }
                }
            });
            querySelect = querySelect.OrderByDescending(a => a.Observacion.Fecha);
           

            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();

            var returnList = listado.Select(a =>
            {
                var returnData = new
                {
                    a.Observacion,
                    FechaObservacion = a.Observacion.Fecha.ToString("dd/MM/yyyy")
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

        public ActionResult Guardar(SaveParameters parameters)
        {
            var transfer = new ClientTransfer();
            parameters.IdUsuario = int.Parse(User.Identity.Name);
            var res = _observacionesService.Guardar(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        public ActionResult Eliminar(int idObservacion)
        {
            var transfer = new ClientTransfer();
            
            var res = _observacionesService.Eliminar(idObservacion);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
    }
}