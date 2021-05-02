using System;
using System.Web;
using TransHaruhiko.Parameters.Haberes;

namespace TransHaruhiko.Services
{
    public interface IReportesService
    {
        void GenerarRecibiConforme(int idPedido, HttpResponseBase response);
        void GenerarPlanillaDespacho(int idPedido, HttpResponseBase response);
        void GenerarInformeServicioBasico(long fechaDesde, long fechaHasta, HttpResponseBase response);
    }
}