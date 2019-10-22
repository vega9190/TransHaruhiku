var IdPedido = null;
var swSeguimientos = false;
var TipoFicheroEnum = {
    ListaEmpaque: 1,
    FacturaComercial: 2,
    Sicoin: 3,
    Dam: 4,
    Mic: 5,
    Crt: 6,
    Goc: 7,
    Dui: 8,
    Dav: 9,
    RecibiConforme: 10,
    Imagenes: 11,
    Bl: 12
};

var EstadoPedidoEnum = {
    Inicio: 1,
    EnProceso: 2,
    Desaduanizacion: 3,
    Transportadora: 4,
    Finalizado: 5,
    Cancelado: 6
};

var EstadoFicheroEnum = {
    Recibido: 1,
    Validado: 2,
    ConErrores: 3
}

$(document).ready(function () {
    IdPedido = $('#hd-id-pedido').val();
    $('#btn-volver').button();
    $('#btn-volver').click(function () {
        window.location.href = SiteUrl + 'Pedido/List';
    });

    CargarFileuploadFicheroBL();
    CargarFileuploadFicheroImagenes();
    CargarFileuploadFicheroFacturaComercial();
    CargarFileuploadFicheroListaEmpaque();
    CargarFileuploadFicheroFacturaSicoin();
    CargarFileuploadFicheroFacturaDam();
    CargarFileuploadFicheroMic();
    CargarFileuploadFicheroCrt();
    CargarFileuploadFicheroGoc();
    CargarFileuploadFicheroDui();
    CargarFileuploadFicheroDav();
    CargarFileuploadFicheroRecibiConforme();
    CargarPedido();
    //$(".tabs").tabs("option", "disabled", [0]);
    //$(".tabs").tabs("enable", 0);
    //$(".tabs").tabs({ active: 5 });
    $('.tabs').tabs('option', 'beforeActivate', function (event, ui) {
        switch (ui.newPanel.selector) {
            case '#tab-seguimientos':
                if (!swSeguimientos) {
                    CargarSeguimientos();
                    swSeguimientos = true;
                }
                break;
          
        }
    });
});


/**
 * cargar pedido
 */
