using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
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

        public ActionResult CambiarEstado(int idFichero, int idNuevoEstado)
        {
            var transfer = new ClientTransfer();
            var res = _ficherosService.CambiarEstado(idFichero, idNuevoEstado);

            if (res.HasErrors)
                transfer.Errors.AddRange(res.Errors);
            if (res.HasWarnings)
                transfer.Warnings.AddRange(res.Warnings);
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