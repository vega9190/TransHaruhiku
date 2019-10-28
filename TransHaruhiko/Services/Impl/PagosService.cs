using System;
using System.Globalization;
using System.IO;
using System.Linq;
using TransHaruhiko.CustomHelpers.FileManager;
using TransHaruhiko.Globalization.Services;
using TransHaruhiko.Globalization.Services.Ficheros;
using TransHaruhiko.Globalization.Services.Pagos;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.Enum;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pagos;

namespace TransHaruhiko.Services.Impl
{
    public class PagosService : IPagosService
    {
        private readonly TransHaruhikoDbContext _dbContext;
        private readonly IFicherosService _ficherosService;
        public PagosService(TransHaruhikoDbContext dbContext, IFicherosService ficherosService)
        {
            _dbContext = dbContext;
            _ficherosService = ficherosService;
        }
        public IQueryable<TipoPago> GetTiposPagos()
        {
            return _dbContext.TiposPagos;
        }
        public IQueryable<TipoMoneda> GetTiposMonedas()
        {
            return _dbContext.TiposMonedas;
        }
        public IQueryable<Pago> Buscar()
        {
            return _dbContext.Pagos;
        }
        public BaseResult Guardar(SaveParameters parameters)
        {
            var result = new BaseResult();
            
            var ficheroData = _ficherosService.GetFicheroTemporal(parameters.IdPedido, (int)TipoFicheroEnum.Temporal);
            var tipoPago = _dbContext.TiposPagos.Find(parameters.IdTipo);

            var pago = new Pago
            {
                Fecha = DateTime.Now,
                Monto = decimal.Parse(parameters.Monto, CultureInfo.InvariantCulture),
                NombreFile = ficheroData.FileName,
                TipoId = parameters.IdTipo,
                PedidoId = parameters.IdPedido,
                UsuarioId = parameters.IdUsuario,
                TipoMonedaId = parameters.IdTipoMoneda
            };

            var seguimiento = new Seguimiento
            {
                PedidoId = parameters.IdPedido,
                Fecha = DateTime.Now,
                Descripcion = string.Format(CommonServiceStrings.TextSegCrearPago, tipoPago.Nombre),
                TipoId = (int)TipoSeguimientoEnum.Pagos,
                UsuarioId = parameters.IdUsuario
            };
            _dbContext.Seguimientos.Add(seguimiento);
            _dbContext.Pagos.Add(pago);
            _dbContext.SaveChanges();

            //var pagoNew = _dbContext.Pagos.Find(pago.Id);

            var rutaFichero = string.Format(PlantillasGestionFicherosStrings.DirectorioFicheroPago, parameters.IdPedido, tipoPago.Nombre, pago.Id,
                            Path.GetExtension(ficheroData.FileName));

            if (!FileHelper.WriteFile(rutaFichero, ficheroData.Content))
                result.Errors.Add("El fichero no se puede subir.");

            _ficherosService.EliminarTemporal(pago.PedidoId, parameters.IdTipo);

            return result;
        }
        public BaseResult Eliminar(int idPago, int idUsuario)
        {
            var result = new BaseResult();
            var pago = _dbContext.Pagos.Find(idPago);
            if (pago == null)
            {
                result.Errors.Add(PagoStrings.ErrorNoPago);
                return result;
            }

            var rutaFichero = string.Format(PlantillasGestionFicherosStrings.DirectorioFicheroPago, pago.PedidoId, pago.Tipo.Nombre, pago.Id,
                            Path.GetExtension(pago.NombreFile));

            if (FileHelper.Exist(rutaFichero))
            {
                if (!FileHelper.RemoveFile(rutaFichero))
                {
                    result.Errors.Add("El fichero no se puede eliminar.");
                    return result;
                }


                var seguimiento = new Seguimiento
                {
                    PedidoId = pago.PedidoId,
                    Fecha = DateTime.Now,
                    Descripcion = string.Format(CommonServiceStrings.TextSegEliminarPago, pago.Tipo.Nombre),
                    TipoId = (int)TipoSeguimientoEnum.Pagos,
                    UsuarioId = idUsuario
                };
                _dbContext.Seguimientos.Add(seguimiento);

                _dbContext.Pagos.Remove(pago);
                _dbContext.SaveChanges();
            }
            else
            {
                result.Errors.Add("No existe el fichero del pedido");
            }

            return result;
        }
    }
}