var IdPedido = null;

$(document).ready(function () {
    IdPedido = $('#hd-id-pedido').val();
    var tabla = $('#tb-contenedores');
    $('#btn-volver').button();
    $('#btn-volver').click(function () {
        window.location.href = SiteUrl + 'Pedido/List';
    });
    
    $('#btn-crear').button();
    $('#btn-crear').click(function () {
        PopUpCrear();
    });

    $('#btn-planilla-despacho').button();
    $('#btn-planilla-despacho').click(function () {
        gotoController('GenerarPlanillaDespacho/' +IdPedido);
    });

    CargarInformacion();

    //////////// TABLA  //////////////////////
    tabla.table({
        bInfo: true,
        bJQueryUI: true,
        responsive: {
            details: {
                type: 'inline'
            }
        },
        aaSorting: [[1, 'asc']],
        aoColumns: [
            {
                sTitle: Globalize.localize('ColumnId'),
                sWidth: "70px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnCodigo'),
                sWidth: "130px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnNombre'),
                sWidth: "250px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnAcciones'),
                sWidth: "100px",
                bSortable: false
            }
        ],
        bServerSide: true,
        sAjaxSource: SiteUrl + 'Contenedor/Buscar',
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('.btn-eliminar', nRow).click(function () {
                //PopUpObservaciones($(nRow).data('data').Pedido.Id);
                showConfirmation({
                    title: Globalize.localize('TitlePopUp'),
                    open: function (event, ui) {
                        popup = $(this);
                    },
                    message: Globalize.localize('TextConfirmarEliminar'),
                    buttonFunctionYes: function () {
                        $.blockUI({ message: null });
                        $.ajax({
                            url: SiteUrl + 'Contenedor/Eliminar',
                            data: $.toJSON({ idContenedor: $(nRow).data('data').Contenedor.Id }),
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
            });

            $('.btn-editar', nRow).click(function () {
                PopUpCrear($(nRow).data('data').Contenedor.Id);
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
                    1, 'id',
                    2, 'fecha'
                ]);
            params.OrderDirection = paramsTabla.sSortDir_0;
            /******************************************************************/

            params.IdPedido = IdPedido;
            
            /******************************************************************/
            tabla.block({ message: null });
            $.ajax({
                url: sSource,
                data: $.toJSON(params),
                success: function (data) {
                    tabla.unblock();
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
                                    '" class="btn-editar ui-icon ui-icon-pencil"></span>';

                                tempAcciones += '<span title="' +
                                    Globalize.localize('TextEliminar') +
                                    '" class="btn-eliminar ui-icon ui-icon-trash"></span>';


                                tempAcciones += '</div>';

                                row.push(value.Contenedor.Id);
                                row.push(value.Contenedor.Codigo);
                                row.push(value.Contenedor.Nombre);
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

/**
 * cargar pedido
 */
function CargarInformacion() {
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

                    $('#txt-direccion').hide();
                    if (!isNullOrEmpty(data.Data.Pedido.Direccion)) {
                        $('#lb-direccion').text(summary(data.Data.Pedido.Direccion, 100, '...'));
                        $('#lb-direccion').prop('title', data.Data.Pedido.Direccion);
                    }

                    $('#txt-direccion-url').hide();
                    if (!isNullOrEmpty(data.Data.Pedido.DireccionUrl)) {
                        $('#lb-direccion-url').text("Dirección");
                        $('#lb-direccion-url').attr('href', data.Data.Pedido.DireccionUrl);
                        DireccionUrl = data.Data.Pedido.DireccionUrl;
                    }

                }
            }
        }
    });
}

/////////////////// PopUp Crear /////////////////////////
function PopUpCrear(idContenedor) {
    var popup = null;
    var buttons = {};
    /***************************************************************************/
    buttons[Globalize.localize('Guardar')] = function () {
        var params = {};

        params.Codigo = $('#txt-codigo').val().trim();
        params.Nombre = $('#txt-nombre').val().trim();
        params.Poliza = $('#txt-poliza').val().trim();
        params.IdPedido = IdPedido;
        params.IdContenedor = idContenedor;

        var detalles = [];
        var noTieneConcepto = false;
        var noTienePrecio = false;
        $.each($('#tb-detalles').table('getRows'),
            function (index, value) {
                var paramDetalle = {}
                paramDetalle.Concepto = $('.concepto', value).val();
                paramDetalle.Precio = $('.precio', value).val();
                if (isEmpty(paramDetalle.Concepto))
                    noTieneConcepto = true;

                if (isEmpty(paramDetalle.Precio))
                    noTienePrecio = true;
                detalles.push(paramDetalle);
            });
        

        params.Despachos = detalles;

        var warnings = new Array();

        if (isEmpty(params.Codigo))
            warnings.push(Globalize.localize('ErrorNoCodigo'));

        if ($('#tb-detalles').table('getRows').length > 0) {
            if (noTieneConcepto)
                warnings.push(Globalize.localize('ErrorNoConcepto'));
            if (noTienePrecio)
                warnings.push(Globalize.localize('ErrorNoPrecio'));
        }

        if (warnings.length > 0) {
            showCustomErrors({
                title: Globalize.localize('TextInformacion'),
                warnings: warnings
            });
            return false;
        } else {
            $.blockUI({ message: null });
            $.ajax({
                url: SiteUrl + 'Contenedor/Guardar',
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
                            $('#tb-contenedores').table('update');
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
        url: SiteUrl + 'Contenedor/PopUpCrear',
        open: function (event, ui) {
            popup = $(this);
            //$.unblockUI();
        },
        buttons: buttons,
        width: 600
    }, false, function () {
        $('#btn-crear-contenedor').button();
        $('#btn-crear-contenedor').click(function () {
            var rowNew = [];
            rowNew.push('<input type="text" class="concepto" maxlength="250" value="" />');
            rowNew.push('<input type="text" class="precio" value="" />');
            rowNew.push('<a class="button btn-contenedor-eliminar"><span class="ui-icon ui-icon-trash"></span></a>');
            $('#tb-detalles').table('addRow', rowNew, null);
            var rows = $('#tb-detalles').table('getRows');
            var row = rows[rows.length - 1];
            var rowCallback = $('#tb-detalles').table('option', 'fnRowCallback');
            rowCallback(row);
            $('.precio', popup).autoNumeric(AutoNumericDecimal);
        });
        CargarDetalle(idContenedor);
    });
}

function CargarDetalle(idContenedor) {
    $('#tb-detalles').table({
        aoColumns: [
            {
                sTitle: Globalize.localize('ColumnConcepto'),
                sWidth: "250px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnMonto'),
                sWidth: "100px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnAcciones'),
                sWidth: "100px",
                bSortable: false
            }],
        bScrollAutoCss: true,
        bAutoWidth: false,
        sScrollXInner: "100%",
        fnInitComplete: function () {
            this.css("visibility", "visible");
        },
        bInfo: true,
        responsive: false,
        bPaginate: false,
        bStateSave: false,
        bServerSide: false,
        bFirstLoading: true,
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('.btn-contenedor-eliminar', nRow).off('click');
            $('.btn-contenedor-eliminar', nRow).click(function () {
                EliminarDetalle(nRow);
            });
        }
    });

    if (idContenedor != null) {
        $.ajax({
            url: SiteUrl + 'Contenedor/ObtenerDetalle',
            data: $.toJSON({ idContenedor: idContenedor }),
            success: function (data) {
                $.unblockUI();
                if (data.HasErrors) {
                    showErrors(data.Errors);
                } else {
                    $('#txt-codigo').val(data.Data.Contenedor.Codigo);
                    $('#txt-nombre').val(data.Data.Contenedor.Nombre);
                    $('#txt-poliza').val(data.Data.Contenedor.Poliza);

                    $.each(data.Data.Contenedor.DatalleContenedor, function (index, element) {
                        var row = [];
                        
                        row.push('<input type="text" class="concepto" maxlength="250" value="' + element.Concepto + ' " />');
                        row.push('<input type="text" class="precio" value="' + element.Precio + '" />');
                        row.push('<a class="button btn-contenedor-eliminar"><span class="ui-icon ui-icon-trash"></span></a>');

                        $('#tb-detalles').table('addRow', row, element);
                        $('.precio').autoNumeric(AutoNumericDecimal);
                    });
                    
                }
            }
        });
    }
}
function EliminarDetalle(nRow) {
    var fila = $(nRow);
    
    var dataRow = $(fila).data('data');
    var idDetalle = !isNull(dataRow) || dataRow == 'undefined' ? dataRow.Id : 0;

    if (idDetalle != 0) {
        showConfirmation({
            title: Globalize.localize('TitlePopUp'),
            message: Globalize.localize('TextConfirmarEliminar'),
            buttonFunctionYes: function () {
                $('#tb-detalles').block({ message: null });
                if ($(fila).hasClass('child')) {
                    $('#tb-detalles').DataTable().row(fila.prev('tr')).remove().draw();
                } else {
                    $('#tb-detalles').DataTable().row(fila).remove().draw();
                }
                $('#tb-detalles').unblock();
                $(this).dialog('close');
            },
            buttonFunctionNo: function () {
                $(this).dialog('close');
            }
        });
    } else {
        if ($(fila).hasClass('child')) {
            $('#tb-detalles').DataTable().row(fila.prev('tr')).remove().draw();
        } else {
            $('#tb-detalles').DataTable().row(fila).remove().draw();
        }
    }
};