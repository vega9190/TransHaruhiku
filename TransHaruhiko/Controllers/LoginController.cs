using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Services;

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
            return View();
        }
        public ActionResult ValidarUsuario(string nickName, string password)
        {
            var transfer = new ClientTransfer();
            if (Session != null)
            {
                Session["EsAdministrador"] = false;
                Session["Usuario"] = null;
            }
            
            
            var usuario = _usuariosService.Get(nickName, password);
            if (usuario == null)
            {
                transfer.Errors.Add("Usuario o contraseña incorrectos");
            }
            if (usuario.Rol.Nombre.Equals("Administrador"))
                Session["EsAdministrador"] = true;

            Session["Usuario"] = usuario;
            FormsAuthentication.SetAuthCookie(usuario.Trabajador.Nombres + " " + usuario.Trabajador.Apellidos, true);
            return Json(transfer);
        }
    }
}