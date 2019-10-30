using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TransHaruhiko.Services;
using TransHaruhiko.Parameters.Clientes;
using TransHaruhiko.Models.TransferStruct;

namespace TransHaruhiko.Controllers
{
    [Authorize]
    public class ClienteController : Controller
    {
        private readonly IClientesService _clientesService;
        public ClienteController(IClientesService clientesService)
        {
            _clientesService = clientesService;
        }
        public ActionResult List()
        {
            return View();
        }
        public ActionResult Buscar(SearchParameters parameters)
        {
            var queriable = _clientesService.Buscar();
            
            if (!string.IsNullOrEmpty(parameters.Nombre))
            {
                queriable = queriable.Where(a => (a.Nombres + " " + a.Apellidos).Contains(parameters.Nombre));
            }
            if (!string.IsNullOrEmpty(parameters.Carnet))
            {
                queriable = queriable.Where(a => a.Carnet.Contains(parameters.Carnet));
            }
            
            var querySelect = queriable.Select(a => new
            {
                Cliente = new
                {
                    a.Id,
                    a.Carnet,
                    a.Nombres,
                    a.Apellidos,
                    NombreCompleto = (a.Nombres + " " + a.Apellidos).Trim(),
                    a.Telefono,
                    a.Email,
                    a.Activo
                }
            });

            var order = parameters.GetEnum(SearchParameters.ClienteOrderColumn.Nombre);
            switch (order)
            {
                case SearchParameters.ClienteOrderColumn.Id:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Cliente.Id)
                        : querySelect.OrderByDescending(a => a.Cliente.Id);
                    break;
                case SearchParameters.ClienteOrderColumn.Nombre:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Cliente.Nombres).ThenBy(a=> a.Cliente.Apellidos)
                        : querySelect.OrderByDescending(a => a.Cliente.Nombres).ThenByDescending(a=> a.Cliente.Apellidos);
                    break;
            }

            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();

            //var returnList = listado.Select(a =>
            //{
            //    var returnData = new
            //    {
            //        a.Cliente,
            //        FechaPedido = a.Pedido.Fecha.ToString("dd/MM/yyyy")
            //    };
            //    return returnData;
            //});
            var transfer = new ClientTransfer();
            var totalElements = querySelect.Count();
            var totalPages = totalElements / parameters.ItemsPerPage;
            transfer.Data = listado;
            transfer.Pagination.TotalPages = totalPages + ((totalElements % parameters.ItemsPerPage) > 0 ? 1 : 0);
            transfer.Pagination.TotalRecords = totalElements; //Total de elementos segun filtro
            transfer.Pagination.TotalDisplayRecords = listado.Count; //Total de elementos segun pagina
            return Json(transfer);
        }
    }
}