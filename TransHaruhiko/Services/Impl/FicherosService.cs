using System;
using System.Collections.Generic;
using System.Linq;
using TransHaruhiko.Globalization.Services;
using TransHaruhiko.Globalization.Services.Ficheros;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.Enum;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Ficheros;

namespace TransHaruhiko.Services.Impl
{
    public class FicherosService : IFicherosService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public FicherosService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Fichero Get(int idFichero)
        {
            return _dbContext.Ficheros.Find(idFichero);
        }
        public Fichero Get(int idPedido, int idTipoFichero)
        {
            return _dbContext.Ficheros.FirstOrDefault(a=> a.PedidoId == idPedido && a.TipoId == idTipoFichero);
        }

        public BaseResult Guardar(Fichero fichero)
        {
            var result = new BaseResult();
            _dbContext.Ficheros.Add(fichero);
            _dbContext.SaveChanges();
            return result;
        }

        public BaseResult Eliminar(int idFichero)
        {
            var result = new BaseResult();
            var fichero = _dbContext.Ficheros.Find(idFichero);
            if (fichero == null)
            {
                result.Errors.Add(FicheroStrings.ErrorNoFichero);
                return result;
            }

            _dbContext.Ficheros.Remove(fichero);
            _dbContext.SaveChanges();
            return result;
        }

        public List<TipoMime> GetMimes()
        {
            var mimes = _dbContext.TiposMimes.Where(a => true).ToList();
            return mimes;
        }
        public List<EstadoFichero> GetEstadosPermitidos(int idEstado)
        {
            var estados = (int)FicheroEstadoEnum.Recibido == idEstado ? _dbContext.EstadosFicheros.Where(a => a.Id != idEstado).ToList() : new List<EstadoFichero>();
            return estados;
        }
        public BaseResult CambiarEstado(int idFichero, int idNuevoEstado, int idUsuario)
        {
            var result = new BaseResult();
            var fichero = _dbContext.Ficheros.Find(idFichero);
            if (fichero == null)
            {
                result.Errors.Add(FicheroStrings.ErrorNoFichero);
                return result;
            }
            var estadoNuevo = _dbContext.EstadosFicheros.Find(idNuevoEstado);
            var seguimiento = new Seguimiento
            {
                Fecha = DateTime.Now,
                PedidoId = fichero.PedidoId,
                TipoId = (int)TipoSeguimientoEnum.EstadoFichero,
                Descripcion = string.Format(CommonServiceStrings.TextSegCambioEstadoFichero, fichero.Tipo.Nombre, fichero.Estado.Nombre, estadoNuevo.Nombre),
                UsuarioId = idUsuario
            };
            fichero.EstadoId = idNuevoEstado;
            _dbContext.Seguimientos.Add(seguimiento);
            _dbContext.SaveChanges();
            return result;
        }
    }
}