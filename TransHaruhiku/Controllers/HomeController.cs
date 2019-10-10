using System.Web.Mvc;

namespace TransHaruhiku.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}