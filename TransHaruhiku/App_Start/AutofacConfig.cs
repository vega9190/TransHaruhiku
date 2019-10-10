using System.Reflection;
using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using TransHaruhiku.Controllers;
using TransHaruhiku.Models.DbModels;
using TransHaruhiku.Services;
using TransHaruhiku.Services.Impl;

namespace TransHaruhiku
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
            builder.RegisterType<TransHaruhikuDbContext>().AsSelf().InstancePerLifetimeScope();
            
            // Registro de dependencias de autofac
            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}