
$(document).ready(function () {
    var tabla = $('#tb-pedidos');
    $('#btn-buscar').button();
    $('#btn-limpiar').button();
    $('#btn-crear').button();

    $('#btn-limpiar').click(function () {
        $('#txt-nombre').val("");
        $('#txt-carnet').val("");
        $('#txt-container').val("");
        $('#txt-fecha-desde').val("");
        $('#txt-fecha-hasta').val("");
    });
    $('#btn-buscar').click(function () {
        tabla.table('update');
    });
    $('#btn-crear').click(function() {
        PopUpCrear();
    });
    //////////// TABLA  //////////////////////
    tabla.table({
        bInfo: true,
        bJQueryUI: true,
        responsive: {
            details: {
                type: 'inline'
            }
        },
        aaSorting: [[7, 'asc']],
        aoColumns: [
            {
                sTitle: Globalize.localize('ColumnId'),
                sWidth: "70px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnFecha'),
                sWidth: "130px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnDescripcion'),
                sWidth: "250px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnCarnet'),
                sWidth: "50px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnCliente'),
                sWidth: "170px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnContenedor'),
                sWidth: "100px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnEstado'),
                sWidth: "100px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnAcciones'),
                sWidth: "100px",
                bSortable: false
            },
        ],
        bServerSide: true,
        sAjaxSource: SiteUrl + 'Pedido/Buscar',
        fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('.btn-estados', nRow)
                .contextMenu({
                    fnLoadServerData: function (callbackRender) {
                        var data = $(nRow).data('data');
                        if (data.Pedido.Estado.Id === 1) {
                            var menu = [
                                {
                                    value: 'Cancelar',
                                    fnClick: function() {
                                        var popup = null;
                                        showConfirmation({
                                            title: Globalize.localize('TitlePopUp'),
                                            open: function (event, ui) {
                                                popup = $(this);
                                            },
                                            message: Globalize.localize('TextConfirmarEliminar'),
                                            buttonFunctionYes: function () {
                                                $.blockUI({ message: null });
                                                $.ajax({
                                                    url: SiteUrl + 'Pedido/Eliminar',
                                                    data: $.toJSON({ idPedido: data.Pedido.Id }),
                                                    success: function (data) {
                                                        popup.dialog('close');
                                                        if (data.HasErrors) {
                                                            showErrors(data.Errors);
                                                        } else {
                                                            if (data.HasWarnings) {
                                                                showCustomErrors({
                                                                    title: Globalize.localize('TextInformacion'),
                                                                    warnings: data.Warnings
                                                                });
                                                            } else {
                                                                showMessage(Globalize
                                                                    .localize('MessageOperacionExitosamente'),
                                                                    true);
                                                                tabla.table('update');
                                                            }
                                                        }
                                                        $.unblockUI();
                                                    }
                                                });
                                            }
                                        });
                                        return false;

                                    }
                                }
                            ];
                            callbackRender(menu);
                        }
                    }
                });

            $('.btn-observaciones', nRow).click(function () {
                PopUpObservaciones($(nRow).data('data').Pedido.Id);
            });

            $('.btn-pagos', nRow).click(function() {
                console.log($(nRow).data('data'));
            });

            //$('.btn-eliminar', nRow).click(function() {
            //    console.log($(nRow).data('data'));
            //});

            return nRow;
        },
        fnServerData: function(sSource, aoData, fnCallback) {
            var paramsTabla = {};
            $.each(aoData,
                function(index, value) {
                    paramsTabla[value.name] = value.value;
                });
            var params = {};
            params.PageIndex = (paramsTabla.iDisplayStart / paramsTabla.iDisplayLength) + 1;
            params.ItemsPerPage = paramsTabla.iDisplayLength;
            params.OrderColumnPosition = paramsTabla.iSortCol_0;
            params.OrderColumnName = decode(paramsTabla.iSortCol_0 - 2,
                [
                    1, 'id',
                    2, 'fecha'
                ]);
            params.OrderDirection = paramsTabla.sSortDir_0;
            /******************************************************************/

            params.Nombre = $('#txt-nombre').val();
            params.Carnet = $('#txt-carnet').val();
            params.Contenedor = $('#txt-container').val();

            params.FechaDesde = $('#txt-fecha-desde').val();
            params.FechaHasta = $('#txt-fecha-hasta').val();

            /*****************************************************************/
            var warnings = new Array();
            if (!isEmpty(params.FechaDesde) && !isEmpty(params.FechaHasta)) {
                if ($('#txt-fecha-desde').datepicker('getDate') > $('#txt-fecha-hasta').datepicker('getDate')) {
                    warnings.push(Globalize.localize('ErrorFechaIncoherente'));
                }
            }

            if (warnings.length > 0) {
                showCustomErrors({
                    title: Globalize.localize('TextInformacion'),
                    warnings: warnings
                });
                return false;
            }
            /******************************************************************/
            tabla.block({ message: null });
            $.ajax({
                url: sSource,
                data: $.toJSON(params),
                success: function(data) {
                    tabla.unblock();
                    if (data.HasErrors) {
                        showErrors(data.Errors);
                    } else {
                        var rows = [];
                        $.each(data.Data,
                            function(index, value) {
                                var row = [];
                                var tempAcciones = '<div class="box-icons">';

                                tempAcciones += '<a '
                                    + 'href="' + SiteUrl + 'Pedido/Editar/' + value.Pedido.Id + '" '
                                    + 'title="' + Globalize.localize('TextEditar') + '" '
                                    + 'class="ui-icon ui-icon-pencil"></a>';

                                tempAcciones += '<span title="' +
                                    Globalize.localize('TextObservaciones') +
                                    '" class="btn-observaciones ui-icon ui-icon-comment"></span>';

                                tempAcciones += '<span title="' +
                                    Globalize.localize('TextPagos') +
                                    '" class="btn-pagos ui-icon ui-icon-tag"></span>';

                                //tempAcciones += '<span title="' +
                                //    Globalize.localize('TextEliminar') +
                                //    '" class="btn-eliminar ui-icon ui-icon-trash"></span>';
                                tempAcciones += '</div>';

                                row.push(value.Pedido.Id);
                                row.push(value.FechaPedido);
                                row.push('<span  title="'
                                        + value.Pedido.Descripcion + '">'
                                        + summary(value.Pedido.Descripcion, 35, '...')
                                        + '</span>');
                                row.push(value.Pedido.Cliente.Carnet);
                                row.push(value.Pedido.Cliente.NombreCompleto);
                                row.push(isNull(value.Pedido.Contenedor) ? '' : '<span  title="'
                                        + value.Pedido.Contenedor + '">'
                                        + summary(value.Pedido.Contenedor, 20, '...')
                                        + '</span>');
                                row.push('<span class="btn-estados" >' + value.Pedido.Estado.Nombre + '</span>');
                                row.push(tempAcciones);
                                rows.push(row);
                            });
                        fnCallback({
                            "sEcho": paramsTabla.sEcho,
                            "aaData": rows,
                            "iTotalRecords": data.Pagination.TotalDisplayRecords,
                            "iTotalDisplayRecords": data.Pagination.TotalRecords
                        });
                        tabla.table('setData', data.Data);
                    }
                }
            });
        }
    });
});

