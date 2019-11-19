using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Contenedores;

namespace TransHaruhiko.Services
{
    public interface IContenedoresService
    {
        IQueryable<Contenedor> Buscar();
        IQueryable<DespachoContenedor> BuscarDetalle();
        Contenedor Get(int idContenedor);
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idContenedor);
    }
}