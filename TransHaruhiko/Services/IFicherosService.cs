using System.Collections.Generic;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Ficheros;
using TransHaruhiko.Parameters.Pedidos;

namespace TransHaruhiko.Services
{
    public interface IFicherosService
    {
        Fichero Get(int idFichero);
        Fichero Get(int idPedido, int idTipoFichero);
        BaseResult Guardar(Fichero parameters);
        BaseResult Eliminar(int idFichero);
        BaseResult GuardarTemporal(SaveFicheroParameters parameters);
        BaseResult EliminarTemporal(int idPedido, int idTipo);
        ResultFileContent GetFicheroTemporal(int idPedido, int idTipo);
        ResultFileContent GetFicheroPago(int idPago);
        List<TipoMime> GetMimes();
        List<EstadoFichero> GetEstadosPermitidos(int idEstado);
        BaseResult CambiarEstado(int idFichero, int idNuevoEstado, int idUsuario);
    }
}