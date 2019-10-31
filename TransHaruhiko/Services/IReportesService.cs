using System.Web;

namespace TransHaruhiko.Services
{
    public interface IReportesService
    {
        void GenerarRecibiConforme(int idPedido, HttpResponseBase response);
    }
}