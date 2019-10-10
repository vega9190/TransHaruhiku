using System.Web.Mvc;
using TransHaruhiku.Services;

namespace TransHaruhiku.Controllers
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
    }
}