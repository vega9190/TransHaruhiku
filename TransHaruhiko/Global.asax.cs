using System.Data.Entity;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using log4net;
using TransHaruhiko.Models.DbModels;
using Autofac;
using Autofac.Integration.WebApi;
using TransHaruhiko.App_Start;
using Autofac.Integration.Mvc;

namespace TransHaruhiko
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            var logger = LogManager.GetLogger("App");
            logger.Debug("Iniciando proceso de Arranque de la Aplicación.");
            AutofacConfig.Configure();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(AutofacConfig.Container));
            GlobalConfiguration.Configure(config =>
            {
                config.MapHttpAttributeRoutes();

                var updater = new ContainerBuilder();
                updater.RegisterApiControllers(typeof(MvcApplication).Assembly);
                updater.Update(AutofacConfig.Container);
                config.DependencyResolver = new AutofacWebApiDependencyResolver(AutofacConfig.Container);
                WebApiConfig.Register(config);
            });
            // Modelos de acceso externo a datos de usuario
            Database.SetInitializer<TransHaruhikoDbContext>(null);

            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            RouteTable.Routes.MapMvcAttributeRoutes();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
