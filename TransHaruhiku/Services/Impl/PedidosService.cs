using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TransHaruhiku.Models.DbModels;

namespace TransHaruhiku.Services.Impl
{
    public class PedidosService : IPedidosService
    {
        private readonly TransHaruhikuDbContext _dbContext;

        public PedidosService(TransHaruhikuDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void ASD()
        {
            var s = _dbContext.Clientes.Where(a => true).ToList();
            var sd = "asd";
        }
    }
}