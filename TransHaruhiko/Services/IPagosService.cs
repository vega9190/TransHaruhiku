using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.RestModel;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pagos;
using TransHaruhiko.Parameters.TiposPagos;

namespace TransHaruhiko.Services
{
    public interface IPagosService
    {
        IQueryable<TipoPago> GetTiposPagos();
        IQueryable<TipoMoneda> GetTiposMonedas();
        IQueryable<Pago> Buscar();
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idPago, int idUsuario);
        CommonRestModel GuardarTipoPago(SaveTipoParameters parameters);
    }
}