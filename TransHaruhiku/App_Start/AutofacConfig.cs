using Autofac;
using TransHaruhiku.Models.DbModels;

namespace TransHaruhiku.App_Start
{
    public class AutofacConfig
    {
        public static IContainer Container { get; set; }

        public static void Configure()
        {
            var builder = new ContainerBuilder();
         

            // Registro de Servicios
            //builder.RegisterAssemblyTypes(typeof(IExpedientesService).Assembly)
            //    .AsImplementedInterfaces()
            //    .InstancePerLifetimeScope()
            //    .Where(t => t.Name.EndsWith("Service"))
            //    .PropertiesAutowired();


            // Registro de DbContext
            builder.RegisterType<TransHaruhikuDbContext>().AsSelf().InstancePerLifetimeScope();

            Container = builder.Build();
        }
    }
}