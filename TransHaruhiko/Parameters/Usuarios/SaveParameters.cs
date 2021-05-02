namespace TransHaruhiko.Parameters.Usuarios
{
    public class SaveParameters
    {
        public int? IdUsuario { get; set; }
        public string Usuario { get; set; }
        public string Pass { get; set; }
        public bool Activo { get; set; }
        public int IdRol { get; set; }
        public int IdTrabajador { get; set; }
    }
}