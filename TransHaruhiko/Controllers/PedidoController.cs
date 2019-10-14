﻿using System.Web.Mvc;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pedidos;
using TransHaruhiko.Services;
using System.Linq;

namespace TransHaruhiko.Controllers
{
    public class PedidoController : Controller
    {
        private readonly IPedidosService _pedidosService;
        
        public PedidoController(IPedidosService pedidosService)
        {
            _pedidosService = pedidosService;
        }

        public ActionResult List()
        {
            _pedidosService.ASD();
            return View();
        }

        public ActionResult Buscar(SearchPedidoParameters parameters)
        {
            var queriable = _pedidosService.Buscar();
            if (!string.IsNullOrEmpty(parameters.Nombre))
            {
                queriable = queriable.Where(a => a.Cliente.Nombres.Contains(parameters.Nombre));
            }
            if (!string.IsNullOrEmpty(parameters.Carnet))
            {
                queriable = queriable.Where(a => a.Cliente.Carnet.Contains(parameters.Carnet));
            }
            if (!string.IsNullOrEmpty(parameters.Contenedor))
            {
                queriable = queriable.Where(a => a.Contenedor.Contains(parameters.Contenedor));
            }

            if (parameters.FechaInicio.HasValue && parameters.FechaFin.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha >= parameters.FechaInicio.Value && a.Fecha <= parameters.FechaFin.Value);
            }
            else if (parameters.FechaInicio.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha >= parameters.FechaInicio.Value);
            }
            else if (parameters.FechaFin.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha <= parameters.FechaFin.Value);
            }
            var querySelect = queriable.Select(a => new
            {
                Pedido = new
                {
                    a.Id,
                    a.Descripcion,
                    a.Contenedor,
                    a.Fecha,
                    Cliente = new
                    {
                        a.Cliente.Id,
                        a.Cliente.Carnet,
                        a.Cliente.Nombres,
                        a.Cliente.Apellidos
                    },
                    Estado = new
                    {
                        a.Estado.Id,
                        a.Estado.Nombre
                    }
                }
            });

            var order = parameters.GetEnum(SearchPedidoParameters.PedidoOrderColumn.Nombre);
            switch (order)
            {
                case SearchPedidoParameters.PedidoOrderColumn.Id:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Pedido.Id)
                        : querySelect.OrderByDescending(a => a.Pedido.Id);
                    break;
                case SearchPedidoParameters.PedidoOrderColumn.Nombre:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Pedido.Cliente.Nombres).ThenBy(a=> a.Pedido.Cliente.Apellidos)
                        : querySelect.OrderByDescending(a => a.Pedido.Cliente.Nombres).ThenByDescending(a=> a.Pedido.Cliente.Apellidos);
                    break;
                case SearchPedidoParameters.PedidoOrderColumn.Fecha:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Pedido.Fecha)
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
                    NombreCompleto = (a.Pedido.Cliente.Nombres + ' ' + a.Pedido.Cliente.Apellidos).Trim()
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

        #region PopUps
        public ActionResult PopUpCrear()
        {
            return View();
        }

        #endregion
    }
}