using System.Configuration;
using System.IO;

namespace TransHaruhiko.CustomHelpers.FileManager
{
    public static class FileHelper
    {
        private static string GetFullPath(string rutaFichero)
        {
            var rutaAbsoluta = ConfigurationManager.AppSettings["files.absolutePath"];
            var rutaCompleta = rutaFichero == Path.GetFullPath(rutaFichero)
                ? rutaFichero
                : (rutaAbsoluta + rutaFichero).Replace("/", "\\");
            return rutaCompleta;
        }
        public static bool Exist(string rutaFichero)
        {
            var ruta = GetFullPath(rutaFichero);
            if (!File.Exists(ruta))
                return Directory.Exists(ruta);
            return true;
        }

        public static bool RemoveFile(string rutaFichero)
        {
            var ruta = GetFullPath(rutaFichero);
            if (!File.Exists(ruta))
                return false;
            File.Delete(ruta);
            return true;
        }

        public static bool WriteFile(string rutaFichero, byte[] content)
        {
            var ruta = GetFullPath(rutaFichero);
            if (!Directory.Exists(Path.GetDirectoryName(ruta)))
                Directory.CreateDirectory(Path.GetDirectoryName(ruta));
            using (var fileStream = new FileStream(ruta, FileMode.Create, FileAccess.ReadWrite))
                fileStream.Write(content, 0, content.Length);
            return true;
        }

        public static byte[] ReadFile(string rutaFichero)
        {
            var ruta = GetFullPath(rutaFichero);
            if (!File.Exists(ruta))
                return (byte[])null;
            return File.ReadAllBytes(ruta);
        }
    }
}