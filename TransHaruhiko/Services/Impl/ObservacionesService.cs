using System;
using System.Linq;
using TransHaruhiko.Globalization.Services.Observaciones;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Observaciones;

namespace TransHaruhiko.Services.Impl
{
    public class ObservacionesService : IObservacionesService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public ObservacionesService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Observacion> Buscar()
        {
            return _dbContext.Observaciones;
        }

        public BaseResult Guardar(SaveParameters parameters)
        {
            var result = new BaseResult();

            var usuario = _dbContext.Usuarios.Find(parameters.IdUsuario);
            if (usuario == null)
            {
                result.Errors.Add(ObservacionStrings.ErrorNoUsuario);
                return result;
            }

            if (parameters.IdObservacion.HasValue)
            {
                var observacion = _dbContext.Observaciones.Find(parameters.IdObservacion.Value);
                if (observacion == null)
                {
                    result.Errors.Add(ObservacionStrings.ErrorNoObservacion);
                    return result;
                }

                observacion.UsuarioId = usuario.Id;
                observacion.Fecha = DateTime.Now;
                observacion.Descripcion = parameters.Descripcion;
            }
            else
            {
                var observacion = new Observacion
                {
                    PedidoId = parameters.IdPedido,
                    Descripcion = parameters.Descripcion,
                    Fecha = DateTime.Now,
                    UsuarioId = usuario.Id
                };
                _dbContext.Observaciones.Add(observacion);
            }
            
            _dbContext.SaveChanges();
            return result;
        }

        public BaseResult Eliminar(int idObservacion)
        {
            var result = new BaseResult();
            var observacion = _dbContext.Observaciones.Find(idObservacion);
            if (observacion == null)
            {
                result.Errors.Add(ObservacionStrings.ErrorNoObservacion);
                return result;
            }

            _dbContext.Observaciones.Remove(observacion);
            _dbContext.SaveChanges();
            return result;
        }
    }
}