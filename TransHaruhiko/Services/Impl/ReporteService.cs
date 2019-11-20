using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using Microsoft.Reporting.WebForms;
using System.Web;
using TransHaruhiko.Models.DbModels;
using System.IO;
using System.Linq;
using TransHaruhiko.Reportes;
using TransHaruhiko.Models.DbModels.Dto.Reportes;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Reportes.Specification;

namespace TransHaruhiko.Services.Impl
{
    public class ReporteService : IReportesService
    {
        private readonly TransHaruhikoDbContext _dbContext;
        private List<Contenedor> _tempContenedores;
        public ReporteService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void GenerarRecibiConforme(int idPedido, HttpResponseBase response)
        {
            var localReport = GetReporteRecibiConforme(idPedido);
            ProcesadorReporte.GenerarWord(localReport, "RecibiConforme", response);
        }

        public void GenerarPlanillaDespacho(int idPedido, HttpResponseBase response)
        {
            var localReport = GetReportePlanillaDespacho(idPedido);
            ProcesadorReporte.GenerarExcel(localReport, "PlanillaDespacho", response);
        }
        private LocalReport GetReporteRecibiConforme(int idPedido)
        {
            var localReport = new LocalReport();
            var memory = new MemoryStream(ReportesResources.RecibiConforme);
            localReport.LoadReportDefinition(memory);
            
            var pedido = _dbContext.Pedidos.Find(idPedido);
            
            var datosPedido = new List<RecibiConformeDto>
            {
                new RecibiConformeDto {
                    NombreCompleto = pedido.Cliente.NombreCompleto,
                    Contenedor = pedido.Contenedores.Any() ? string.Join(", ", pedido.Contenedores.Select(a=> a.Codigo)) : "",
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
        private LocalReport GetReportePlanillaDespacho(int idPedido)
        {
            var pedido = _dbContext.Pedidos.Find(idPedido);

            var contenedores = pedido.Contenedores.Where(a => a.DespachoContenedores.Any()).ToList();

            _tempContenedores = contenedores;

            var datosCabecera = new List<PlanillaDespachoDto>
            {
                new PlanillaDespachoDto
                {
                    NombreCompleto = pedido.Cliente.NombreCompleto,
                    NitCi = pedido.Cliente.Carnet,
                    Descripcion = pedido.Descripcion,
                    Poliza = string.Join(" - ", contenedores.Select(a => a.Poliza)),
                    LugarFecha =
                        $"Santa Cruz - {DateTime.Now.Day} de {DateTime.Now.ToString("MMMM")} del {DateTime.Now.Year}",
                    TotalPedido = contenedores.Sum(a=> a.DespachoContenedores.Sum(b=> b.Precio))
                }
            };

            var datosContenedores = new List<ContenedorDto>();

            foreach (var contenedor in contenedores)
            {
                var datoContenedor = new ContenedorDto
                {
                    IdContenedor = contenedor.Id,
                    Nombre = contenedor.Nombre,
                    Poliza = contenedor.Poliza,
                    TotalContenedor = contenedor.DespachoContenedores.Sum(a=> a.Precio)
                };
                datosContenedores.Add(datoContenedor);
            }

            var localReport = new LocalReport();
            localReport.SubreportProcessing += SubReporteDetalleContenedor;

            localReport.DataSources.Clear();
            var memory = new MemoryStream(ReportesResources.PlanillaDespacho);
            var subMemory = new MemoryStream(ReportesResources.SubDetalleContenedor);
            localReport.LoadReportDefinition(memory);
            localReport.LoadSubreportDefinition("SubDetalleContenedor", subMemory);

            ////Agregar nuevo ReportDataSource con el nombre y lista correspondiente.
            localReport.DataSources.Add(new ReportDataSource("PlantillaDespacho", datosCabecera));
            localReport.DataSources.Add(new ReportDataSource("Contenedor", datosContenedores));
            return localReport;
        }
        private void SubReporteDetalleContenedor(object sender, SubreportProcessingEventArgs e)
        {
            var detallesContenedores = new List<DetalleContenedorDto>();

            var idContenedor = int.Parse(e.Parameters[0].Values[0]);

            var contenedor = _tempContenedores.First(a => a.Id == idContenedor);

            foreach (var detalleContenedor in contenedor.DespachoContenedores)
            {
                var detalle = new DetalleContenedorDto
                {
                    Concepto = detalleContenedor.Concepto,
                    Precio = detalleContenedor.Precio
                };
                detallesContenedores.Add(detalle);
            }

            e.DataSources.Clear();
            e.DataSources.Add(new ReportDataSource("DetalleContenedor", detallesContenedores));
        }
    }
}