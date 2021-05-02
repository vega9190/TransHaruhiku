using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades.Contabilidad;
using TransHaruhiko.Models.RestModel;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Haberes;

namespace TransHaruhiko.Services
{
    public interface IHaberesService
    {
        IQueryable<Haber> Buscar();
        Haber Get(int idHaber);
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idHaber);
        IQueryable<TipoHaber> GetTiposHaberes();
        IQueryable<ServicioBasico> GetServiciosBasicos();
        CommonRestModel GuardarServicioBasico(string nombre);
    }
}