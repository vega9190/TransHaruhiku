using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Observaciones;

namespace TransHaruhiko.Services
{
    public interface IObservacionesService
    {
        IQueryable<Observacion> Buscar();
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idObservacion);
    }
}