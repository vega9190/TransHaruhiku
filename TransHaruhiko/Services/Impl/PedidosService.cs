using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using TransHaruhiko.CustomHelpers.FileManager;
using TransHaruhiko.Globalization.Services.Ficheros;
using TransHaruhiko.Globalization.Services.Pedidos;
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
        private readonly IFicherosService _ficherosService;

        public PedidosService(TransHaruhikoDbContext dbContext, IFicherosService ficherosService)
        {
            _dbContext = dbContext;
            _ficherosService = ficherosService;
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
                Contenedor = parameters.Contenedor,
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

        public BaseResult Eliminar(int idPedido)
        {
            var result = new BaseResult();
            var pedido = _dbContext.Pedidos.Find(idPedido);
            if (pedido == null)
            {
                result.Errors.Add(PedidoStrings.ErrorNoPedido);
                return result;
            }

            pedido.EstadoId = (int) EstadosEnum.Cancelado;

            _dbContext.SaveChanges();
            return result;
        }

        public BaseResult GuardarFicheroBl(SaveFicheroParameters parameters)
        {
            var result = new BaseResult();
            var extension = Path.GetExtension(parameters.Name);
            var pedido = _dbContext.Pedidos.Find(parameters.IdPedido);
            var mimes = _ficherosService.GetMimes();
            if (!mimes.Any(a =>
                a.Nombre.Contains(parameters.MimeType) && a.Extension.Contains(extension?.ToLower() ?? "")))
            {
                result.Errors.Add("Fichero no válido.");
            }else if (pedido == null)
            {
                result.Errors.Add("No existe el pedido.");
            }
            else
            {
                var rutaArchivo = string.Format(PlantillasGestionFicherosStrings.DirectorioFicheroBL, pedido.Id,
                    extension);
                var ficheroActual = _ficherosService.Get(pedido.Id, (int) TipoFicheroEnum.Bl);
                if (ficheroActual != null)
                {
                    var rutaFicheroActual = string.Format(PlantillasGestionFicherosStrings.DirectorioFicheroBL, pedido.Id,
                        Path.GetExtension(ficheroActual.Nombre));

                    if (FileHelper.Exist(rutaFicheroActual))
                    {
                        if(!FileHelper.RemoveFile(rutaFicheroActual))
                            result.Errors.Add("El fichero no se puede eliminar.");
                    }
                    _dbContext.Ficheros.Remove(ficheroActual);
                }

                if(!FileHelper.WriteFile(rutaArchivo, parameters.Content))
                    result.Errors.Add("El fichero no se puede subir.");

                if (result.HasErrors) return result;

                var fichero = new Fichero
                {
                    PedidoId = pedido.Id,
                    TipoId = (int)TipoFicheroEnum.Bl,
                    EstadoId = (int)FicheroEstadoEnum.Recibido,
                    Nombre = parameters.Name
                };
                _dbContext.Ficheros.Add(fichero);
                _dbContext.SaveChanges();
            }
            return result;
        }

        public ResultFileContent GetFicheroBl(int idPedido)
        {
            var result = new ResultFileContent();
            var fichero = _ficherosService.Get(idPedido, (int) TipoFicheroEnum.Bl);

            if(fichero == null)
                result.Errors.Add("No existe el fichero del pedido");
            else
            {
                var rutaFichero = string.Format(PlantillasGestionFicherosStrings.DirectorioFicheroBL, idPedido,
                    Path.GetExtension(fichero.Nombre));
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

        public BaseResult EliminarFicheroBl(int idPedido)
        {
            var result = new ResultFileContent();
            var fichero = _ficherosService.Get(idPedido, (int)TipoFicheroEnum.Bl);

            if (fichero == null)
                result.Errors.Add("No existe el fichero del pedido");
            else
            {
                var rutaFichero = string.Format(PlantillasGestionFicherosStrings.DirectorioFicheroBL, idPedido,
                    Path.GetExtension(fichero.Nombre));
                if (FileHelper.Exist(rutaFichero))
                {
                    if(!FileHelper.RemoveFile(rutaFichero))
                        result.Errors.Add("El fichero no se puede eliminar.");
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
    }
}