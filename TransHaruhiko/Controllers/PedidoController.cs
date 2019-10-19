using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Web.Mvc;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pedidos;
using TransHaruhiko.Services;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Routing;
using System.Web.Script.Serialization;
using TransHaruhiko.CustomHelpers.FileManager;

namespace TransHaruhiko.Controllers
{
    public class PedidoController : Controller
    {
        private readonly IPedidosService _pedidosService;
        private readonly IFicherosService _ficherosService;
        
        public PedidoController(IPedidosService pedidosService, IFicherosService ficherosService)
        {
            _pedidosService = pedidosService;
            _ficherosService = ficherosService;
        }

        public ActionResult List()
        {
            return View();
        }
        public ActionResult Editar(int? id)
        {
            ViewBag.IdPedido = id;
            ViewBag.UploadSizeLimit = 20480;
            return View();
        }
        public ActionResult Buscar(SearchParameters parameters)
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
                        a.Cliente.Apellidos,
                        NombreCompleto = (a.Cliente.Nombres + " " + a.Cliente.Apellidos).Trim()
                    },
                    Estado = new
                    {
                        a.Estado.Id,
                        a.Estado.Nombre
                    }
                }
            });

            var order = parameters.GetEnum(SearchParameters.PedidoOrderColumn.Nombre);
            switch (order)
            {
                case SearchParameters.PedidoOrderColumn.Id:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Pedido.Id)
                        : querySelect.OrderByDescending(a => a.Pedido.Id);
                    break;
                case SearchParameters.PedidoOrderColumn.Nombre:
                    querySelect = parameters.Ascendente
                        ? querySelect.OrderBy(a => a.Pedido.Cliente.Nombres).ThenBy(a=> a.Pedido.Cliente.Apellidos)
                        : querySelect.OrderByDescending(a => a.Pedido.Cliente.Nombres).ThenByDescending(a=> a.Pedido.Cliente.Apellidos);
                    break;
                case SearchParameters.PedidoOrderColumn.Fecha:
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
            var transfer = new ClientTransfer();
            var totalElements = querySelect.Count();
            var totalPages = totalElements / parameters.ItemsPerPage;
            transfer.Data = returnList;
            transfer.Pagination.TotalPages = totalPages + ((totalElements % parameters.ItemsPerPage) > 0 ? 1 : 0);
            transfer.Pagination.TotalRecords = totalElements; //Total de elementos segun filtro
            transfer.Pagination.TotalDisplayRecords = listado.Count; //Total de elementos segun pagina
            return Json(transfer);
        }
        public ActionResult Obtener(int idPedido)
        {
            var transfer = new ClientTransfer();
            var pedido = _pedidosService.Get(idPedido);
            
            
            if(pedido == null)
            {
                return null;
            }
            transfer.Data = new
            {
                Pedido = new
                {
                    pedido.Id,
                    pedido.Direccion,
                    pedido.DireccionUrl,
                    pedido.Contenedor,
                    Cliente = new
                    {
                        pedido.Cliente.Id,
                        pedido.Cliente.Telefono,
                        NombreCompleto = pedido.Cliente.NombreCompleto
                    },
                    Estado = new
                    {
                        pedido.Estado.Id,
                        pedido.Estado.Nombre
                    },
                    Ficheros = pedido.Ficheros.Select(a => new {
                        a.Id,
                        a.Nombre,
                        Estado = new {
                            a.Estado.Id,
                            a.Estado.Nombre
                        },
                        Tipo = new
                        {
                            a.Tipo.Id,
                            a.Tipo.Nombre
                        }
                    })
                }
            };
            
            return Json(transfer);
        }

        public ActionResult Guardar(SaveParameters parameters)
        {
            var transfer = new ClientTransfer();
            var res = _pedidosService.Guardar(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
            return Json(transfer);
        }

        public ActionResult Eliminar(int idPedido)
        {
            var transfer = new ClientTransfer();
            var res = _pedidosService.Eliminar(idPedido);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            return Json(transfer);
        }

        #region Ficheros
        public  byte[] ReadFully(Stream input)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                input.CopyTo(ms);
                return ms.ToArray();
            }
        }

        [HttpPost]
        [Route("GuardarFichero/{pedidoId}/{idTipo}")]
        public ActionResult GuardarFichero(int pedidoId, int idTipo)
        {
            var transfer = new ClientTransfer();
            var parameters = new SaveFicheroParameters();
            if (Request.Files.Count > 0)
            {
                var file = Request.Files[0];
                
                if (file != null && file.ContentLength > 0)
                {
                    if (file.ContentLength / 1024 > 20480)
                    {
                        transfer.Errors.Add("Este fichero ha excedido el tamaño permitido.");
                        return Json(transfer);
                    }
                    var content = ReadFully(file.InputStream);
                    parameters.Content = content;
                    parameters.IdPedido = pedidoId;
                    parameters.IdTipo = idTipo;
                    parameters.Name = file.FileName;
                    parameters.MimeType = file.ContentType;
                }
            }

            var res = _pedidosService.GuardarFichero(parameters);
            var fichero = _ficherosService.Get(parameters.IdPedido.Value, parameters.IdTipo.Value);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            transfer.Data = new { IdFichero = fichero.Id };
            return Json(transfer);
        }
        [Route("DescargarFichero/{pedidoId}/{idTipo}")]
        public ActionResult DescargarFichero(int pedidoId, int idTipo)
        {
            //var transfer = new ClientTransfer();
            
            var res = _pedidosService.GetFichero(pedidoId, idTipo);
            var transfer = new FileTransfer();
            if (res.HasErrors)
            {
                //transfer.Errors.AddRange(res.Errors);
                return RedirectToError(res.Errors.ToArray());
            }

            transfer.Content = res.Content;
            transfer.FileName = res.FileName;
            
            return File(transfer);
        }
        [HttpPost]
        public ActionResult EliminarFichero(int idPedido, int idTipo)
        {
            var transfer = new ClientTransfer();
            var res = _pedidosService.EliminarFichero(idPedido, idTipo);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            return Json(transfer);
        }
        #endregion

        #region PopUps
        public ActionResult PopUpCrear()
        {
            return View();
        }

        public ActionResult PopUpObservacion()
        {
            return View();
        }
        #endregion

        #region Helpers


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
        protected ActionResult File(FileTransfer fileTransfer)
        {
            if (fileTransfer.HasErrors)
                return (ActionResult)this.RedirectToError(fileTransfer.Errors.ToArray());
            string contentType = string.IsNullOrEmpty(fileTransfer.MimeType) ? "defaultDownloadMimeType" : fileTransfer.MimeType;
            return (ActionResult)this.File(fileTransfer.Content, contentType, fileTransfer.FileName);
        }

        #endregion
    }
}