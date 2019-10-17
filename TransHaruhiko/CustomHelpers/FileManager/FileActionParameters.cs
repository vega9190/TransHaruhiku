using System.IO;

namespace TransHaruhiko.CustomHelpers.FileManager
{
    public class FileActionParameters
    {
        public string Name { get; set; }

        /// <summary>contenido binario del fichero.</summary>
        public byte[] Content { get; set; }

        /// <summary>Tipo MIME del archivo (en caso de especificarse)</summary>
        public string MimeType { get; set; }

        /// <summary>
        /// Establecer el contenido del Fichero a partir de un Flujo de Entrada.
        /// </summary>
        /// <param name="inputStream">Flujo de datos con el contenido del Fichero</param>
        public void SetContent(Stream inputStream)
        {
            this.Content = new byte[inputStream.Length];
            inputStream.Read(this.Content, 0, this.Content.Length);
        }
    }
}