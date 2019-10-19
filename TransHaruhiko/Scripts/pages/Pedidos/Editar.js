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
    CargarFileuploadFicheroFacturaSicoin();
    CargarFileuploadFicheroFacturaDam();
    CargarFileuploadFicheroMic();
    CargarFileuploadFicheroCrt();
    CargarFileuploadFicheroGoc();
    CargarFileuploadFicheroDui();
    CargarFileuploadFicheroDav();
    CargarFileuploadFicheroRecibiConforme();
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
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Bl,
                        });
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Imagenes);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-imagenes').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Imagenes,
                        });
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.ListaEmpaque);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-lista-empaque').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.ListaEmpaque,
                        });
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.FacturaComercial);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-factura-comercial').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.FacturaComercial,
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
                                fnClick: function () {
                                    var itemMenu = $(this);
                                    var params = new Object();
                                    params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                    params.IdNuevoEstado = itemMenu.data('data').Id;

                                    $.ajax({
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                //if (!isNull(tableSeguimientos.data().ifTable))
                                                //    tableSeguimientos.table('update');
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
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Sicoin);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-sicoin').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
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
                                fnClick: function () {
                                    var itemMenu = $(this);
                                    var params = new Object();
                                    params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                    params.IdNuevoEstado = itemMenu.data('data').Id;

                                    $.ajax({
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                //if (!isNull(tableSeguimientos.data().ifTable))
                                                //    tableSeguimientos.table('update');
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
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Dam);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-dam').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
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
                                fnClick: function () {
                                    var itemMenu = $(this);
                                    var params = new Object();
                                    params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                    params.IdNuevoEstado = itemMenu.data('data').Id;

                                    $.ajax({
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                //if (!isNull(tableSeguimientos.data().ifTable))
                                                //    tableSeguimientos.table('update');
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
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Mic);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-mic').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Mic,
                        });
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Crt);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-crt').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Crt,
                        });
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Goc);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-goc').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
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
                                fnClick: function () {
                                    var itemMenu = $(this);
                                    var params = new Object();
                                    params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                    params.IdNuevoEstado = itemMenu.data('data').Id;

                                    $.ajax({
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                //if (!isNull(tableSeguimientos.data().ifTable))
                                                //    tableSeguimientos.table('update');
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
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Dui);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-dui').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dui,
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
                                fnClick: function () {
                                    var itemMenu = $(this);
                                    var params = new Object();
                                    params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                    params.IdNuevoEstado = itemMenu.data('data').Id;

                                    $.ajax({
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                //if (!isNull(tableSeguimientos.data().ifTable))
                                                //    tableSeguimientos.table('update');
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
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.Dav);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-dav').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.Dav,
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
                                fnClick: function () {
                                    var itemMenu = $(this);
                                    var params = new Object();
                                    params.IdFichero = data.Data.Pedido.Ficheros[ficheroIndex].Id;
                                    params.IdNuevoEstado = itemMenu.data('data').Id;

                                    $.ajax({
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                //if (!isNull(tableSeguimientos.data().ifTable))
                                                //    tableSeguimientos.table('update');
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
                    }

                    var ficheroIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === TipoFicheroEnum.RecibiConforme);
                    if (ficheroIndex >= 0) {
                        $('#frm-fichero-recibi-conforme').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: "Archivo",//data.Data.Pedido.Ficheros[ficheroIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'DescargarFichero/' + IdPedido + '/' + TipoFicheroEnum.RecibiConforme,
                        });
                    }
                }
            }
        }
    });
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
                                        url: SiteUrl + 'Fichero/CambiarEstado',
                                        data: $.toJSON(params),
                                        success: function (data) {
                                            if (data.HasErrors) {
                                                showErrors(data.Errors);
                                            } else {
                                                tempEstado.text(itemMenu.data('data').Descripcion);
                                                //if (!isNull(tableSeguimientos.data().ifTable))
                                                //    tableSeguimientos.table('update');
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
                                            //if (!isNull(tableSeguimientos.data().ifTable))
                                            //    tableSeguimientos.table('update');
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
                                            //if (!isNull(tableSeguimientos.data().ifTable))
                                            //    tableSeguimientos.table('update');
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
                                            //if (!isNull(tableSeguimientos.data().ifTable))
                                            //    tableSeguimientos.table('update');
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
                                            //if (!isNull(tableSeguimientos.data().ifTable))
                                            //    tableSeguimientos.table('update');
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
                                            //if (!isNull(tableSeguimientos.data().ifTable))
                                            //    tableSeguimientos.table('update');
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