using System.Collections.Generic;
using System.Linq;
using TransHaruhiko.Models.DbModels.Entidades;
using TransHaruhiko.Models.TransferStruct;
using TransHaruhiko.Parameters.Pedidos;

namespace TransHaruhiko.Services
{
    public interface IPedidosService
    {
        IQueryable<Pedido> Buscar();
        BaseResult Guardar(SaveParameters parameters);
        BaseResult GuardarPrecio(SaveParameters parameters);
        BaseResult GuardarParteRecepcion(SaveParameters parameters);
        BaseResult Eliminar(int idPedido, int idUsuario);
        BaseResult GuardarFichero(SaveFicheroParameters parameters);
        ResultFileContent GetFichero(int idPedido, int idTipo);
        BaseResult EliminarFichero(int idPedido, int idTipo, int idUsuario);
        Pedido Get(int idPedido);
        IQueryable<Seguimiento> BuscarSeguimientos();
        IQueryable<Empresa> BuscarEmpresas();
        Empresa ObtenerEmpresaPorDefento(string id);
        bool CambiarEstado(int idPedido, int idUsuario);
    }
}