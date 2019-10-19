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
        BaseResult Eliminar(int idPedido);
        BaseResult GuardarFichero(SaveFicheroParameters parameters);
        ResultFileContent GetFichero(int idPedido, int idTipo);
        BaseResult EliminarFichero(int idPedido, int idTipo);
        Pedido Get(int idPedido);
    }
}