using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Clientes;

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
        public BaseResult Guardar(SaveParameters parameters)
        {
            var result = new BaseResult();
            if (parameters.IdCliente.HasValue)
            {
                var cliente = _dbContext.Clientes.Find(parameters.IdCliente);
                cliente.Carnet = parameters.Carnet;
                cliente.Apellidos = parameters.Apellidos;
                cliente.Nombres = parameters.Nombres;
                cliente.Direccion = parameters.Direccion;
                cliente.Telefono = parameters.Telefono;
                cliente.Email = parameters.Email;
            }
            else
            {
                var cliente = new Cliente
                {
                    Carnet = parameters.Carnet,
                    Nombres = parameters.Nombres,
                    Apellidos = parameters.Apellidos,
                    Direccion = parameters.Direccion,
                    Telefono = parameters.Telefono,
                    Email = parameters.Email,
                    Activo = true
                };

                _dbContext.Clientes.Add(cliente);
            }
            _dbContext.SaveChanges();
            return result;
        }
        public BaseResult Eliminar(int idCliente)
        {
            var result = new BaseResult();

            var cliente = _dbContext.Clientes.Find(idCliente);

            cliente.Activo = false;

            _dbContext.SaveChanges();
            return result;
        }
    }
}