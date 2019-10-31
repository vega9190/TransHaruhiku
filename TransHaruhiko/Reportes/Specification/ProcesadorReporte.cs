using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TransHaruhiko.Reportes.Specification
{
    public enum FormatoReporte
    {
        PDF,
        EXCEL,
        WORD
    }

    public class ProcesadorReporte
    {
        public static void Generar_PDF(LocalReport localReport, string carpeta, string filename, FormatoReporte formato)
        {
            string reportType = formato == FormatoReporte.PDF ?
                                "PDF" :
                                    formato == FormatoReporte.EXCEL ?
                                        "EXCEL" : "WORD";
            string mimeType;
            string encoding;
            string fileNameExtension;

            string deviceInfo =
            "<DeviceInfo>" +
            "  <OutputFormat>" + reportType + "</OutputFormat>" +  //"  <OutputFormat>PDF</OutputFormat>" +
            "</DeviceInfo>";

            Warning[] warnings;
            string[] streams;
            byte[] renderedBytes;

            renderedBytes = localReport.Render(reportType,
                                               deviceInfo,
                                               out mimeType,
                                               out encoding,
                                               out fileNameExtension,
                                               out streams,
                                               out warnings);
        }

        public static void Generar(LocalReport localReport, string filename, FormatoReporte formato, HttpResponseBase response)
        {
            string reportType = formato == FormatoReporte.PDF ?
                                "PDF" :
                                    formato == FormatoReporte.EXCEL ?
                                        "EXCEL" : "WORD";
            string mimeType;
            string encoding;
            string fileNameExtension;

            string deviceInfo =
            "<DeviceInfo>" +
            "  <OutputFormat>" + reportType + "</OutputFormat>" +  //"  <OutputFormat>PDF</OutputFormat>" +
            "</DeviceInfo>";

            Warning[] warnings;
            string[] streams;
            byte[] renderedBytes;
            localReport.EnableHyperlinks = true;

            renderedBytes = localReport.Render(reportType,
                                               deviceInfo,
                                               out mimeType,
                                               out encoding,
                                               out fileNameExtension,
                                               out streams,
                                               out warnings);

            response.Clear();
            response.ContentType = mimeType;
            response.AddHeader("content-disposition", "attachment; filename=" + filename + "." + fileNameExtension);
            response.BinaryWrite(renderedBytes);
            response.End();
        }

        public static void GenerarPDF(LocalReport localReport, string filename, HttpResponseBase response)
        {
            Generar(localReport, filename, FormatoReporte.PDF, response);
        }

        public static void GenerarExcel(LocalReport localReport, string filename, HttpResponseBase response)
        {
            Generar(localReport, filename, FormatoReporte.EXCEL, response);
        }

        public static void GenerarWord(LocalReport localReport, string filename, HttpResponseBase response)
        {
            Generar(localReport, filename, FormatoReporte.WORD, response);
        }

        //OBTENER REPORTE EN BINARIO

        private static byte[] GetFile(LocalReport localReport, string filename, FormatoReporte formato)
        {
            string reportType = formato == FormatoReporte.PDF ?
                                "PDF" :
                                    formato == FormatoReporte.EXCEL ?
                                        "EXCEL" : "WORD";
            string mimeType;
            string encoding;
            string fileNameExtension;

            string deviceInfo =
            "<DeviceInfo>" +
            "  <OutputFormat>" + reportType + "</OutputFormat>" +  //"  <OutputFormat>PDF</OutputFormat>" +
            "</DeviceInfo>";

            Warning[] warnings;
            string[] streams;
            byte[] renderedBytes;
            localReport.EnableHyperlinks = true;

            renderedBytes = localReport.Render(reportType,
                                               deviceInfo,
                                               out mimeType,
                                               out encoding,
                                               out fileNameExtension,
                                               out streams,
                                               out warnings);

            return renderedBytes;
        }

        public static byte[] GetFilePDF(LocalReport localReport, string filename)
        {
            return GetFile(localReport, filename, FormatoReporte.PDF);
        }

        public static byte[] GetFileExcel(LocalReport localReport, string filename)
        {
            return GetFile(localReport, filename, FormatoReporte.EXCEL);
        }

        public static byte[] GetFileWord(LocalReport localReport, string filename)
        {
            return GetFile(localReport, filename, FormatoReporte.WORD);
        }
    }
}