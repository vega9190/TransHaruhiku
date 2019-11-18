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
            },
        ],
        bServerSide: true,
        sAjaxSource: SiteUrl + 'Contenedor/Buscar',
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('.btn-eliminar', nRow).click(function () {
                //PopUpObservaciones($(nRow).data('data').Pedido.Id);
            });

            $('.btn-editar', nRow).click(function () {
                //PopUpPagos($(nRow).data('data').Pedido.Id);
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
                                    '" class="btn-observaciones ui-icon ui-icon-pencil"></span>';

                                tempAcciones += '<span title="' +
                                    Globalize.localize('TextEliminar') +
                                    '" class="btn-pagos ui-icon ui-icon-trash"></span>';


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
function PopUpCrear() {
    //$.blockUI({ message: null });
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
        url: SiteUrl + 'Contenedor/PopUpCrear',
        open: function (event, ui) {
            popup = $(this);
            //$.unblockUI();
        },
        buttons: buttons,
        heigth: 500,
        width: 800
    }, false, function () {
    });
}