/////////////////// PopUp Crear /////////////////////////
function PopUpCrear() {
    $.blockUI({ message: null });
    var popup = null;
    var buttons = {};
    /***************************************************************************/
    buttons[Globalize.localize('Guardar')] = function () {
        var params = {};

        params.IdCliente = $('#cbx-clientes-crear').combobox('getId');
        params.Descripcion = $('#txt-descripcion-crear').val().trim();
        params.Contenedor = $('#txt-contenedor-crear').val().trim();
        params.Direccion = $('#txt-direccion-crear').val().trim();
        params.DireccionUrl = $('#txt-direccion-url-crear').val().trim();
        
        var warnings = new Array();
        
        if (isNull(params.IdCliente))
            warnings.push(Globalize.localize('ErrorNoCliente'));

        if (isEmpty(params.Descripcion))
            warnings.push(Globalize.localize('ErrorNoDescripcion'));

        
        if (warnings.length > 0) {
            showCustomErrors({
                title: Globalize.localize('TextInformacion'),
                warnings: warnings
            });
            return false;
        } else {
            $.blockUI({ message: null });
            $.ajax({
                url: SiteUrl + 'Pedido/Guardar',
                data: $.toJSON(params),
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
                            showMessage(Globalize
                                .localize('MessageOperacionExitosamente'),
                                true);
                            popup.dialog('close');
                            $('#tb-pedidos').table('update');
                        }
                    }
                }
            });
        }

    };
    buttons[Globalize.localize('Cerrar')] = function () {
        popup.dialog('close');
    };
    /***************************************************************************/
    showPopupPage({
        title: Globalize.localize('TituloPopUp'),
        url: SiteUrl + 'Pedido/PopUpCrear',
        open: function (event, ui) {
            popup = $(this);
            $.unblockUI();
        },
        buttons: buttons,
        heigth: 500,
        width: 800
    }, false, function () {
    });
}

