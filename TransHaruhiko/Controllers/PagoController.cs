using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TransHaruhiko.Globalization.Controllers;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pagos;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    public class PagoController : Controller
    {
        private readonly IPagosService _pagosService;
        public PagoController(IPagosService pagosService)
        {
            _pagosService = pagosService;
        }
        public ActionResult Buscar(SearchParameters parameters)
        {
            var queriable = _pagosService.Buscar();
            queriable = queriable.Where(a => a.PedidoId == parameters.IdPedido);

            var querySelect = queriable.Select(a => new
            {
                Pago = new
                {
                    a.Id,
                    a.Monto,
                    a.Fecha,
                    TipoMoneda = new {
                        a.TipoMoneda.Id,
                        a.TipoMoneda.Abreviacion
                    },
                    Tipo = new {
                        a.Tipo.Id,
                        a.Tipo.Nombre
                    },
                    Usuario = new
                    {
                        a.Usuario.Id,
                        NombreCompleto = (a.Usuario.Trabajador.Nombres + " " + a.Usuario.Trabajador.Apellidos).Trim()
                    }
                }
            });
            querySelect = querySelect.OrderByDescending(a => a.Pago.Fecha);


            var listado = querySelect.Skip((parameters.PageIndex - 1) * parameters.ItemsPerPage)
                .Take(parameters.ItemsPerPage).ToList();

            var returnList = listado.Select(a =>
            {
                var returnData = new
                {
                    a.Pago,
                    FechaPago = a.Pago.Fecha.ToString("dd/MM/yyyy")
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
            var res = _pagosService.Guardar(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
        public ActionResult Eliminar(int idPago)
        {
            var transfer = new ClientTransfer();

            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }
            
            var res = _pagosService.Eliminar(idPago, int.Parse(user.Name));

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }
    }
}