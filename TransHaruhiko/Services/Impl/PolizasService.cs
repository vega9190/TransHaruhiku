using System.Globalization;
using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Polizas;

namespace TransHaruhiko.Services.Impl
{
    public class PolizasService : IPolizasService
    {
        private readonly TransHaruhikoDbContext _dbContext;
        public PolizasService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Poliza> Buscar()
        {
            IQueryable<Poliza> queriable = _dbContext.Polizas;
            return queriable;
        }
        public IQueryable<DetallePoliza> BuscarDetalle()
        {
            IQueryable<DetallePoliza> queriable = _dbContext.DetallePolizas;
            return queriable;
        }
        public Poliza Get(int idPoliza)
        {
            return _dbContext.Polizas.Find(idPoliza);
        }
        public BaseResult Guardar(SaveParameters parameters)
        {
            var result = new BaseResult();
            if (parameters.IdPoliza.HasValue)
            {
                var poliza = _dbContext.Polizas.Find(parameters.IdPoliza);
                poliza.Codigo = parameters.Codigo;
                poliza.Nombre = string.IsNullOrEmpty(parameters.Nombre) ? "" : parameters.Nombre;

                if (parameters.Detalles != null && parameters.Detalles.Any())
                {
                    var detallePolizas = _dbContext.DetallePolizas.Where(a => a.PolizaId == parameters.IdPoliza).ToList();
                    _dbContext.DetallePolizas.RemoveRange(detallePolizas);

                    foreach (var detallePoliza in parameters.Detalles)
                    {
                        var detalle = new DetallePoliza
                        {
                            Concepto = detallePoliza.Concepto,
                            Precio = decimal.Parse(detallePoliza.Precio, CultureInfo.InvariantCulture),
                            PolizaId = parameters.IdPoliza.Value
                        };
                        _dbContext.DetallePolizas.Add(detalle);
                    }
                }
            }
            else
            {
                var poliza = new Poliza
                {
                    Codigo = parameters.Codigo,
                    Nombre = string.IsNullOrEmpty(parameters.Nombre) ? "" : parameters.Nombre,
                    PedidoId = parameters.IdPedido
                };

                _dbContext.Polizas.Add(poliza);
                if (parameters.Detalles != null && parameters.Detalles.Any())
                {
                    foreach (var despachoContenedor in parameters.Detalles)
                    {
                        var detalle = new DetallePoliza
                        {
                            Concepto = despachoContenedor.Concepto,
                            Precio = decimal.Parse(despachoContenedor.Precio, CultureInfo.InvariantCulture),
                            PolizaId = poliza.Id
                        };
                        _dbContext.DetallePolizas.Add(detalle);
                    }
                }
            }
            _dbContext.SaveChanges();
            return result;
        }
        public BaseResult Eliminar(int idPoliza)
        {
            var result = new BaseResult();
            var poliza = _dbContext.Polizas.Find(idPoliza);
            if (poliza == null)
            {
                result.Errors.Add("No existe la póliza.");
                return result;
            }
            var detallePolizas = _dbContext.DetallePolizas.Where(a => a.PolizaId == poliza.Id).ToList();

            _dbContext.DetallePolizas.RemoveRange(detallePolizas);
            _dbContext.Polizas.Remove(poliza);
            _dbContext.SaveChanges();
            return result;
        }
    }
}