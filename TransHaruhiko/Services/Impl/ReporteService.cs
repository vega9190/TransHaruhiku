using System;
using System.Collections.Generic;
using Microsoft.Reporting.WebForms;
using System.Web;
using TransHaruhiko.Models.DbModels;
using System.IO;
using TransHaruhiko.Reportes;
using TransHaruhiko.Models.DbModels.Dto.Reportes;
using TransHaruhiko.Reportes.Specification;

namespace TransHaruhiko.Services.Impl
{
    public class ReporteService : IReportesService
    {
        private readonly TransHaruhikoDbContext _dbContext;
        public ReporteService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void GenerarRecibiConforme(int idPedido, HttpResponseBase response)
        {
            var localReport = GetReporte(idPedido);
            ProcesadorReporte.GenerarWord(localReport, "RecibiConforme", response);
        }
        private LocalReport GetReporte(int idPedido)
        {
            var localReport = new LocalReport();
            var memory = new MemoryStream(ReportesResources.RecibiConforme);
            localReport.LoadReportDefinition(memory);
            
            var pedido = _dbContext.Pedidos.Find(idPedido);

            var datosPedido = new List<RecibiConformeDto>
            {
                new RecibiConformeDto {
                    NombreCompleto = pedido.Cliente.NombreCompleto,
                    Contenedor = string.IsNullOrEmpty(pedido.Contenedor) ? "" : pedido.Contenedor,
                    Descripcion = pedido.Descripcion,
                    Direccion = string.IsNullOrEmpty(pedido.Direccion) ? "" : pedido.Direccion,
                    Telefono = pedido.Cliente.Telefono,
                    LugarFecha = $"Santa Cruz - {DateTime.Now.Day} de {DateTime.Now.ToString("MMMM")} del {DateTime.Now.Year}"
                }
            };
            
            localReport.DataSources.Clear();
            ////Agregar nuevo ReportDataSource con el nombre y lista correspondiente.
            localReport.DataSources.Add(new ReportDataSource("DatosPedido", datosPedido));
            return localReport;
        }
    }
}