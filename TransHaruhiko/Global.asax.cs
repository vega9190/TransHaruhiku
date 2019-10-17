using System.Data.Entity;
using System.Web.Mvc;
using System.Web.Routing;
using log4net;
using TransHaruhiko.Models.DbModels;

namespace TransHaruhiko
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            var logger = LogManager.GetLogger("App");
            logger.Debug("Iniciando proceso de Arranque de la Aplicación.");

            // Modelos de acceso externo a datos de usuario
            Database.SetInitializer<TransHaruhikoDbContext>(null);

            AutofacConfig.Configure();
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            RouteTable.Routes.MapMvcAttributeRoutes();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
