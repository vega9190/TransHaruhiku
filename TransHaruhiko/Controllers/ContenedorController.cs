using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
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
        public ActionResult List()
        {
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
    }
}