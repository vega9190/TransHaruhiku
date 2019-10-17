using System.Collections.Generic;

namespace TransHaruhiko.Models.TransferStruct
{
    public class ResultFileContent : BaseResult
    {
        /// <summary>Nombre del Archivo (Debe contener la extensión)</summary>
        public string FileName { get; set; }

        /// <summary>Tipos MIME del Archivo.</summary>
        public IEnumerable<string> MimeTypes { get; set; }

        /// <summary>Contenido binario del Archivo.</summary>
        public byte[] Content { get; set; }
    }
}