function CargarPedido() {
    $.ajax({
        url: SiteUrl + 'Pedido/Obtener',
        data: $.toJSON({ idPedido: IdPedido }),
        success: function (data) {
            $.unblockUI();
            if (data.HasErrors) {
                showErrors(data.Errors);
            } else {
                if (data.HasWarnings) {
                    showCustomErrors({
                        title: Globalize.localize('TextInformacion'),
                        warnings: data.Warnings
                    });
                } else {
                    $('#lb-cliente').text(data.Data.Pedido.Cliente.NombreCompleto);
                    $('#lb-estado').text(data.Data.Pedido.Estado.Nombre);
                    $('#lb-telefono').text(data.Data.Pedido.Cliente.Telefono);
                    $('#txt-direccion').val(data.Data.Pedido.Direccion);
                    $('#txt-direccion-url').val(data.Data.Pedido.DireccionUrl);
                    $('#txt-contenedor').val(data.Data.Pedido.Contenedor);

                    CargarTabs(data.Data.Pedido.Estado.Id);

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Bl);
                    if (ficheroIndex >= 0) {
                        $('#box-fichero-bl').remove();
                        var lista = $('#box-fichero-text-bl');

                        lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Bl);
                    } else {
                        $('#box-fichero-text-bl').remove();
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Imagenes);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.Finalizado) {
                            $('#div-fichero-imagenes').remove();
                            var lista = $('#a-imagenes');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href',
                                    SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Imagenes);
                        } else {
                            $('#frm-fichero-imagenes').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Imagenes
                                });
                        }
                    } 

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.ListaEmpaque);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.EnProceso) {
                            $('#frm-fichero-lista-empaque').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.ListaEmpaque,
                                });
                        } else {
                            $('#div-fichero-lista-empaque').remove();
                            var lista = $('#a-lista-empaque');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.ListaEmpaque);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.FacturaComercial);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.EnProceso) {
                            $('#frm-fichero-factura-comercial').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl +
                                        'DescargarFichero/' +
                                        IdPedido +
                                        '/' +
                                        TipoFicheroEnum.FacturaComercial,
                                });
                            var boxEstado = $('#box-estado-factura-comercial');
                            var tempEstado = $('<span class="menu-estado" />');
                            boxEstado.append(
                                tempEstado
                                .data('data',
                                    {
                                        Id: data.Data.Pedido.Ficheros[ficheroIndex].Estado.Id
                                    })
                                .text(data.Data.Pedido.Ficheros[ficheroIndex].Estado.Nombre)
                                .contextMenu({
                                    fnClick: function() {
                                        var itemMenu = $(this);
                                        var params = new Object();
                                        params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                        params.IdNuevoEstado = itemMenu.data('data').Id;

                                        $.ajax({
                                            url: SiteUrl + 'Fichero/CambiarEstado',
                                            data: $.toJSON(params),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    tempEstado.text(itemMenu.data('data').Descripcion);
                                                    if (!isNull($('#tb-seguimientos').data().ifTable))
                                                        $('#tb-seguimientos').table('update');
                                                    tempEstado.data('data',
                                                        {
                                                            Id: itemMenu.data('data').Id
                                                        });
                                                }
                                            }
                                        });

                                        return false;
                                    },
                                    fnLoadServerData: function(callbackRender) {
                                        $.ajax({
                                            url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                            data: $.toJSON({
                                                idEstadoActual: tempEstado.data('data').Id
                                            }),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    callbackRender($.map(data.Data,
                                                        function(item) {
                                                            return {
                                                                value: item.Descripcion,
                                                                data: item
                                                            }
                                                        }));
                                                }
                                            }
                                        });
                                    }
                                }));
                        } else {
                            $('#div-fichero-factura-comercial').remove();
                            var lista = $('#a-factura-comercial');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.FacturaComercial);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Sicoin);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.EnProceso) {
                            $('#frm-fichero-sicoin').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Sicoin,
                                });
                            var boxEstado = $('#box-estado-sicoin');
                            var tempEstado = $('<span class="menu-estado" />');
                            boxEstado.append(
                                tempEstado
                                .data('data',
                                    {
                                        Id: data.Data.Pedido.Ficheros[ficheroIndex].Estado.Id
                                    })
                                .text(data.Data.Pedido.Ficheros[ficheroIndex].Estado.Nombre)
                                .contextMenu({
                                    fnClick: function() {
                                        var itemMenu = $(this);
                                        var params = new Object();
                                        params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                        params.IdNuevoEstado = itemMenu.data('data').Id;

                                        $.ajax({
                                            url: SiteUrl + 'Fichero/CambiarEstado',
                                            data: $.toJSON(params),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    tempEstado.text(itemMenu.data('data').Descripcion);
                                                    if (!isNull($('#tb-seguimientos').data().ifTable))
                                                        $('#tb-seguimientos').table('update');
                                                    tempEstado.data('data',
                                                        {
                                                            Id: itemMenu.data('data').Id
                                                        });
                                                }
                                            }
                                        });

                                        return false;
                                    },
                                    fnLoadServerData: function(callbackRender) {
                                        $.ajax({
                                            url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                            data: $.toJSON({
                                                idEstadoActual: tempEstado.data('data').Id
                                            }),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    callbackRender($.map(data.Data,
                                                        function(item) {
                                                            return {
                                                                value: item.Descripcion,
                                                                data: item
                                                            }
                                                        }));
                                                }
                                            }
                                        });
                                    }
                                }));
                        } else {
                            $('#div-fichero-sicoin').remove();
                            var lista = $('#a-sicoin');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Sicoin);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Dam);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.EnProceso) {
                            $('#frm-fichero-dam').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dam,
                                });
                            var boxEstado = $('#box-estado-dam');
                            var tempEstado = $('<span class="menu-estado" />');
                            boxEstado.append(
                                tempEstado
                                .data('data',
                                    {
                                        Id: data.Data.Pedido.Ficheros[ficheroIndex].Estado.Id
                                    })
                                .text(data.Data.Pedido.Ficheros[ficheroIndex].Estado.Nombre)
                                .contextMenu({
                                    fnClick: function() {
                                        var itemMenu = $(this);
                                        var params = new Object();
                                        params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                        params.IdNuevoEstado = itemMenu.data('data').Id;

                                        $.ajax({
                                            url: SiteUrl + 'Fichero/CambiarEstado',
                                            data: $.toJSON(params),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    tempEstado.text(itemMenu.data('data').Descripcion);
                                                    if (!isNull($('#tb-seguimientos').data().ifTable))
                                                        $('#tb-seguimientos').table('update');
                                                    tempEstado.data('data',
                                                        {
                                                            Id: itemMenu.data('data').Id
                                                        });
                                                }
                                            }
                                        });

                                        return false;
                                    },
                                    fnLoadServerData: function(callbackRender) {
                                        $.ajax({
                                            url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                            data: $.toJSON({
                                                idEstadoActual: tempEstado.data('data').Id
                                            }),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    callbackRender($.map(data.Data,
                                                        function(item) {
                                                            return {
                                                                value: item.Descripcion,
                                                                data: item
                                                            }
                                                        }));
                                                }
                                            }
                                        });
                                    }
                                }));
                        } else {
                            $('#div-fichero-dam').remove();
                            var lista = $('#a-dam');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dam);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Mic);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.EnProceso) {
                            $('#frm-fichero-mic').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Mic
                                });
                        } else {
                            $('#div-fichero-mic').remove();
                            var lista = $('#a-mic');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Mic);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Crt);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.EnProceso) {
                            $('#frm-fichero-crt').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Crt
                                });
                        } else {
                            $('#div-fichero-crt').remove();
                            var lista = $('#a-crt');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Crt);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Goc);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.EnProceso) {
                            $('#frm-fichero-goc').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Goc,
                                });
                            var boxEstado = $('#box-estado-goc');
                            var tempEstado = $('<span class="menu-estado" />');
                            boxEstado.append(
                                tempEstado
                                .data('data',
                                    {
                                        Id: data.Data.Pedido.Ficheros[ficheroIndex].Estado.Id
                                    })
                                .text(data.Data.Pedido.Ficheros[ficheroIndex].Estado.Nombre)
                                .contextMenu({
                                    fnClick: function() {
                                        var itemMenu = $(this);
                                        var params = new Object();
                                        params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                        params.IdNuevoEstado = itemMenu.data('data').Id;

                                        $.ajax({
                                            url: SiteUrl + 'Fichero/CambiarEstado',
                                            data: $.toJSON(params),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    tempEstado.text(itemMenu.data('data').Descripcion);
                                                    if (!isNull($('#tb-seguimientos').data().ifTable))
                                                        $('#tb-seguimientos').table('update');
                                                    tempEstado.data('data',
                                                        {
                                                            Id: itemMenu.data('data').Id
                                                        });
                                                }
                                            }
                                        });

                                        return false;
                                    },
                                    fnLoadServerData: function(callbackRender) {
                                        $.ajax({
                                            url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                            data: $.toJSON({
                                                idEstadoActual: tempEstado.data('data').Id
                                            }),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    callbackRender($.map(data.Data,
                                                        function(item) {
                                                            return {
                                                                value: item.Descripcion,
                                                                data: item
                                                            }
                                                        }));
                                                }
                                            }
                                        });
                                    }
                                }));
                        } else {
                            $('#div-fichero-goc').remove();
                            var lista = $('#a-goc');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Goc);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Dui);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.Desaduanizacion) {
                            $('#frm-fichero-dui').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dui
                                });
                            var boxEstado = $('#box-estado-dui');
                            var tempEstado = $('<span class="menu-estado" />');
                            boxEstado.append(
                                tempEstado
                                .data('data',
                                    {
                                        Id: data.Data.Pedido.Ficheros[ficheroIndex].Estado.Id
                                    })
                                .text(data.Data.Pedido.Ficheros[ficheroIndex].Estado.Nombre)
                                .contextMenu({
                                    fnClick: function() {
                                        var itemMenu = $(this);
                                        var params = new Object();
                                        params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                        params.IdNuevoEstado = itemMenu.data('data').Id;

                                        $.ajax({
                                            url: SiteUrl + 'Fichero/CambiarEstado',
                                            data: $.toJSON(params),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    tempEstado.text(itemMenu.data('data').Descripcion);
                                                    if (!isNull($('#tb-seguimientos').data().ifTable))
                                                        $('#tb-seguimientos').table('update');
                                                    tempEstado.data('data',
                                                        {
                                                            Id: itemMenu.data('data').Id
                                                        });
                                                }
                                            }
                                        });

                                        return false;
                                    },
                                    fnLoadServerData: function(callbackRender) {
                                        $.ajax({
                                            url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                            data: $.toJSON({
                                                idEstadoActual: tempEstado.data('data').Id
                                            }),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    callbackRender($.map(data.Data,
                                                        function(item) {
                                                            return {
                                                                value: item.Descripcion,
                                                                data: item
                                                            }
                                                        }));
                                                }
                                            }
                                        });
                                    }
                                }));
                        } else {
                            $('#div-fichero-dui').remove();
                            var lista = $('#a-dui');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dui);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Dav);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.Desaduanizacion) {
                            $('#frm-fichero-dav').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dav
                                });
                            var boxEstado = $('#box-estado-dav');
                            var tempEstado = $('<span class="menu-estado" />');
                            boxEstado.append(
                                tempEstado
                                .data('data',
                                    {
                                        Id: data.Data.Pedido.Ficheros[ficheroIndex].Estado.Id
                                    })
                                .text(data.Data.Pedido.Ficheros[ficheroIndex].Estado.Nombre)
                                .contextMenu({
                                    fnClick: function() {
                                        var itemMenu = $(this);
                                        var params = new Object();
                                        params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                        params.IdNuevoEstado = itemMenu.data('data').Id;

                                        $.ajax({
                                            url: SiteUrl + 'Fichero/CambiarEstado',
                                            data: $.toJSON(params),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    tempEstado.text(itemMenu.data('data').Descripcion);
                                                    if (!isNull($('#tb-seguimientos').data().ifTable))
                                                        $('#tb-seguimientos').table('update');
                                                    tempEstado.data('data',
                                                        {
                                                            Id: itemMenu.data('data').Id
                                                        });
                                                }
                                            }
                                        });

                                        return false;
                                    },
                                    fnLoadServerData: function(callbackRender) {
                                        $.ajax({
                                            url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                            data: $.toJSON({
                                                idEstadoActual: tempEstado.data('data').Id
                                            }),
                                            success: function(data) {
                                                if (data.HasErrors) {
                                                    showErrors(data.Errors);
                                                } else {
                                                    callbackRender($.map(data.Data,
                                                        function(item) {
                                                            return {
                                                                value: item.Descripcion,
                                                                data: item
                                                            }
                                                        }));
                                                }
                                            }
                                        });
                                    }
                                }));
                        } else {
                            $('#div-fichero-dav').remove();
                            var lista = $('#a-dav');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dav);
                        }
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.RecibiConforme);
                    if (ficheroIndex >= 0) {
                        if (data.Data.Pedido.Estado.Id === EstadoPedidoEnum.Transportadora) {
                            $('#frm-fichero-recibi-conforme').compFileupload('setFile',
                                {
                                    documento: Globalize.localize('TextDownload'),
                                    filename: "Archivo", //data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                                    title: Globalize.localize('TextDownload'),
                                    url: SiteUrl +
                                        'DescargarFichero/' +
                                        IdPedido +
                                        '/' +
                                        TipoFicheroEnum.RecibiConforme
                                });
                        } else {
                            $('#div-recibi-conforme').remove();
                            var lista = $('#a-recibi-conforme');

                            lista.text(Globalize.localize('TextDownload'))
                                .attr('href', SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.RecibiConforme);
                        }
                    }
                }
            }
        }
    });
}

