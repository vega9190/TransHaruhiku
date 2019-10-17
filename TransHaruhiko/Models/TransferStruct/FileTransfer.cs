namespace TransHaruhiko.Models.TransferStruct
{
    public class FileTransfer : ClientTransfer
    {
        public string FileName { get; set; }

        /// <summary>Conmtenido Binario del Fichero</summary>
        public byte[] Content { get; set; }

        /// <summary>Tipo MIME del contenido (puede dejarse vacío o null)</summary>
        public string MimeType { get; set; }

        /// <summary>
        /// En caso de referirse a una referencia en Servidor, contiene la ruta hacia este.
        /// </summary>
        public string FilePath { get; set; }
    }
}