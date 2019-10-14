using System;
using System.Globalization;
using System.Resources;
using System.Web.Mvc;
using TransHaruhiko.Globalization.Scripts.Common;

namespace TransHaruhiko.Controllers
{
    public class GlobalizationController : Controller
    {
        public ActionResult Index(string modulo, string page)
        {
            ResourceSet resourceSet = null;
            if (string.IsNullOrEmpty(page))
            {
                page = "Common.CommonStrings";
            }
            else
            {
                page = modulo + "." + page + "Strings";
            }

            string resourceTypeName = "TransHaruhiko.Globalization.Scripts." + page;
            try
            {
                ResourceManager languageFile = new ResourceManager(resourceTypeName, typeof(CommonStrings).Assembly);
                resourceSet = languageFile.GetResourceSet(CultureInfo.InvariantCulture, true, true);
            }
            catch (Exception)
            {
                resourceSet = null;
            }
            finally
            {
                ViewBag.i18n = resourceSet;
            }
            Response.AppendHeader("Content-Type", "application/x-javascript");
            return PartialView();
        }
    }
}