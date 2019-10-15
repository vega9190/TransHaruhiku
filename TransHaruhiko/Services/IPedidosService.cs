using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pedidos;

namespace TransHaruhiko.Services
{
    public interface IPedidosService
    {
        IQueryable<Pedido> Buscar();
        BaseResult Guardar(SaveParameters parameters);
    }
}