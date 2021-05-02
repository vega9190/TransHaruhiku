using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Haberes;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    [Authorize]
    public class HaberController : Controller
    {
        private readonly IHaberesService _haberesService;
        private readonly IReportesService _reportesService;

        public HaberController(IHaberesService haberesService, IReportesService reportesService)
        {
            _haberesService = haberesService;
            _reportesService = reportesService;
        }
        public ActionResult List()
        {
            return View();
        }
        public ActionResult Buscar(SearchParameters parameters)
        {
            var queriable = _haberesService.Buscar();
            queriable = queriable.Where(a =>  a.EmpresaId == parameters.IdEmpresa);

            if (parameters.IdTipoHaber.HasValue)
            {
                queriable = queriable.Where(a => a.TipoHaberId == parameters.IdTipoHaber.Value);
            }

            if (parameters.IdServicioBasico.HasValue)
            {
                queriable = queriable.Where(a => a.ServicioBasicoId == parameters.IdServicioBasico.Value);
            }

            if (parameters.IdTipoMoneda.HasValue)
            {
                queriable = queriable.Where(a => a.TipoMonedaId == parameters.IdTipoMoneda.Value);
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
                Haber = new
                {
                    a.Id,
                    a.Fecha,
                    Monto = a.Monto + " " + a.TipoMoneda.Abreviacion,
                    a.Observacion,
                    Tipo = new
                    {
                        a.TipoHaber.Id,
                        a.TipoHaber.Nombre
                    },
                    ServicioBasico = new
                    {
                        a.ServicioBasico.Id,
                        a.ServicioBasico.Nombre
                    }
                }
            });

            var order = parameters.GetEnum(SearchParameters.HaberOrderColumn.Fecha);
            switch (order)
            {
                case SearchParameters.HaberOrderColumn.Id:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Haber.Id)
                        : querySelect.OrderByDescending(a => a.Haber.Id);
                    break;
                case SearchParameters.HaberOrderColumn.Fecha:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderByDescending(a => a.Haber.Fecha)
                        : querySelect.OrderByDescending(a => a.Haber.Fecha);
                    break;
            }

            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();

            var returnList = listado.Select(a =>
            {
                var returnData = new
                {
                    a.Haber,
                    FechaHaber = a.Haber.Fecha.ToString("dd/MM/yyyy")
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

        public ActionResult Obtener(int idHaber)
        {
            var transfer = new ClientTransfer();
            var haber = _haberesService.Get(idHaber);


            if (haber == null)
            {
                return null;
            }
            transfer.Data = new
            {
                Haber = new
                {
                    haber.Id,
                    haber.Observacion,
                    haber.Monto,
                    Fecha = haber.Fecha.ToString("dd/MM/yyyy"),
                    TipoHaber = new
                    {
                        haber.TipoHaber.Id,
                        haber.TipoHaber.Nombre
                    },
                    TipoMoneda = new
                    {
                        haber.TipoMoneda.Id,
                        haber.TipoMoneda.Nombre
                    },
                    ServicioBasico = new
                    {
                        haber.ServicioBasico.Id,
                        haber.ServicioBasico.Nombre
                    },
                    Empresa = new
                    {
                        haber.Empresa.Id,
                        haber.Empresa.Nombre
                    }
                }
            };

            return Json(transfer);
        }
        public ActionResult Guardar(SaveParameters parameters)
        {
            var transfer = new ClientTransfer();

            var res = _haberesService.Guardar(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        public ActionResult Eliminar(int idHaber)
        {
            var transfer = new ClientTransfer();
            
            var res = _haberesService.Eliminar(idHaber);

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
        public ActionResult PopUpEditar()
        {
            return View();
        }
        public ActionResult PopUpInformeServicioBasico()
        {
            return View();
        }

        [HttpGet]
        [Route("GenerarInformeServicioBasico/{fechaDesde}/{fechaHasta}")]
        public ActionResult GenerarInformeServicioBasico(long fechaDesde, long fechaHasta)
        {

            _reportesService.GenerarInformeServicioBasico(fechaDesde, fechaHasta, Response);
            return null;
        }
    }
}