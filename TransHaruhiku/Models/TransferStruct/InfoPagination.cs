namespace TransHaruhiku.Models.TransferStruct
{
    /// <summary>
    /// Estructur auxliar organizativa de los datos de Paginación transferidos al Cliente Web
    /// </summary>
    public class InfoPagination
    {
        /// <summary>
        /// Total de Páginas de los resultados
        /// </summary>
        public int TotalPages { get; set; }
        /// <summary>
        /// Total de elementos.
        /// </summary>
        public int TotalRecords { get; set; }
        /// <summary>
        /// Total de elementos a mostrar.
        /// </summary>
        public int TotalDisplayRecords { get; set; }

        /// <summary>
        /// Constructor por defecto.
        /// </summary>
        public InfoPagination()
        {
            TotalPages = 0;
            TotalRecords = 0;
            TotalDisplayRecords = 0;
        }
    }
}