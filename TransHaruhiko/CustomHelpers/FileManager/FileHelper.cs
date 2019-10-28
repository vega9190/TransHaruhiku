using System.Configuration;
using System.IO;
using TransHaruhiko.Globalization.Services.Ficheros;
using TransHaruhiko.Models.Enum;

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
        public static string GetPath(int idPedido, int idTipo, string extension)
        {
            var rutaArchivo = "";
            switch (idTipo)
            {
                case (int)TipoFicheroEnum.ListaEmpaque:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "ListaEmpaque");
                    break;
                case (int)TipoFicheroEnum.FacturaComercial:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "FacturaComercial");
                    break;
                case (int)TipoFicheroEnum.Sicoin:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Sicoin");
                    break;
                case (int)TipoFicheroEnum.Dam:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Dam");
                    break;
                case (int)TipoFicheroEnum.Mic:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Mic");
                    break;
                case (int)TipoFicheroEnum.Crt:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Crt");
                    break;
                case (int)TipoFicheroEnum.Goc:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Goc");
                    break;
                case (int)TipoFicheroEnum.Dui:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Dui");
                    break;
                case (int)TipoFicheroEnum.Dav:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Dav");
                    break;
                case (int)TipoFicheroEnum.RecibiConforme:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "RecibiConforme");
                    break;
                case (int)TipoFicheroEnum.Imagenes:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Imagenes");
                    break;
                case (int)TipoFicheroEnum.Bl:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Bl");
                    break;
                case (int)TipoFicheroEnum.Temporal:
                    rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFichero, idPedido,
                            extension, "Temporal");
                    break;
            }
            return rutaArchivo;
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