function CargarTabs(idEstado) {
    //$(".tabs").tabs("option", "disabled", [0, 1, 2, 3, 4]);
    if (idEstado === EstadoPedidoEnum.Inicio) {
        $(".tabs").tabs("option", "disabled", [0, 1, 2, 3, 4]);
        $(".tabs").tabs({ active: 5 });
    }
    if (idEstado === EstadoPedidoEnum.EnProceso) {
        $(".tabs").tabs("option", "disabled", [3, 4]);
    }
    if (idEstado === EstadoPedidoEnum.Desaduanizacion) {
        $(".tabs").tabs("option", "disabled", [4]);
    }
}
/**
 * cargar componente fileupload para ficheros de pedidos
 */
function CargarFileuploadFicheroBL() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-bl');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Bl)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Bl,
                        data: dataDocumento.Data
                    });
                    if (dataDocumento.Data.EstadoModificado) {
                        var buttons = {};

                        buttons["Ok"] = function() {
                            location.reload(true);
                        };
                        showCustomMessage({
                            title: Globalize.localize('TitlePopUp'),
                            message: Globalize.localize('MessageCambioEstado')
                                .replace("REMPLAZAR_ESTADO",
                                    dataDocumento.Data
                                    .Estado),
                            buttons: buttons,
                            open: function() {
                                $('.ui-dialog-titlebar-close').hide();
                            }
                        });

                    } else {
                        if (!isNull($('#tb-seguimientos').data().ifTable))
                            $('#tb-seguimientos').table('update');
                    }
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Bl
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                callbackFile();
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroImagenes() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-imagenes');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Imagenes)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Imagenes,
                        data: dataDocumento.Data
                    });
                    if (!isNull($('#tb-seguimientos').data().ifTable))
                        $('#tb-seguimientos').table('update');
                    
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Imagenes
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                callbackFile();
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroListaEmpaque() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-lista-empaque');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.ListaEmpaque)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.ListaEmpaque,
                        data: dataDocumento.Data
                    });
                    if (dataDocumento.Data.EstadoModificado) {
                        var buttons = {};

                        buttons["Ok"] = function() {
                            location.reload(true);
                        };
                        showCustomMessage({
                            title: Globalize.localize('TitlePopUp'),
                            message: Globalize.localize('MessageCambioEstado')
                                .replace("REMPLAZAR_ESTADO",
                                    dataDocumento.Data
                                    .Estado),
                            buttons: buttons,
                            open: function() {
                                $('.ui-dialog-titlebar-close').hide();
                            }
                        });

                    } else {
                        if (!isNull($('#tb-seguimientos').data().ifTable))
                            $('#tb-seguimientos').table('update');
                    }
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.ListaEmpaque
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                callbackFile();
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroFacturaComercial() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-factura-comercial');
    var boxEstado = $('#box-estado-factura-comercial');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.FacturaComercial)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.FacturaComercial,
                        data: dataDocumento.Data
                    });
                    var tempEstado = $('<span class="menu-estado" />');
                    boxEstado.append(
                        tempEstado
                        .data('data',
                        {
                            Id: 1
                        })
                        .text(Globalize.localize('TextRecibido'))
                        .contextMenu({
                            fnClick: function () {
                                var itemMenu = $(this);
                                var params = new Object();
                                params.IdFichero = dataDocumento.Data.IdFichero;
                                params.IdNuevoEstado = itemMenu.data('data').Id;
                                
                                    $.ajax({
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                                    $('#tb-seguimientos').table('update');
                                                tempEstado.data('data',
                                                {
                                                    Id: itemMenu.data('data').Id
                                                });
                                                if (data.Data.EstadoModificado) {
                                                    var buttons = {};

                                                    buttons["Ok"] = function () {
                                                        location.reload(true);
                                                    };
                                                    showCustomMessage({
                                                        title: Globalize.localize('TitlePopUp'),
                                                        message: Globalize.localize('MessageCambioEstado')
                                                            .replace("REMPLAZAR_ESTADO",
                                                                data.Data
                                                                .Estado),
                                                        buttons: buttons,
                                                        open: function () {
                                                            $('.ui-dialog-titlebar-close').hide();
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    });
                               
                                return false;
                            },
                            fnLoadServerData: function (callbackRender) {
                                $.ajax({
                                    url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                    data: $.toJSON({
                                        idEstadoActual: tempEstado.data('data').Id
                                    }),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            callbackRender($.map(data.Data,
                                                function (item) {
                                                    return {
                                                        value: item.Descripcion,
                                                        data: item
                                                    }
                                                }));
                                        }
                                    }
                                });
                            }
                        }));

                    if (!isNull($('#tb-seguimientos').data().ifTable))
                        $('#tb-seguimientos').table('update');
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.FacturaComercial
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                $('#box-estado-factura-comercial').html('');
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                callbackFile();
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroFacturaSicoin() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-sicoin');
    var boxEstado = $('#box-estado-sicoin');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Sicoin)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Sicoin,
                        data: dataDocumento.Data
                    });
                    var tempEstado = $('<span class="menu-estado" />');
                    boxEstado.append(
                        tempEstado
                        .data('data',
                        {
                            Id: 1
                        })
                        .text(Globalize.localize('TextRecibido'))
                        .contextMenu({
                            fnClick: function () {
                                var itemMenu = $(this);
                                var params = new Object();
                                params.IdFichero = dataDocumento.Data.IdFichero;
                                params.IdNuevoEstado = itemMenu.data('data').Id;

                                $.ajax({
                                    url: SiteUrl + 'Fichero/CambiarEstado',
                                    data: $.toJSON(params),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            tempEstado.text(itemMenu.data('data').Descripcion);
                                            if (!isNull($('#tb-seguimientos').data().ifTable))
                                                $('#tb-seguimientos').table('update');
                                            tempEstado.data('data',
                                            {
                                                Id: itemMenu.data('data').Id
                                            });
                                            if (data.Data.EstadoModificado) {
                                                var buttons = {};

                                                buttons["Ok"] = function () {
                                                    location.reload(true);
                                                };
                                                showCustomMessage({
                                                    title: Globalize.localize('TitlePopUp'),
                                                    message: Globalize.localize('MessageCambioEstado')
                                                        .replace("REMPLAZAR_ESTADO",
                                                            data.Data
                                                            .Estado),
                                                    buttons: buttons,
                                                    open: function () {
                                                        $('.ui-dialog-titlebar-close').hide();
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });

                                return false;
                            },
                            fnLoadServerData: function (callbackRender) {
                                $.ajax({
                                    url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                    data: $.toJSON({
                                        idEstadoActual: tempEstado.data('data').Id
                                    }),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            callbackRender($.map(data.Data,
                                                function (item) {
                                                    return {
                                                        value: item.Descripcion,
                                                        data: item
                                                    }
                                                }));
                                        }
                                    }
                                });
                            }
                        }));
                    if (!isNull($('#tb-seguimientos').data().ifTable))
                        $('#tb-seguimientos').table('update');
                    
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Sicoin
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                $('#box-estado-sicoin').html('');
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                callbackFile();
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroFacturaDam() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-dam');
    var boxEstado = $('#box-estado-dam');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dam)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dam,
                        data: dataDocumento.Data
                    });
                    var tempEstado = $('<span class="menu-estado" />');
                    boxEstado.append(
                        tempEstado
                        .data('data',
                        {
                            Id: 1
                        })
                        .text(Globalize.localize('TextRecibido'))
                        .contextMenu({
                            fnClick: function () {
                                var itemMenu = $(this);
                                var params = new Object();
                                params.IdFichero = dataDocumento.Data.IdFichero;
                                params.IdNuevoEstado = itemMenu.data('data').Id;

                                $.ajax({
                                    url: SiteUrl + 'Fichero/CambiarEstado',
                                    data: $.toJSON(params),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            tempEstado.text(itemMenu.data('data').Descripcion);
                                            if (!isNull($('#tb-seguimientos').data().ifTable))
                                                $('#tb-seguimientos').table('update');
                                            tempEstado.data('data',
                                            {
                                                Id: itemMenu.data('data').Id
                                            });
                                            if (data.Data.EstadoModificado) {
                                                var buttons = {};

                                                buttons["Ok"] = function () {
                                                    location.reload(true);
                                                };
                                                showCustomMessage({
                                                    title: Globalize.localize('TitlePopUp'),
                                                    message: Globalize.localize('MessageCambioEstado')
                                                        .replace("REMPLAZAR_ESTADO",
                                                            data.Data
                                                            .Estado),
                                                    buttons: buttons,
                                                    open: function () {
                                                        $('.ui-dialog-titlebar-close').hide();
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });

                                return false;
                            },
                            fnLoadServerData: function (callbackRender) {
                                $.ajax({
                                    url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                    data: $.toJSON({
                                        idEstadoActual: tempEstado.data('data').Id
                                    }),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            callbackRender($.map(data.Data,
                                                function (item) {
                                                    return {
                                                        value: item.Descripcion,
                                                        data: item
                                                    }
                                                }));
                                        }
                                    }
                                });
                            }
                        }));
                    if (!isNull($('#tb-seguimientos').data().ifTable))
                        $('#tb-seguimientos').table('update');
                    
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Dam
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                $('#box-estado-dam').html('');
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                callbackFile();
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroMic() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-mic');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Mic)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Mic,
                        data: dataDocumento.Data
                    });
                    if (dataDocumento.Data.EstadoModificado) {
                        var buttons = {};

                        buttons["Ok"] = function() {
                            location.reload(true);
                        };
                        showCustomMessage({
                            title: Globalize.localize('TitlePopUp'),
                            message: Globalize.localize('MessageCambioEstado')
                                .replace("REMPLAZAR_ESTADO",
                                    dataDocumento.Data
                                    .Estado),
                            buttons: buttons,
                            open: function() {
                                $('.ui-dialog-titlebar-close').hide();
                            }
                        });
                    } else {
                        if (!isNull($('#tb-seguimientos').data().ifTable))
                            $('#tb-seguimientos').table('update');
                    }
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Mic
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                callbackFile();
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroCrt() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-crt');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Crt)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Crt,
                        data: dataDocumento.Data
                    });
                    if (dataDocumento.Data.EstadoModificado) {
                        var buttons = {};

                        buttons["Ok"] = function() {
                            location.reload(true);
                        };
                        showCustomMessage({
                            title: Globalize.localize('TitlePopUp'),
                            message: Globalize.localize('MessageCambioEstado')
                                .replace("REMPLAZAR_ESTADO",
                                    dataDocumento.Data
                                    .Estado),
                            buttons: buttons,
                            open: function() {
                                $('.ui-dialog-titlebar-close').hide();
                            }
                        });
                    } else {
                        if (!isNull($('#tb-seguimientos').data().ifTable))
                            $('#tb-seguimientos').table('update');
                    }
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Crt
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                callbackFile();
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroGoc() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-goc');
    var boxEstado = $('#box-estado-goc');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Goc)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Goc,
                        data: dataDocumento.Data
                    });
                    var tempEstado = $('<span class="menu-estado" />');
                    boxEstado.append(
                        tempEstado
                        .data('data',
                        {
                            Id: 1
                        })
                        .text(Globalize.localize('TextRecibido'))
                        .contextMenu({
                            fnClick: function () {
                                var itemMenu = $(this);
                                var params = new Object();
                                params.IdFichero = dataDocumento.Data.IdFichero;
                                params.IdNuevoEstado = itemMenu.data('data').Id;

                                $.ajax({
                                    url: SiteUrl + 'Fichero/CambiarEstado',
                                    data: $.toJSON(params),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            tempEstado.text(itemMenu.data('data').Descripcion);
                                            if (!isNull($('#tb-seguimientos').data().ifTable))
                                                $('#tb-seguimientos').table('update');
                                            tempEstado.data('data',
                                            {
                                                Id: itemMenu.data('data').Id
                                            });
                                            if (data.Data.EstadoModificado) {
                                                var buttons = {};

                                                buttons["Ok"] = function () {
                                                    location.reload(true);
                                                };
                                                showCustomMessage({
                                                    title: Globalize.localize('TitlePopUp'),
                                                    message: Globalize.localize('MessageCambioEstado')
                                                        .replace("REMPLAZAR_ESTADO",
                                                            data.Data
                                                            .Estado),
                                                    buttons: buttons,
                                                    open: function () {
                                                        $('.ui-dialog-titlebar-close').hide();
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });

                                return false;
                            },
                            fnLoadServerData: function (callbackRender) {
                                $.ajax({
                                    url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                    data: $.toJSON({
                                        idEstadoActual: tempEstado.data('data').Id
                                    }),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            callbackRender($.map(data.Data,
                                                function (item) {
                                                    return {
                                                        value: item.Descripcion,
                                                        data: item
                                                    }
                                                }));
                                        }
                                    }
                                });
                            }
                        }));
                    if (!isNull($('#tb-seguimientos').data().ifTable))
                        $('#tb-seguimientos').table('update');
                    
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Goc
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                $('#box-estado-goc').html('');
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                callbackFile();
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroDui() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-dui');
    var boxEstado = $('#box-estado-dui');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dui)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dui,
                        data: dataDocumento.Data
                    });
                    var tempEstado = $('<span class="menu-estado" />');
                    boxEstado.append(
                        tempEstado
                        .data('data',
                        {
                            Id: 1
                        })
                        .text(Globalize.localize('TextRecibido'))
                        .contextMenu({
                            fnClick: function () {
                                var itemMenu = $(this);
                                var params = new Object();
                                params.IdFichero = dataDocumento.Data.IdFichero;
                                params.IdNuevoEstado = itemMenu.data('data').Id;

                                $.ajax({
                                    url: SiteUrl + 'Fichero/CambiarEstado',
                                    data: $.toJSON(params),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            tempEstado.text(itemMenu.data('data').Descripcion);
                                            if (!isNull($('#tb-seguimientos').data().ifTable))
                                                $('#tb-seguimientos').table('update');
                                            tempEstado.data('data',
                                            {
                                                Id: itemMenu.data('data').Id
                                            });
                                            if (data.Data.EstadoModificado) {
                                                var buttons = {};

                                                buttons["Ok"] = function () {
                                                    location.reload(true);
                                                };
                                                showCustomMessage({
                                                    title: Globalize.localize('TitlePopUp'),
                                                    message: Globalize.localize('MessageCambioEstado')
                                                        .replace("REMPLAZAR_ESTADO",
                                                            data.Data
                                                            .Estado),
                                                    buttons: buttons,
                                                    open: function () {
                                                        $('.ui-dialog-titlebar-close').hide();
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });

                                return false;
                            },
                            fnLoadServerData: function (callbackRender) {
                                $.ajax({
                                    url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                    data: $.toJSON({
                                        idEstadoActual: tempEstado.data('data').Id
                                    }),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            callbackRender($.map(data.Data,
                                                function (item) {
                                                    return {
                                                        value: item.Descripcion,
                                                        data: item
                                                    }
                                                }));
                                        }
                                    }
                                });
                            }
                        }));
                    if (!isNull($('#tb-seguimientos').data().ifTable))
                        $('#tb-seguimientos').table('update');
                    
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Dui
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                $('#box-estado-dui').html('');
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                callbackFile();
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroDav() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-dav');
    var boxEstado = $('#box-estado-dav');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dav)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dav,
                        data: dataDocumento.Data
                    });
                    var tempEstado = $('<span class="menu-estado" />');
                    boxEstado.append(
                        tempEstado
                        .data('data',
                        {
                            Id: 1
                        })
                        .text(Globalize.localize('TextRecibido'))
                        .contextMenu({
                            fnClick: function () {
                                var itemMenu = $(this);
                                var params = new Object();
                                params.IdFichero = dataDocumento.Data.IdFichero;
                                params.IdNuevoEstado = itemMenu.data('data').Id;

                                $.ajax({
                                    url: SiteUrl + 'Fichero/CambiarEstado',
                                    data: $.toJSON(params),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            tempEstado.text(itemMenu.data('data').Descripcion);
                                            if (!isNull($('#tb-seguimientos').data().ifTable))
                                                $('#tb-seguimientos').table('update');
                                            tempEstado.data('data',
                                            {
                                                Id: itemMenu.data('data').Id
                                            });
                                            if (data.Data.EstadoModificado) {
                                                var buttons = {};

                                                buttons["Ok"] = function () {
                                                    location.reload(true);
                                                };
                                                showCustomMessage({
                                                    title: Globalize.localize('TitlePopUp'),
                                                    message: Globalize.localize('MessageCambioEstado')
                                                        .replace("REMPLAZAR_ESTADO",
                                                            data.Data
                                                            .Estado),
                                                    buttons: buttons,
                                                    open: function () {
                                                        $('.ui-dialog-titlebar-close').hide();
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });

                                return false;
                            },
                            fnLoadServerData: function (callbackRender) {
                                $.ajax({
                                    url: SiteUrl + 'Parametrico/SearchPosibleEstadosDocumento',
                                    data: $.toJSON({
                                        idEstadoActual: tempEstado.data('data').Id
                                    }),
                                    success: function (data) {
                                        if (data.HasErrors) {
                                            showErrors(data.Errors);
                                        } else {
                                            callbackRender($.map(data.Data,
                                                function (item) {
                                                    return {
                                                        value: item.Descripcion,
                                                        data: item
                                                    }
                                                }));
                                        }
                                    }
                                });
                            }
                        }));
                    if (!isNull($('#tb-seguimientos').data().ifTable))
                        $('#tb-seguimientos').table('update');
                    
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.Dav
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                $('#box-estado-dav').html('');
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                callbackFile();
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarFileuploadFicheroRecibiConforme() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero-recibi-conforme');
    tempForm
        .attr('action', SiteUrl + 'GuardarFichero/' + IdPedido + '/' + TipoFicheroEnum.RecibiConforme)
        .compFileupload({
            labels: {
                btnUpload: Globalize.localize('TextSubir'),
                btnDelete: Globalize.localize('TextDelete')
            },
            params: {
                IdPedido: IdPedido
            },
            fnAdd: function (e, data) {
                var fileSize = data.originalFiles[0].size / 1024;

                if (fileSize > UploadSizeLimit) {
                    showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                    return false;
                }

                if (fileSize === 0) {
                    showErrors([Globalize.localize('ErrorFicheroVacio')]);
                    return false;
                }
                BlockFullPage();
                return true;
            },
            fnSend: function (e, data) {
                if ($.browser.msie === false) {
                    var fileSize = data.originalFiles[0].size / 1024;

                    if (fileSize > UploadSizeLimit) {
                        UnblockFullPage();
                        showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
                        return false;
                    }
                }
            },
            fnError: function (e, data) {
                UnblockFullPage();
                showErrors([Globalize.localize('ErrorArchivoExcedioLongitud')]);
            },
            fnSuccess: function (dataDocumento, callbackFile) {
                if (dataDocumento.HasErrors) {
                    UnblockFullPage();
                    showErrors(dataDocumento.Errors);
                    return false;
                } else {
                    callbackFile({
                        filename: dataDocumento.Data.NombreFichero,
                        title: Globalize.localize('TextDownload'),
                        dataFichero: dataDocumento.Data,
                        url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.RecibiConforme,
                        data: dataDocumento.Data
                    });
                    if (dataDocumento.Data.EstadoModificado) {
                        var buttons = {};

                        buttons["Ok"] = function() {
                            location.reload(true);
                        };
                        showCustomMessage({
                            title: Globalize.localize('TitlePopUp'),
                            message: Globalize.localize('MessageCambioEstado')
                                .replace("REMPLAZAR_ESTADO",
                                    dataDocumento.Data
                                    .Estado),
                            buttons: buttons,
                            open: function() {
                                $('.ui-dialog-titlebar-close').hide();
                            }
                        });
                    } else {
                        if (!isNull($('#tb-seguimientos').data().ifTable))
                            $('#tb-seguimientos').table('update');
                    }
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Fichero/EliminarFichero',
                        data: $.toJSON({
                            idPedido: IdPedido,
                            idTipo: TipoFicheroEnum.RecibiConforme
                        }),
                        success: function (data) {
                            UnblockFullPage();
                            popup.dialog('close');
                            if (data.HasErrors) {
                                showErrors(data.Errors);
                                return false;
                            } else {
                                callbackFile();
                                if (!isNull($('#tb-seguimientos').data().ifTable))
                                    $('#tb-seguimientos').table('update');
                                
                            }
                        }
                    });
                };

                buttons[Globalize.localize('TextNo')] = function () {
                    $(this).dialog('close');
                };
                showCustomMessage({
                    message: Globalize.localize('MessageConfirmDeleteFile'),
                    buttons: buttons
                });
            }
        });
}

function CargarSeguimientos() {
    var tbSeguimientos = $('#tb-seguimientos');
    tbSeguimientos.table({
        bInfo: true,
        aoColumns: [{
            sTitle: Globalize.localize('ColumnFecha'),
            sWidth: "150px"
        }, {
            sTitle: Globalize.localize('ColumnTipo'),
            sWidth: "250px",
            bSortable: false
        }, {
            sTitle: Globalize.localize('ColumnDescripcion'),
            bSortable: false
        }, {
            sTitle: Globalize.localize('ColumnOperador'),
            sWidth: "250px",
            bSortable: false
        }],
        aaSorting: [[0, "desc"]],
        bServerSide: true,
        sAjaxSource: SiteUrl + 'Parametrico/GetSeguimientos',
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            return nRow;
        },
        fnServerData: function (sSource, aoData, fnCallback) {
            var paramsTabla = new Object();
            $.each(aoData, function (index, value) {
                paramsTabla[value.name] = value.value;
            });
            var params = new Object();
            params.PageIndex = (paramsTabla.iDisplayStart / paramsTabla.iDisplayLength) + 1;
            params.ItemsPerPage = paramsTabla.iDisplayLength;
            params.OrderColumnName = decode(
                paramsTabla.iSortCol_0,
                [0, 'fecha']);
            params.OrderDirection = paramsTabla.sSortDir_0;
            /******************************************************************/
            //params.IdTipoSeguimiento = $('#cbx-seguimiento-tipo-seguimiento').combobox('getId');
            //params.FechaDesde = $('#txt-seguimiento-fecha-desde').datepicker('getDate') == null
            //? null : convertDateClientToServer($('#txt-seguimiento-fecha-desde').datepicker('getDate'));
            //params.FechaHasta = $('#txt-seguimiento-fecha-hasta').datepicker('getDate') == null
            //? null : convertDateClientToServer($('#txt-seguimiento-fecha-hasta').datepicker('getDate'));

            params.IdPedido = IdPedido;
            
            tbSeguimientos.block({ message: null });
            $.ajax({
                url: sSource,
                data: $.toJSON(params),
                success: function (data) {
                    tbSeguimientos.unblock();
                    if (data.HasErrors) {
                        showErrors(data.Errors);
                    } else {
                        var _data = [];
                        $.each(data.Data, function (index, value) {
                            var _row = [];
                            _row.push(value.Fecha);
                            _row.push(value.TipoSeguimiento);
                            _row.push(value.Descripcion);
                            _row.push(value.Usuario);
                            _data.push(_row);
                        });
                        fnCallback({
                            "sEcho": paramsTabla.sEcho,
                            "aaData": _data,
                            "iTotalRecords": data.Pagination.TotalDisplayRecords,
                            "iTotalDisplayRecords": data.Pagination.TotalRecords
                        });
                        tbSeguimientos.table('setData', data.Data);
                    }
                }
            });
        }
    });
}