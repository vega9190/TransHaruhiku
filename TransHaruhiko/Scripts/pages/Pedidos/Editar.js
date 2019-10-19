var IdPedido = null;

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

$(document).ready(function () {
    IdPedido = $('#hd-id-pedido').val();
    CargarFileuploadFicheroBL();
    CargarFileuploadFicheroImagenes();
    CargarFileuploadFicheroFacturaComercial();
    CargarFileuploadFicheroListaEmpaque();
    CargarPedido();
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
                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Bl);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-bl').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Bl,
                        });
                    }
                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Imagenes);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-imagenes').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Imagenes,
                        });
                    }
                }
            }
        }
    });
}
/**
 * cargar componente fileupload para fichero de acta
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
                    //ActualizarActaTipoFichero(IdActa, false);
                    $('[name=rd-tipo-fichero]').attr('disabled', true);
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Pedido/EliminarFichero',
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
                                $('[name=rd-tipo-fichero]').attr('disabled', false);
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
                    //ActualizarActaTipoFichero(IdActa, false);
                    $('[name=rd-tipo-fichero]').attr('disabled', true);
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Pedido/EliminarFichero',
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
                                $('[name=rd-tipo-fichero]').attr('disabled', false);
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
                    //ActualizarActaTipoFichero(IdActa, false);
                    $('[name=rd-tipo-fichero]').attr('disabled', true);
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Pedido/EliminarFichero',
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
                                $('[name=rd-tipo-fichero]').attr('disabled', false);
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
                console.log(dataDocumento, "dataDocumento");
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
                                //console.log("click");
                                //var itemMenu = $(this);
                                //console.log(dataDocumento.Data.IdFichero);
                                //console.log(itemMenu.data('data').Id);
                                var itemMenu = $(this);
                                var params = new Object();
                                params.IdFichero = dataDocumento.Data.IdFichero;
                                params.IdNuevoEstado = itemMenu.data('data').Id;
                                
                                    $.ajax({
                                        url: appData.siteUrl + 'JustificantePago/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                if (!isNull(tableSeguimientos.data().ifTable)
                                                ) tableSeguimientos.table('update');
                                                tempEstado.data('data',
                                                {
                                                    Id: itemMenu.data('data').Id
                                                });
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
                    $('[name=rd-tipo-fichero]').attr('disabled', true);
                    UnblockFullPage();
                }
            },
            fnDelete: function (dataFile, callbackFile) {
                buttons[Globalize.localize('TextYes')] = function () {
                    var popup = $(this);
                    BlockFullPage();
                    $.ajax({
                        url: SiteUrl + 'Pedido/EliminarFichero',
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
                                callbackFile();
                                $('[name=rd-tipo-fichero]').attr('disabled', false);
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