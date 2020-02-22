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
        private List<Poliza> _tempPolizas;
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
            ProcesadorReporte.GenerarWord(localReport, "PlanillaDespacho", response);
        }
        private LocalReport GetReporteRecibiConforme(int idPedido)
        {
            var localReport = new LocalReport();
            var memory = new MemoryStream(ReportesResources.RecibiConforme);
            localReport.LoadReportDefinition(memory);
            
            var pedido = _dbContext.Pedidos.Find(idPedido);
            var polizas = pedido.Polizas.Where(a => a.DetallePolizas.Any()).ToList();

            var datosPedido = new List<RecibiConformeDto>
            {
                new RecibiConformeDto {
                    NombreCompleto = pedido.Cliente.NombreCompleto,
                    Contenedor = string.IsNullOrEmpty(pedido.Contenedores) ? "" : pedido.Contenedores,
                    Descripcion = pedido.Descripcion,
                    Direccion = string.IsNullOrEmpty(pedido.Direccion) ? "" : pedido.Direccion,
                    Telefono = pedido.Cliente.Telefono,
                    LugarFecha = $"Santa Cruz - {DateTime.Now.Day} de {DateTime.Now.ToString("MMMM")} del {DateTime.Now.Year}",
                    Poliza = string.Join(" - ", polizas.Select(a => a.Codigo))
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

            var polizas = pedido.Polizas.Where(a => a.DetallePolizas.Any()).ToList();

            _tempPolizas = polizas;

            var datosCabecera = new List<PlanillaDespachoDto>
            {
                new PlanillaDespachoDto
                {
                    NombreCompleto = pedido.Cliente.NombreCompleto,
                    NitCi = pedido.Cliente.Carnet,
                    Descripcion = string.IsNullOrEmpty(pedido.Contenedores) ? "": pedido.Contenedores,
                    Poliza = string.Join(" - ", polizas.Select(a => a.Codigo)),
                    LugarFecha =
                        $"Santa Cruz - {DateTime.Now.Day} de {DateTime.Now.ToString("MMMM")} del {DateTime.Now.Year}",
                    TotalPedido = polizas.Sum(a=> a.DetallePolizas.Sum(b=> b.Precio))
                }
            };

            var datosPolizas = new List<PolizaDto>();

            foreach (var poliza in polizas)
            {
                var datoPoliza = new PolizaDto
                {
                    IdPoliza = poliza.Id,
                    Nombre = poliza.Nombre,
                    Codigo = poliza.Codigo,
                    TotalPoliza = poliza.DetallePolizas.Sum(a=> a.Precio)
                };
                datosPolizas.Add(datoPoliza);
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
            localReport.DataSources.Add(new ReportDataSource("Poliza", datosPolizas));
            return localReport;
        }
        private void SubReporteDetalleContenedor(object sender, SubreportProcessingEventArgs e)
        {
            var detallesContenedores = new List<DetallePolizaDto>();

            var idPoliza = int.Parse(e.Parameters[0].Values[0]);

            var poliza = _tempPolizas.First(a => a.Id == idPoliza);

            foreach (var detallePoliza in poliza.DetallePolizas)
            {
                var detalle = new DetallePolizaDto
                {
                    Concepto = detallePoliza.Concepto,
                    Precio = detallePoliza.Precio
                };
                detallesContenedores.Add(detalle);
            }

            e.DataSources.Clear();
            e.DataSources.Add(new ReportDataSource("DetalleContenedor", detallesContenedores));
        }
    }
}