function PopUpObservaciones(idPedido) {
    $.blockUI({ message: null });
    var popup = null;
    var buttons = {};
    /***************************************************************************/
    buttons[Globalize.localize('Cerrar')] = function () {
        popup.dialog('close');
    };
    /***************************************************************************/
    showPopupPage({
        title: Globalize.localize('TituloPopUp'),
        url: SiteUrl + 'Pedido/PopUpObservacion',
        open: function (event, ui) {
            popup = $(this);
            $.unblockUI();
        },
        buttons: buttons,
        heigth: 500,
        width: 700
    }, false, function () {
        var tablaObservaciones = $('#tb-observaciones', popup);
        $('#btn-limpiar-observacion', popup).button();
        $('#btn-guardar-observacion', popup).button();

        $('#btn-limpiar-observacion', popup).click(function () {
            $('#txt-descripcion-observacion', popup).val("");
            $('#txt-id-observacion', popup).val("");
        });

        $('#btn-guardar-observacion', popup).click(function () {
            var params = {};

            params.Descripcion = $('#txt-descripcion-observacion', popup).val().trim();
            params.UsuarioRol = RolUsuario;
            params.IdPedido = idPedido;
            params.IdObservacion = $('#txt-id-observacion', popup).val();
            var warnings = new Array();

            if (isEmpty(params.Descripcion))
                warnings.push(Globalize.localize('ErrorNoDescripcion'));

            if (warnings.length > 0) {
                showCustomErrors({
                    title: Globalize.localize('TextInformacion'),
                    warnings: warnings
                });
                return false;
            } else {
                $.blockUI({ message: null });
                $.ajax({
                    url: SiteUrl + 'Observacion/Guardar',
                    data: $.toJSON(params),
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
                                showMessage(Globalize
                                    .localize('MessageOperacionExitosamente'),
                                    true);
                                $('#btn-limpiar-observacion', popup).click();
                                tablaObservaciones.table('update');
                            }
                        }
                    }
                });
            }
        });
        //////////// TABLA  //////////////////////
        tablaObservaciones.table({
            bInfo: true,
            bJQueryUI: true,
            responsive: {
                details: {
                    type: 'inline'
                }
            },
            //aaSorting: [[5, 'asc']],
            aoColumns: [
                {
                    className: 'hide',
                    sTitle: "Id",
                    sWidth: "70px",
                    bSortable: false
                },
                {
                    sTitle: Globalize.localize('ColumnFecha'),
                    sWidth: "100px",
                    bSortable: false
                },
                {
                    sTitle: Globalize.localize('ColumnObservacion'),
                    sWidth: "250px",
                    bSortable: false
                },
                {
                    sTitle: Globalize.localize('ColumnUsuario'),
                    sWidth: "130px",
                    bSortable: false
                },
                {
                    sTitle: Globalize.localize('ColumnAcciones'),
                    sWidth: "100px",
                    bSortable: false
                }
            ],
            bServerSide: true,
            sAjaxSource: SiteUrl + 'Observacion/Buscar',
            fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $('.btn-editar-observacion', nRow).click(function () {
                    data = $(nRow).data('data');
                    $('#txt-descripcion-observacion', popup).val(data.Observacion.Descripcion);
                    $('#txt-id-observacion', popup).val(data.Observacion.Id);
                });

                $('.btn-eliminar-eliminar', nRow).click(function () {
                    data = $(nRow).data('data');
                    var popup = null;
                    showConfirmation({
                        title: Globalize.localize('TitlePopUp'),
                        open: function (event, ui) {
                            popup = $(this);
                        },
                        message: Globalize.localize('TextConfirmarEliminar'),
                        buttonFunctionYes: function () {
                            $.blockUI({ message: null });
                            $.ajax({
                                url: SiteUrl + 'Observacion/Eliminar',
                                data: $.toJSON({ idObservacion: data.Observacion.Id }),
                                success: function (data) {
                                    popup.dialog('close');
                                    if (data.HasErrors) {
                                        showErrors(data.Errors);
                                    } else {
                                        if (data.HasWarnings) {
                                            showCustomErrors({
                                                title: Globalize.localize('TextInformacion'),
                                                warnings: data.Warnings
                                            });
                                        } else {
                                            showMessage(Globalize
                                                .localize('MessageOperacionExitosamente'),
                                                true);
                                            tablaObservaciones.table('update');
                                        }
                                    }
                                    $.unblockUI();
                                }
                            });
                        }
                    });
                });

                return nRow;
            },
            fnServerData: function (sSource, aoData, fnCallback) {
                var paramsTabla = {};
                $.each(aoData,
                    function (index, value) {
                        paramsTabla[value.name] = value.value;
                    });
                var params = {};
                params.PageIndex = (paramsTabla.iDisplayStart / paramsTabla.iDisplayLength) + 1;
                params.ItemsPerPage = paramsTabla.iDisplayLength;
                params.OrderColumnPosition = paramsTabla.iSortCol_0;
                params.OrderColumnName = decode(paramsTabla.iSortCol_0 - 2,
                    [
                        1, 'fecha'
                    ]);
                params.OrderDirection = paramsTabla.sSortDir_0;
                /******************************************************************/

                params.IdPedido = idPedido;

                /******************************************************************/
                tablaObservaciones.block({ message: null });
                $.ajax({
                    url: sSource,
                    data: $.toJSON(params),
                    success: function (data) {
                        tablaObservaciones.unblock();
                        if (data.HasErrors) {
                            showErrors(data.Errors);
                        } else {
                            var rows = [];
                            $.each(data.Data,
                                function (index, value) {
                                    var row = [];
                                    var tempAcciones = '<div class="box-icons">';
                                    tempAcciones += '<span title="' +
                                        Globalize.localize('TextEditar') +
                                        '" class="btn-editar-observacion ui-icon ui-icon-pencil"></span>';

                                    tempAcciones += '<span title="' +
                                        Globalize.localize('TextEliminar') +
                                        '" class="btn-eliminar-eliminar ui-icon ui-icon-trash"></span>';
                                    tempAcciones += '</div>';

                                    row.push(value.Observacion.Id);
                                    row.push(value.FechaObservacion);
                                    row.push(value.Observacion.Descripcion);
                                    row.push(value.Observacion.Usuario.NombreCompleto);
                                    row.push(tempAcciones);
                                    rows.push(row);
                                });
                            fnCallback({
                                "sEcho": paramsTabla.sEcho,
                                "aaData": rows,
                                "iTotalRecords": data.Pagination.TotalDisplayRecords,
                                "iTotalDisplayRecords": data.Pagination.TotalRecords
                            });
                            tablaObservaciones.table('setData', data.Data);
                        }
                    }
                });
            }
        });

    });
}