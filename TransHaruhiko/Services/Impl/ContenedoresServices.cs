using System.Globalization;
using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Contenedores;

namespace TransHaruhiko.Services.Impl
{
    public class ContenedoresServices : IContenedoresService
    {
        private readonly TransHaruhikoDbContext _dbContext;
        public ContenedoresServices(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Contenedor> Buscar()
        {
            IQueryable<Contenedor> queriable = _dbContext.Contenedores;
            return queriable;
        }
        public BaseResult Guardar(SaveParameters parameters)
        {
            var result = new BaseResult();
            if (parameters.IdContenedor.HasValue)
            {
                var contenedor = _dbContext.Contenedores.Find(parameters.IdContenedor);
                contenedor.Codigo = parameters.Codigo;
                contenedor.Nombre = parameters.Nombre;
                contenedor.Poliza = parameters.Poliza;

                var despachoContenedores = _dbContext.DespachoContenedores.Where(a => a.ContenedorId == parameters.IdContenedor).ToList();
                _dbContext.DespachoContenedores.RemoveRange(despachoContenedores);

                foreach(var despachoContenedor in parameters.Despachos)
                {
                    var despacho = new DespachoContenedor
                    {
                        Concepto = despachoContenedor.Concepto,
                        Precio = decimal.Parse(despachoContenedor.Precio, CultureInfo.InvariantCulture),
                        ContenedorId = parameters.IdContenedor.Value
                    };
                    _dbContext.DespachoContenedores.Add(despacho);
                }
            }
            else
            {
                var contenedor = new Contenedor
                {
                    Codigo = parameters.Codigo,
                    Nombre = parameters.Nombre,
                    Poliza = parameters.Poliza,
                    PedidoId = parameters.IdPedido
                };

                _dbContext.Contenedores.Add(contenedor);
                foreach (var despachoContenedor in parameters.Despachos)
                {
                    var despacho = new DespachoContenedor
                    {
                        Concepto = despachoContenedor.Concepto,
                        Precio = decimal.Parse(despachoContenedor.Precio, CultureInfo.InvariantCulture),
                        ContenedorId = contenedor.Id
                    };
                    _dbContext.DespachoContenedores.Add(despacho);
                }
            }
            _dbContext.SaveChanges();
            return result;
        }
        public BaseResult Eliminar(int idContenedor)
        {
            var result = new BaseResult();
            var contenedor = _dbContext.Contenedores.Find(idContenedor);
            if (contenedor == null)
            {
                result.Errors.Add("No existe el contenedor");
                return result;
            }
            var despachoContenedores = _dbContext.DespachoContenedores.Where(a => a.ContenedorId == contenedor.Id).ToList();

            _dbContext.DespachoContenedores.RemoveRange(despachoContenedores);
            _dbContext.Contenedores.Remove(contenedor);
            _dbContext.SaveChanges();
            return result;
        }
    }
}