using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using TransHaruhiko.CustomHelpers.FileManager;
using TransHaruhiko.Globalization.Services;
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
        public Pedido Get(int idPedido)
        {
            return _dbContext.Pedidos.Find(idPedido);
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

            var seguimiento = new Seguimiento
            {
                PedidoId = pedido.Id,
                Fecha = DateTime.Now,
                Descripcion = CommonServiceStrings.TextSegCrearPedido,
                TipoId = (int)TipoSeguimientoEnum.EstadoPedido,
                UsuarioId = parameters.IdUsuario.Value
            };

            _dbContext.Pedidos.Add(pedido);
            _dbContext.Seguimientos.Add(seguimiento);
            _dbContext.SaveChanges();
            return result;
        }

        public BaseResult Eliminar(int idPedido, int idUsuario)
        {
            var result = new BaseResult();
            var pedido = _dbContext.Pedidos.Find(idPedido);
            if (pedido == null)
            {
                result.Errors.Add(PedidoStrings.ErrorNoPedido);
                return result;
            }

            var seguimiento = new Seguimiento
            {
                PedidoId = pedido.Id,
                Fecha = DateTime.Now,
                Descripcion = string.Format(CommonServiceStrings.TextSegCambioEstado, pedido.Estado.Nombre, "Cancelado"),
                TipoId = (int)TipoSeguimientoEnum.EstadoPedido,
                UsuarioId = idUsuario
            };

            pedido.EstadoId = (int) EstadosEnum.Cancelado;

            _dbContext.Seguimientos.Add(seguimiento);
            _dbContext.SaveChanges();
            return result;
        }

        public BaseResult GuardarFichero(SaveFicheroParameters parameters)
        {
            var result = new BaseResult();
            var extension = Path.GetExtension(parameters.Name);
            var pedido = _dbContext.Pedidos.Find(parameters.IdPedido);
            var mimes = _ficherosService.GetMimes();
            var tipoFicheroNuevo = _dbContext.TiposFicheros.Find(parameters.IdTipo);
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
                var rutaArchivo = FileHelper.GetPath(pedido.Id, parameters.IdTipo.Value, extension);
                var ficheroActual = _ficherosService.Get(parameters.IdPedido.Value, parameters.IdTipo.Value);
                if (ficheroActual != null)
                {
                    var rutaFicheroActual = FileHelper.GetPath(pedido.Id, parameters.IdTipo.Value, Path.GetExtension(ficheroActual.Nombre));
                    
                    if (FileHelper.Exist(rutaFicheroActual))
                    {
                        if(!FileHelper.RemoveFile(rutaFicheroActual))
                            result.Errors.Add("El fichero no se puede eliminar.");
                        else
                        {
                            var seguimiento = new Seguimiento
                            {
                                PedidoId = pedido.Id,
                                Fecha = DateTime.Now,
                                Descripcion = string.Format(CommonServiceStrings.TextSegEliminarFichero, ficheroActual.Tipo.Nombre),
                                TipoId = (int)TipoSeguimientoEnum.Documentos,
                                UsuarioId = parameters.IdUsuario.Value
                            };
                            _dbContext.Seguimientos.Add(seguimiento);
                        }
                    }
                    _dbContext.Ficheros.Remove(ficheroActual);
                }

                if(!FileHelper.WriteFile(rutaArchivo, parameters.Content))
                    result.Errors.Add("El fichero no se puede subir.");

                if (result.HasErrors) return result;

                var fichero = new Fichero
                {
                    PedidoId = pedido.Id,
                    TipoId = parameters.IdTipo.Value,
                    EstadoId = (int)FicheroEstadoEnum.Recibido,
                    Nombre = parameters.Name
                };
                var tiposFicherosConEstados = new List<int> { (int)TipoFicheroEnum.FacturaComercial, (int)TipoFicheroEnum.Sicoin, (int)TipoFicheroEnum.Dam, (int)TipoFicheroEnum.Goc, (int)TipoFicheroEnum.Dav, (int)TipoFicheroEnum.Dui };
                var seg = new Seguimiento
                {
                    PedidoId = pedido.Id,
                    Fecha = DateTime.Now,
                    Descripcion = tiposFicherosConEstados.Any(a=> a == tipoFicheroNuevo.Id) ? string.Format(CommonServiceStrings.TextSegCrearFicheroEstado, tipoFicheroNuevo.Nombre)
                    : string.Format(CommonServiceStrings.TextSegCrearFichero, tipoFicheroNuevo.Nombre),
                    TipoId = (int)TipoSeguimientoEnum.Documentos,
                    UsuarioId = parameters.IdUsuario.Value
                };
                _dbContext.Seguimientos.Add(seg);
                _dbContext.Ficheros.Add(fichero);
                               

                _dbContext.SaveChanges();
            }
            
            return result;
        }

        public ResultFileContent GetFichero(int idPedido, int idTipo)
        {
            var result = new ResultFileContent();
            var fichero = _ficherosService.Get(idPedido, idTipo);

            if(fichero == null)
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
        public bool CambiarEstado(int idPedido)
        {
            var cambiarEstado = false;

            var pedido = _dbContext.Pedidos.Find(idPedido);

            switch (pedido.EstadoId){
                case (int)EstadosEnum.Inicio:
                    {
                        var tieneBl = pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.Bl);
                        if (tieneBl)
                        {
                            pedido.EstadoId = (int)EstadosEnum.EnProceso;
                            _dbContext.SaveChanges();
                            cambiarEstado = true;
                        }
                        break;
                    }
                case (int)EstadosEnum.EnProceso:
                    {
                        var tiposFicheros = new List<int> { (int)TipoFicheroEnum.ListaEmpaque, (int)TipoFicheroEnum.FacturaComercial,
                            (int)TipoFicheroEnum.Sicoin, (int)TipoFicheroEnum.Dam, (int)TipoFicheroEnum.Mic,
                            (int)TipoFicheroEnum.Crt,(int)TipoFicheroEnum.Goc };

                        var perimitodCambiarEstado = pedido.Ficheros.All(a => tiposFicheros.Contains(a.TipoId))
                            && pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.FacturaComercial && a.EstadoId == (int)FicheroEstadoEnum.Validado)
                            && pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.Sicoin && a.EstadoId == (int)FicheroEstadoEnum.Validado)
                            && pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.Dam && a.EstadoId == (int)FicheroEstadoEnum.Validado)
                            && pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.Goc && a.EstadoId == (int)FicheroEstadoEnum.Validado);

                        if (perimitodCambiarEstado)
                        {
                            pedido.EstadoId = (int)EstadosEnum.Desaduanizacion;
                            _dbContext.SaveChanges();
                            cambiarEstado = true;
                        }
                        break;
                    }
                case (int)EstadosEnum.Desaduanizacion:
                    {
                        var tiposFicheros = new List<int> { (int)TipoFicheroEnum.Dui, (int)TipoFicheroEnum.Dav };

                        var perimitodCambiarEstado = pedido.Ficheros.All(a => tiposFicheros.Contains(a.TipoId))
                            && pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.Dui && a.EstadoId == (int)FicheroEstadoEnum.Validado)
                            && pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.Dav && a.EstadoId == (int)FicheroEstadoEnum.Validado);

                        if (perimitodCambiarEstado)
                        {
                            pedido.EstadoId = (int)EstadosEnum.Transportadora;
                            _dbContext.SaveChanges();
                            cambiarEstado = true;
                        }
                        break;
                    }
                case (int)EstadosEnum.Transportadora:
                    {
                        var tieneRecibiConforme = pedido.Ficheros.Any(a => a.TipoId == (int)TipoFicheroEnum.RecibiConforme);
                        if (tieneRecibiConforme)
                        {
                            pedido.EstadoId = (int)EstadosEnum.Finalizado;
                            _dbContext.SaveChanges();
                            cambiarEstado = true;
                        }
                        break;
                    }
            }

            return cambiarEstado;
        }
        public BaseResult EliminarFichero(int idPedido, int idTipo, int idUsuario)
        {
            var result = new ResultFileContent();
            var fichero = _ficherosService.Get(idPedido, idTipo);

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
                        
                    
                    var seguimiento = new Seguimiento
                    {
                        PedidoId = idPedido,
                        Fecha = DateTime.Now,
                        Descripcion = string.Format(CommonServiceStrings.TextSegEliminarFichero, fichero.Tipo.Nombre),
                        TipoId = (int)TipoSeguimientoEnum.Documentos,
                        UsuarioId = idUsuario
                    };
                    _dbContext.Seguimientos.Add(seguimiento);
                        
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
        public IQueryable<Seguimiento> BuscarSeguimientos()
        {
            IQueryable<Seguimiento> queriable = _dbContext.Seguimientos;
            return queriable;
        }
    }
}