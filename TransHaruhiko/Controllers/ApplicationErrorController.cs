using System;
using System.Collections.Generic;
using System.Web.Mvc;


namespace TransHaruhiko.Controllers
{
    public class ApplicationErrorController : Controller
    {
        [Route("ApplicationError/Fatal/{message}", Order = -1)]
        public ActionResult FatalMessage(string message)
        {
            ViewBag.Errors = new List<string>
            {
                "Error al procesar los datos."
            };

            return View("Index");
        }

        [Route("ApplicationError/Fatal/{message1}/{message2}", Order = -1)]
        public ActionResult Fatal(string message1, string message2)
        {
            ViewBag.Errors = new List<string>
            {
                "Error al procesar los datos."
            };

            return View("Index");
        }

        [Route("ApplicationError/Security/{id}", Order = -1)]
        public ActionResult Security(string id)
        {
            ViewBag.Errors = new List<string>
            {
                "Error al acceso de datos."
            };

            return View("Index");
        }
    }
}