namespace TransHaruhiko.Parameters.Pedidos
{
    public class SaveParameters
    {
        public int? IdPedido { get; set; }
        public int IdEmpresa { get; set; }
        public int IdCliente { get; set; }
        public string Descripcion { get; set; }
        public string Direccion { get; set; }
        public string DireccionUrl { get; set; }
        public int? IdUsuario { get; set; }
        public string Precio { get; set; }
        public bool? ParteRecepcion { get; set; }
        public string Contenedor { get; set; }
    }
}