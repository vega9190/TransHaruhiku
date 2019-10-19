var IdPedido = null;

$(document).ready(function () {
    IdPedido = $('#hd-id-pedido').val();
    CargarFileuploadFichero();
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
                    console.log(data.Data);
                    $('#lb-cliente').text(data.Data.Pedido.Cliente.NombreCompleto);
                    $('#lb-estado').text(data.Data.Pedido.Estado.Nombre);
                    $('#lb-telefono').text(data.Data.Pedido.Cliente.Telefono);
                    $('#txt-direccion').val(data.Data.Pedido.Direccion);
                    $('#txt-direccion-url').val(data.Data.Pedido.DireccionUrl);
                    $('#txt-contenedor').val(data.Data.Pedido.Contenedor);
                    var ficheroBlIndex = data.Data.Pedido.Ficheros.findIndex(a=> a.Tipo.Id === 12);
                    if (ficheroBlIndex >= 0) {
                        $('#frm-fichero').compFileupload('setFile', {
                            documento: Globalize.localize('TextDownload'),
                            filename: data.Data.Pedido.Ficheros[ficheroBlIndex].Nombre,
                            title: Globalize.localize('TextDownload'),
                            url: SiteUrl + 'Pedido/DescargarFicheroBl/' + IdPedido
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
function CargarFileuploadFichero() {
    var buttons = new Object();
    var tempForm = $('#frm-fichero');
    tempForm
        .attr('action', SiteUrl + 'GuardarFicheroBl/' + IdPedido)
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
                        url: SiteUrl + 'Pedido/DescargarFicheroBl/' + IdPedido,
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
                        url: SiteUrl + 'Pedido/EliminarFicheroBl',
                        data: $.toJSON({
                            idPedido: IdPedido
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