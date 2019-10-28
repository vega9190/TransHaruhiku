using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using TransHaruhiko.CustomHelpers.FileManager;
using TransHaruhiko.Globalization.Services;
using TransHaruhiko.Globalization.Services.Ficheros;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.Enum;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Ficheros;
using TransHaruhiko.Parameters.Pedidos;

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
        public BaseResult GuardarTemporal(SaveFicheroParameters parameters)
        {
            var result = new BaseResult();
            var extension = Path.GetExtension(parameters.Name);
            var pedido = _dbContext.Pedidos.Find(parameters.IdPedido);
            var mimes = GetMimes();
            var tipoFicheroNuevo = _dbContext.TiposFicheros.Find(parameters.IdTipo);
            if (!mimes.Any(a =>
                a.Nombre.Contains(parameters.MimeType) && a.Extension.Contains(extension?.ToLower() ?? "")))
            {
                result.Errors.Add("Fichero no válido.");
            }
            else if (pedido == null)
            {
                result.Errors.Add("No existe el pedido.");
            }
            else
            {
                var rutaArchivo = FileHelper.GetPath(pedido.Id, parameters.IdTipo.Value, extension);
                var ficheroActual = Get(parameters.IdPedido.Value, parameters.IdTipo.Value);
                if (ficheroActual != null)
                {
                    var rutaFicheroActual = FileHelper.GetPath(pedido.Id, parameters.IdTipo.Value, Path.GetExtension(ficheroActual.Nombre));

                    if (FileHelper.Exist(rutaFicheroActual))
                    {
                        if (!FileHelper.RemoveFile(rutaFicheroActual))
                            result.Errors.Add("El fichero no se puede eliminar.");
                    }
                    _dbContext.Ficheros.Remove(ficheroActual);
                }

                if (!FileHelper.WriteFile(rutaArchivo, parameters.Content))
                    result.Errors.Add("El fichero no se puede subir.");

                if (result.HasErrors) return result;

                var fichero = new Fichero
                {
                    PedidoId = pedido.Id,
                    TipoId = parameters.IdTipo.Value,
                    EstadoId = (int)FicheroEstadoEnum.Recibido,
                    Nombre = parameters.Name
                };

                _dbContext.Ficheros.Add(fichero);
                _dbContext.SaveChanges();
            }

            return result;
        }

        public BaseResult EliminarTemporal(int idPedido, int idTipo)
        {
            var result = new ResultFileContent();
            var fichero = Get(idPedido, idTipo);

            if (fichero == null)
                result.Errors.Add("No existe el fichero del pedido");
            else
            {
                var rutaFichero = FileHelper.GetPath(idPedido, idTipo, Path.GetExtension(fichero.Nombre));

                if (FileHelper.Exist(rutaFichero))
                {
                    if (!FileHelper.RemoveFile(rutaFichero))
                    {
                        result.Errors.Add("El fichero no se puede eliminar.");
                        return result;
                    }
                    _dbContext.Ficheros.Remove(fichero);
                    _dbContext.SaveChanges();
                }
                else
                {
                    result.Errors.Add("No existe el fichero del pedido");
                }
            }

            return result;
        }
        public ResultFileContent GetFicheroTemporal(int idPedido, int idTipo)
        {
            var result = new ResultFileContent();
            var fichero = Get(idPedido, idTipo);

            if (fichero == null)
                result.Errors.Add("No existe el fichero del pedido");
            else
            {
                var rutaFichero = FileHelper.GetPath(idPedido, idTipo, Path.GetExtension(fichero.Nombre));

                if (FileHelper.Exist(rutaFichero))
                {
                    result.FileName = fichero.Nombre;
                    result.Content = FileHelper.ReadFile(rutaFichero);
                }
                else
                {
                    result.Errors.Add("No existe el fichero del pedido");
                }
            }

            return result;
        }
        public ResultFileContent GetFicheroPago(int idPago)
        {
            var result = new ResultFileContent();
            var pago = _dbContext.Pagos.Find(idPago);
            
            if (pago == null)
                result.Errors.Add("No existe el fichero del pedido");
            else
            {
                var rutaFichero = string.Format(PlantillasGestionFicherosStrings.DirectorioFicheroPago, pago.PedidoId, pago.Tipo.Nombre, pago.Id,
                            Path.GetExtension(pago.NombreFile));

                if (FileHelper.Exist(rutaFichero))
                {
                    result.FileName = pago.NombreFile;
                    result.Content = FileHelper.ReadFile(rutaFichero);
                }
                else
                {
                    result.Errors.Add("No existe el fichero del pedido");
                }
            }

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