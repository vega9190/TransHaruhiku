using System;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using Microsoft.Owin.Security;
using TransHaruhiko.Models.ViewModel;
using TransHaruhiko.Services;
using System.Linq;

namespace TransHaruhiko.Controllers
{
    public class LoginController : Controller
    {
        private readonly IUsuariosService _usuariosService;

        public LoginController(IUsuariosService usuariosService)
        {
            _usuariosService = usuariosService;
        }
        public virtual ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                var usuario = _usuariosService.Get(User.Identity.Name, null);
                var empresas = usuario.UsuarioEmpresas != null && usuario.UsuarioEmpresas.Any()
                ? string.Join(",", usuario.UsuarioEmpresas.Where(a => a.Empresa.Activa).Select(a => a.EmpresaId))
                : "1";
                Session["Rol"] = usuario.Rol.Nombre;
                Session["Nombre"] = usuario.Trabajador.NombreCompleto;
                Session["Empresas"] = empresas;
                return RedirectToAction("Index", "Home");
            }
            else
                return View();
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public virtual ActionResult Index(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var authenticationManager = HttpContext.GetOwinContext().Authentication;


            var usuario = _usuariosService.Get(model.Usuario, model.Contraseña);
            if (usuario == null)
            {
                ModelState.AddModelError(string.Empty, @"Usuario no valido.");
                return View(model);
            }
            var empresas = usuario.UsuarioEmpresas != null && usuario.UsuarioEmpresas.Any() 
                ? string.Join(",", usuario.UsuarioEmpresas.Where(a=> a.Empresa.Activa).Select(a => a.EmpresaId)) 
                : "1";
            var identity = CreateIdentity(/*usuario.Nickname*/usuario.Id.ToString(), usuario.Trabajador.NombreCompleto, usuario.Rol.Nombre, usuario.Id, empresas);

            //authenticationManager.SignOut(MyAuthentication.ApplicationCookie);
            authenticationManager.SignIn(new AuthenticationProperties() { IsPersistent = false }, identity);

            return RedirectToAction("Index", "Home");
        }
        private ClaimsIdentity CreateIdentity(string userPrincipal, string nombre, string roles, int id, string empresas)
        {
            var identity = new ClaimsIdentity(MyAuthentication.ApplicationCookie, ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

            identity.AddClaim(new Claim(ClaimTypes.Name, userPrincipal));
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, userPrincipal));
            identity.Label = userPrincipal;
            
            if (!string.IsNullOrEmpty(roles))
            {

                identity.AddClaim(new Claim(ClaimTypes.Role, roles));

                Session["Rol"] = roles;
                Session["Nombre"] = nombre;
                Session["Empresas"] = empresas;
            }
            else
            {
                throw new Exception("Necesita rol");
            }

            return identity;
        }
        public virtual ActionResult Logoff()
        {
            var authenticationManager = HttpContext.GetOwinContext().Authentication;
            authenticationManager.SignOut(MyAuthentication.ApplicationCookie);

            return RedirectToAction("Index");
        }
    }
}