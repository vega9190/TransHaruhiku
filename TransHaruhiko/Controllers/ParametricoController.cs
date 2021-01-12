using System.Linq;
using System.Web.Mvc;
using TransHaruhiko.Models.Enum;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Models.ViewModel;
using TransHaruhiko.Parameters.Seguimientos;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    public class ParametricoController : Controller
    {
        private readonly IClientesService _clientesService;
        private readonly IFicherosService _ficherosService;
        private readonly IPedidosService _pedidosService;
        private readonly IPagosService _pagosService;

        public ParametricoController(IClientesService clientesService, IFicherosService ficherosService, 
            IPedidosService pedidosService, IPagosService pagosService)
        {
            _clientesService = clientesService;
            _ficherosService = ficherosService;
            _pedidosService = pedidosService;
            _pagosService = pagosService;
        }

        public ActionResult SimpleSearchCliente(SimpleListViewModel parameters)
        {
            var transfer = new ClientTransfer();
            var anyoQueriable = _clientesService.Buscar();
            anyoQueriable = anyoQueriable.Where(a => a.Activo);

            if (!string.IsNullOrEmpty(parameters.Descripcion))
                anyoQueriable = anyoQueriable.Where(a => a.Nombres.Contains(parameters.Descripcion));

            if (parameters.IdEmpresa.HasValue)
                anyoQueriable = anyoQueriable.Where(a => a.EmpresaId == parameters.IdEmpresa);

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
        public ActionResult SimpleSearchEmpresas(SimpleListViewModel parameters)
        {
            var transfer = new ClientTransfer();
            
            var anyoQueriable = _pedidosService.BuscarEmpresas();
            anyoQueriable = anyoQueriable.Where(a => a.Activa);

            //if (!string.IsNullOrEmpty(parameters.Descripcion))
            //    anyoQueriable = anyoQueriable.Where(a => a.Nombre.Contains(parameters.Descripcion));

            var selectQuery = anyoQueriable.Select(a => new
            {
                a.Id,
                Descripcion = a.Nombre.Trim()
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
        public ActionResult GetEmpresaPorDefecto()
        {
            var transfer = new ClientTransfer();
            var empresas = Session["Empresas"].ToString();
            var empresa = _pedidosService.ObtenerEmpresaPorDefento(empresas);
            transfer.Data = new
            {
                Empresa = new
                {
                    empresa.Id,
                    empresa.Nombre
                }
            };
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
        public ActionResult GetSeguimientos(SearchParameters parameters)
        {
            var queriable = _pedidosService.BuscarSeguimientos();

            queriable = queriable.Where(a => a.PedidoId == parameters.IdPedido && a.TipoId != (int)TipoSeguimientoEnum.Precios);
           
            var querySelect = queriable.Select(a => new
            {
                FechaSeguimiento = a.Fecha,
                a.Descripcion,
                TipoSeguimiento = a.Tipo.Nombre,
                UsuarioSeguimiento = new { a.Usuario.Trabajador.Nombres, a.Usuario.Trabajador.Apellidos}

            });

            var order = parameters.GetEnum(SearchParameters.SeguimientosOrderColumn.Fecha);
            switch (order)
            {
                case SearchParameters.SeguimientosOrderColumn.Fecha:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.FechaSeguimiento)
                        : querySelect.OrderByDescending(a => a.FechaSeguimiento);
                    break;
            }

            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();

            var returnList = listado.Select(a =>
            {
                var returnData = new
                {
                    Fecha = a.FechaSeguimiento.ToString("dd/MM/yyyy"),
                    a.Descripcion,
                    a.TipoSeguimiento,
                    Usuario = (a.UsuarioSeguimiento.Nombres + " " + a.UsuarioSeguimiento.Apellidos).Trim()
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
        public ActionResult SimpleSearchTipoPago(SimpleListViewModel parameters)
        {
            var transfer = new ClientTransfer();
            var anyoQueriable = _pagosService.GetTiposPagos();

            if (!string.IsNullOrEmpty(parameters.Descripcion))
                anyoQueriable = anyoQueriable.Where(a => a.Nombre.Contains(parameters.Descripcion));

            var selectQuery = anyoQueriable.Select(a => new
            {
                a.Id,
                Descripcion = a.Nombre
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
        public ActionResult SimpleSearchTipoMoneda(SimpleListViewModel parameters)
        {
            var transfer = new ClientTransfer();
            var anyoQueriable = _pagosService.GetTiposMonedas();

            if (!string.IsNullOrEmpty(parameters.Descripcion))
                anyoQueriable = anyoQueriable.Where(a => a.Nombre.Contains(parameters.Descripcion));

            var selectQuery = anyoQueriable.Select(a => new
            {
                a.Id,
                Descripcion = a.Nombre
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

    }
}