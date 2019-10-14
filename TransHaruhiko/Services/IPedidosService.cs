using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;

namespace TransHaruhiko.Services
{
    public interface IPedidosService
    {
        void ASD();
        IQueryable<Pedido> Buscar();
    }
}