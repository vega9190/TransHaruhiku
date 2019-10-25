using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pagos;

namespace TransHaruhiko.Services
{
    public interface IPagosService
    {
        IQueryable<Pago> Buscar();
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idPago, int idUsuario);
    }
}