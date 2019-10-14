using System.Collections.Generic;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Parameters.Pedidos;

namespace TransHaruhiko.Services
{
    public interface IPedidosService
    {
        void ASD();
        List<Pedido> Buscar(SearchPedidoParameters parameters);
    }
}