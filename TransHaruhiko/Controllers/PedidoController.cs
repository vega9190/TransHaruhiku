using System.Web.Mvc;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Services;

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

        public ActionResult Buscar()
        {
            var transfer = new ClientTransfer();

            return Json(transfer);
        }
    }
}