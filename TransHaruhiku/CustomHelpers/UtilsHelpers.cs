using System;
using System.Web.Mvc;

namespace TransHaruhiku.CustomHelpers
{
    public static class UtilsHelpers
    {
        public static string ContentNoCache(this UrlHelper urlHelper, string contentPath)
        {
            var url = System.Configuration.ConfigurationManager.AppSettings["RecursosVista"];
            long ran = DateTime.Now.Ticks;

            return contentPath.Substring(0, 2).Equals("~/")
                ? urlHelper.Content(contentPath + "?v=" + ran)
                : url + contentPath + "?v=" + ran;
        }
        public static string ContentCache(this UrlHelper urlHelper, string contentPath)
        {
            var url = System.Configuration.ConfigurationManager.AppSettings["RecursosVista"];
            return contentPath.Substring(0, 2).Equals("~/")
                ? urlHelper.Content(contentPath)
                : url + contentPath;
        }
    }
}