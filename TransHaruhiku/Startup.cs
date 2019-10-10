using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TransHaruhiku.Startup))]
namespace TransHaruhiku
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
