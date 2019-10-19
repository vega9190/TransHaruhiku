using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Models.ViewModel;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    public class ParametricoController : Controller
    {
        private readonly IClientesService _clientesService;
        private readonly IFicherosService _ficherosService;

        public ParametricoController(IClientesService clientesService, IFicherosService ficherosService)
        {
            _clientesService = clientesService;
            _ficherosService = ficherosService;
        }

        public ActionResult SimpleSearchCliente(SimpleListViewModel parameters)
        {
            var transfer = new ClientTransfer();
            var anyoQueriable = _clientesService.GetClientes();

            if (!string.IsNullOrEmpty(parameters.Descripcion))
                anyoQueriable = anyoQueriable.Where(a => a.Nombres.Contains(parameters.Descripcion));

            var selectQuery = anyoQueriable.Select(a => new
            {
                a.Id,
                Descripcion = (a.Nombres + " " + a.Apellidos).Trim()
            }).OrderBy(o => o.Descripcion);

            var listado = selectQuery
                .Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage)
                .ToList();

            var totalElements = selectQuery.Count();
            var totalpages = totalElements / parameters.ItemsPerPage;

            transfer.Data = listado;
            transfer.Pagination.TotalPages = totalpages + ((totalElements % parameters.ItemsPerPage) > 0 ? 1 : 0);
            transfer.Pagination.TotalRecords = totalElements; //Total de elementos segun filtro
            transfer.Pagination.TotalDisplayRecords = listado.Count; //Total de elementos segun pagina
            return Json(transfer);
        }
        public ActionResult SearchPosibleEstadosDocumento(int idEstadoActual)
        {
            var transfer = new ClientTransfer();
            var estados = _ficherosService.GetEstadosPermitidos(idEstadoActual);


            transfer.Data = estados.Select(a => new
            {
                a.Id,
                Descripcion = a.Nombre
            });

            return Json(transfer);
        }
    }
}