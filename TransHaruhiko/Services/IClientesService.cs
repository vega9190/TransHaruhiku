using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;

namespace TransHaruhiko.Services
{
    public interface IClientesService
    {
        IQueryable<Cliente> GetClientes();
    }
}