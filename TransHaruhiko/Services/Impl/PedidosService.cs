using System.Collections.Generic;
using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pedidos;

namespace TransHaruhiko.Services.Impl
{
    public class PedidosService : IPedidosService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public PedidosService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void ASD()
        {
            var s = _dbContext.Clientes.Where(a => true).ToList();
            var sd = "asd";
        }

        public IQueryable<Pedido> Buscar()
        {
            IQueryable<Pedido> queriable = _dbContext.Pedidos;
            return queriable;
        }
    }
}