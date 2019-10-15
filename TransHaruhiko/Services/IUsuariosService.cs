using TransHaruhiko.Models.DbModels.Entidades;

namespace TransHaruhiko.Services
{
    public interface IUsuariosService
    {
        Usuario Get(string userName, string password);
    }
}