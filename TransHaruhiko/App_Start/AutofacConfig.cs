using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using TransHaruhiko;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Services;

namespace TransHaruhiko
{
    public class AutofacConfig
    {
        public static IContainer Container { get; set; }

        public static void Configure()
        {
            var builder = new ContainerBuilder();

            // Registro de Servicios
            builder.RegisterAssemblyTypes(typeof(IPedidosService).Assembly)
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope()
                .Where(t => t.Name.EndsWith("Service"))
                .PropertiesAutowired();

            // Registro Controladores
            builder.RegisterControllers(typeof(MvcApplication).Assembly);


            // Registro de DbContext
            builder.RegisterType<TransHaruhikoDbContext>().AsSelf().InstancePerLifetimeScope();
            
            // Registro de dependencias de autofac
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}