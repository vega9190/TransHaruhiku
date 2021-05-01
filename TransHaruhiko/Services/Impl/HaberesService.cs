using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades.Contabilidad;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Haberes;

namespace TransHaruhiko.Services.Impl
{
    public class HaberesService : IHaberesService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public HaberesService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IQueryable<Haber> Buscar()
        {
            IQueryable<Haber> queriable = _dbContext.Haberes;
            return queriable;
        }
        public Haber Get(int idHaber)
        {
            return _dbContext.Haberes.Find(idHaber);
        }
        public BaseResult Guardar(SaveParameters parameters)
        {
            var result = new BaseResult();
            if (parameters.IdHaber.HasValue)
            {
                var haber = _dbContext.Haberes.Find(parameters.IdHaber);
                haber.TipoHaberId = parameters.IdTipoHaber;
                haber.TipoMonedaId = parameters.IdTipoMoneda;
                haber.ServicioBasicoId = parameters.IdServicioBasico;
                haber.Fecha = parameters.Fecha;
                if (!string.IsNullOrEmpty(parameters.Observacion))
                    haber.Observacion = parameters.Observacion;
                if (!string.IsNullOrEmpty(parameters.Monto))
                    haber.Monto = decimal.Parse(parameters.Monto);
            }
            else
            {
                var haber = new Haber
                {
                    EmpresaId = parameters.IdEmpresa,
                    TipoHaberId = parameters.IdTipoHaber,
                    TipoMonedaId = parameters.IdTipoMoneda,
                    ServicioBasicoId = parameters.IdServicioBasico,
                    Fecha = parameters.Fecha,
                    Monto = decimal.Parse(parameters.Monto.Replace('.',',')),
                    Observacion = parameters.Observacion ?? "",
                };

                _dbContext.Haberes.Add(haber);
            }
            _dbContext.SaveChanges();
            return result;
        }
        public BaseResult Eliminar(int idHaber)
        {
            var res = new BaseResult();
       
            var haber = _dbContext.Haberes.Find(idHaber);
            _dbContext.Haberes.Remove(haber);
            _dbContext.SaveChanges();
            return res;
        }
        public IQueryable<TipoHaber> GetTiposHaberes()
        {
            IQueryable<TipoHaber> queriable = _dbContext.TiposHaberes;
            return queriable;
        }
        public IQueryable<ServicioBasico> GetServiciosBasicos()
        {
            IQueryable<ServicioBasico> queriable = _dbContext.ServiciosBasicos;
            return queriable;
        }
    }
}