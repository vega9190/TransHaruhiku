using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;

namespace TransHaruhiko.Services.Impl
{
    public class ClienteService :IClientesService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public ClienteService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Cliente> Buscar()
        {
            return _dbContext.Clientes;
        }
    }
}