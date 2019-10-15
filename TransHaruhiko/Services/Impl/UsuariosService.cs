using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;

namespace TransHaruhiko.Services.Impl
{
    public class UsuariosService : IUsuariosService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public UsuariosService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Usuario Get(string userName, string password)
        {
            return !string.IsNullOrEmpty(password)
                ? _dbContext.Usuarios.FirstOrDefault(a => a.Nickname == userName && a.Pass == password)
                : _dbContext.Usuarios.FirstOrDefault(a => a.Nickname == userName);
        }
    }
}