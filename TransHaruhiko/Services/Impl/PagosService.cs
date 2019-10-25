using System;
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
        public PagosService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IQueryable<Pago> Buscar()
        {
            return _dbContext.Pagos;
        }
        public BaseResult Guardar(SaveParameters parameters)
        {
            return null;
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