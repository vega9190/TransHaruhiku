using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Polizas;

namespace TransHaruhiko.Services
{
    public interface IPolizasService
    {
        IQueryable<Poliza> Buscar();
        IQueryable<DetallePoliza> BuscarDetalle();
        Poliza Get(int idPoliza);
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idPoliza);
    }
}