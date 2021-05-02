using System;
using System.IO;
using System.Web.Mvc;
using System.Web.Routing;
using TransHaruhiko.Globalization.Controllers;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pedidos;
using TransHaruhiko.Services;

namespace TransHaruhiko.Controllers
{
    public class FicheroController : Controller
    {
        private readonly IFicherosService _ficherosService;
        private readonly IPedidosService _pedidosService;
        public FicheroController (IFicherosService ficheroService, IPedidosService pedidosService)
        {
            _ficherosService = ficheroService;
            _pedidosService = pedidosService;
        }
        
        public byte[] ReadFully(Stream input)
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
            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }
            parameters.IdUsuario = int.Parse(user.Name);

            var res = _pedidosService.GuardarFichero(parameters);
            
            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            if(transfer.HasErrors || transfer.HasWarnings)
            {
                return Json(transfer);
            }

            var fichero = _ficherosService.Get(parameters.IdPedido.Value, parameters.IdTipo.Value);
            var cambiarEstado = _pedidosService.CambiarEstado(pedidoId, int.Parse(user.Name));

            transfer.Data = new { IdFichero = fichero.Id, EstadoModificado = cambiarEstado, Estado = fichero.Pedido.Estado.Nombre };
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
            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }

            var res = _pedidosService.EliminarFichero(idPedido, idTipo, int.Parse(user.Name));

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            return Json(transfer);
        }
        [Route("DescargarFicheroPago/{idPago}")]
        public ActionResult DescargarFicheroPago(int idPago)
        {
            var res = _ficherosService.GetFicheroPago(idPago);
            var transfer = new FileTransfer();
            if (res.HasErrors)
            {
                return RedirectToError(res.Errors.ToArray());
            }

            transfer.Content = res.Content;
            transfer.FileName = res.FileName;

            return File(transfer);
        }
        [HttpPost]
        [Route("GuardarFicheroTemporal/{pedidoId}/{idTipo}")]
        public ActionResult GuardarFicheroTemporal(int pedidoId, int idTipo)
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
            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }

            var res = _ficherosService.GuardarTemporal(parameters);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);


            //transfer.Data = new { IdFichero = fichero.Id, EstadoModificado = cambiarEstado, Estado = fichero.Pedido.Estado.Nombre };
            return Json(transfer);
        }
        [HttpPost]
        public ActionResult EliminarFicheroTemporal(int idPedido, int idTipo)
        {
            var transfer = new ClientTransfer();
            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }

            var res = _ficherosService.EliminarTemporal(idPedido, idTipo);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);

            return Json(transfer);
        }
        [Route("DescargarFicheroTemporal/{pedidoId}/{idTipo}")]
        public ActionResult DescargarFicheroTemporal(int pedidoId, int idTipo)
        {
            //var transfer = new ClientTransfer();

            var res = _ficherosService.GetFicheroTemporal(pedidoId, idTipo);
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
        public ActionResult CambiarEstado(int idFichero, int idNuevoEstado)
        {
            var transfer = new ClientTransfer();
            var user = User.Identity;
            if (user == null)
            {
                transfer.Errors.Add(CommonControllerStrings.ErrorSinUsuario);
                return Json(transfer);
            }
            var res = _ficherosService.CambiarEstado(idFichero, idNuevoEstado, int.Parse(user.Name));

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);


            var fichero = _ficherosService.Get(idFichero);
            var cambiarEstado = _pedidosService.CambiarEstado(fichero.PedidoId, int.Parse(user.Name));
            var pedido = _pedidosService.Get(fichero.PedidoId);

            transfer.Data = new { EstadoModificado = cambiarEstado, Estado = pedido.Estado.Nombre };
            return Json(transfer);
        }
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