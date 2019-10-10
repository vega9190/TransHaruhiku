using System.Data.Entity;
using System.Web.Mvc;
using System.Web.Routing;
using log4net;
using TransHaruhiku.Models.DbModels;

namespace TransHaruhiku
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            var logger = LogManager.GetLogger("App");
            logger.Debug("Iniciando proceso de Arranque de la Aplicación.");

            // Modelos de acceso externo a datos de usuario
            Database.SetInitializer<TransHaruhikuDbContext>(null);

            AutofacConfig.Configure();
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
