using System;
using System.Collections.Generic;
using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.Enum;
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
        
        public IQueryable<Pedido> Buscar()
        {
            IQueryable<Pedido> queriable = _dbContext.Pedidos;
            return queriable;
        }

        public BaseResult Guardar(SaveParameters parameters)
        {
            var result = new BaseResult();

            var pedido = new Pedido
            {
                ClienteId = parameters.IdCliente,
                Descripcion = parameters.Descripcion,
                Direccion = parameters.Direccion,
                DireccionUrl = parameters.DireccionUrl,
                Fecha = DateTime.Now,
                EstadoId = (int)EstadosEnum.Inicio
            };
            _dbContext.Pedidos.Add(pedido);
            _dbContext.SaveChanges();
            return result;
        }
    }
}