using System.Collections.Generic;
using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Parameters.Pedidos;

namespace TransHaruhiko.Services.Impl
{
    public class PedidosService : IPedidosService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public PedidosService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void ASD()
        {
            var s = _dbContext.Clientes.Where(a => true).ToList();
            var sd = "asd";
        }

        public List<Pedido> Buscar(SearchPedidoParameters parameters)
        {
            IQueryable<Pedido> queriable = _dbContext.Pedidos;
            
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
            if (parameters.FechaInicio.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha >= parameters.FechaInicio.Value);
            }
            if (parameters.FechaFin.HasValue)
            {
                queriable = queriable.Where(a => a.Fecha <= parameters.FechaFin.Value);
            }

            var querySelect = queriable.Select(a => new
            {
                Pedido = new
                {
                    a.Id,
                    a.Contenedor,
                    a.Fecha,
                    Cliente = new
                    {
                        a.Cliente.Id,
                        a.Cliente.Carnet,
                        NombreCompleto = (a.Cliente.Nombres + ' ' + a.Cliente.Apellidos).Trim()
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
                        ? querySelect.OrderBy(a => a.Pedido.Cliente.NombreCompleto)
                        : querySelect.OrderByDescending(a => a.Pedido.Cliente.NombreCompleto);
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
                    FechaPedido = a.Pedido.Fecha.ToString("dd/MM/yyyy")
                };
                return returnData;
            });
            
            //var totalElements = querySelect.Count();
            //var totalPages = totalElements / parameters.ItemsPerPage;
            //transfer.Data = returnList;
            //transfer.Pagination.TotalPages = totalPages + ((totalElements % parameters.ItemsPerPage) > 0 ? 1 : 0);
            //transfer.Pagination.TotalRecords = totalElements; //Total de elementos segun filtro
            //transfer.Pagination.TotalDisplayRecords = listado.Count; //Total de elementos segun pagina
            //return Json(transfer);
            return null;
        }
    }
}