using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Contenedores;

namespace TransHaruhiko.Services
{
    public interface IContenedoresService
    {
        IQueryable<Contenedor> Buscar();
        BaseResult Guardar(SaveParameters parameters);
        BaseResult Eliminar(int idContenedor);
    }
}