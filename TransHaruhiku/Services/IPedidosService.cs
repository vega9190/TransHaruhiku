using System;
using System.Collections.Generic;
using TransHaruhiku.Models.DbModels.Entidades;
using TransHaruhiku.Parameters.Pedidos;

namespace TransHaruhiku.Services
{
    public interface IPedidosService
    {
        void ASD();
        List<Pedido> Buscar(SearchPedidoParameters parameters);
    }
}