using System.Collections.Generic;
using System.Linq;

namespace TransHaruhiku.Models.TransferStruct
{
    internal class ClientTransfer
    {
        /// <summary>
        /// Información devuelta al Servidor. El contienido es libre y de tipo anónimo.
        /// 
        /// </summary>
        public object Data { get; set; }

        /// <summary>
        /// Indica si existe algun error en los datos enviados
        /// 
        /// </summary>
        public bool HasErrors => Errors.Any();

        /// <summary>
        /// Indica si existe alguna advertencia en los datos enviados
        /// 
        /// </summary>
        public bool HasWarnings => Warnings.Any();


        /// <summary>
        /// Indica si existe algún mensaje informactivo en los datos enviados
        /// 
        /// </summary>
        public bool HasMessages => Messages.Any();

        /// <summary>
        /// Lista de errores en formato texto
        /// 
        /// </summary>
        public List<string> Errors { get; set; }

        /// <summary>
        /// Lista de warnings en formato texto
        /// 
        /// </summary>
        public List<string> Warnings { get; set; }

        /// <summary>
        /// Lista de items informativos en formato Texto.
        /// 
        /// </summary>
        public List<string> Messages { get; set; }

        public InfoPagination Pagination { get; set; }

        /// <summary>
        /// Construye la instancia por defecto de este tipo. Inicializa las colecciones utilitarias.
        /// 
        /// </summary>
        public ClientTransfer()
        {
            Data = new object();
            Errors = new List<string>();
            Warnings = new List<string>();
            Messages = new List<string>();
            Pagination = new InfoPagination();
        }
    }
}