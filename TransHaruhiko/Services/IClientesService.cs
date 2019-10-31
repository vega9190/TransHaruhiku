using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Clientes;

namespace TransHaruhiko.Services
{
    public interface IClientesService
    {
        IQueryable<Cliente> Buscar();
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idCliente);
    }
}