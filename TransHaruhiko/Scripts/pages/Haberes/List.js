var primeraCarga = true;
$(document).ready(function () {
    var tabla = $('#tb-haberes');
    $('#btn-buscar').button();
    $('#btn-limpiar').button();
    $('#btn-crear').button();

    $('#btn-limpiar').click(function () {

        $('#cbx-tipo-haber').combobox('reset');
        $('#cbx-servicio-basico').combobox('reset');
        $('#cbx-tipo-moneda').combobox('reset');
        $('#txt-fecha-desde').val("");
        $('#txt-fecha-hasta').val("");
        ObtenerEmpresaPorDefecto();
    });

    $('#btn-buscar').click(function () {
        tabla.table('update');
    });

    $('#btn-crear').click(function () {
        PopUpCrear();
    });
    ///// Combos /////
    $('#cbx-empresa').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchEmpresas',
    }));
    ObtenerEmpresaPorDefecto();
    $('#cbx-empresa').combobox('disableText');

    $('#cbx-tipo-haber').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchTipoHaber',
        toolbar: {
            reset: function () { }
        }
    }));

    $('#cbx-servicio-basico').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchServicioBasico',
        toolbar: {
            reset: function () { }
        }
    }));

    $('#cbx-tipo-moneda').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchTipoMoneda',
        toolbar: {
            reset: function () { }
        }
    }));

    //////////// TABLA  //////////////////////
    tabla.table({
        bInfo: true,
        bJQueryUI: true,
        responsive: {
            details: {
                type: 'inline'
            }
        },
        aaSorting: [[1, 'desc']],
        aoColumns: [
            {
                sTitle: Globalize.localize('ColumnId'),
                sWidth: "70px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnFecha'),
                sWidth: "50px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnTipoHaber'),
                sWidth: "50px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnServicioBasico'),
                sWidth: "100px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnMonto'),
                sWidth: "100px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnObservacion'),
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
        sAjaxSource: SiteUrl + 'Haber/Buscar',
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {

            $('.btn-editar', nRow).click(function () {
                PopUpEditar($(nRow).data('data').Haber.Id);
            });

            $('.btn-eliminar', nRow).click(function () {
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
                            url: SiteUrl + 'Haber/Eliminar',
                            data: $.toJSON({ idHaber: data.Haber.Id }),
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

            params.IdTipoHaber = $('#cbx-tipo-haber').combobox('getId');
            params.IdServicioBasico = $('#cbx-servicio-basico').combobox('getId');
            params.IdTipoMoneda = $('#cbx-tipo-moneda').combobox('getId');
            
            params.FechaDesde = $('#txt-fecha-desde').val();
            params.FechaHasta = $('#txt-fecha-hasta').val();
            params.IdEmpresa = $('#cbx-empresa').combobox('getId');

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
            if (primeraCarga)
                return;
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

                                row.push(value.Haber.Id);
                                row.push(value.FechaHaber);
                                row.push(value.Haber.Tipo.Nombre);
                                row.push(value.Haber.ServicioBasico.Nombre);
                                row.push(value.Haber.Monto);
                                row.push('<span  title="'
                                    + value.Haber.Observacion + '">'
                                    + summary(value.Haber.Observacion, 35, '...')
                                    + '</span>');
                                
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
    //$.blockUI({ message: null });
    var popup = null;
    var buttons = {};
    /***************************************************************************/
    buttons[Globalize.localize('Guardar')] = function () {
        var params = {};

        params.IdEmpresa = $('#cbx-empresa-crear').combobox('getId');
        params.IdTipoHaber = $('#cbx-tipo-haber-crear').combobox('getId');
        params.IdServicioBasico = $('#cbx-servicio-basico-crear').combobox('getId');
        params.IdTipoMoneda = $('#cbx-tipo-moneda-crear').combobox('getId');
        params.Fecha = $('#txt-fecha-crear').val();
        params.Monto = $('#txt-monto-crear').val();
        params.Observacion = $('#txt-observacion-crear').val().trim();

        var warnings = new Array();

        if (isNull(params.IdTipoHaber))
            warnings.push(Globalize.localize('ErrorNoTipoHaber'));

        if (isNull(params.IdServicioBasico))
            warnings.push(Globalize.localize('ErrorNoServicioBasico'));

        if (isNull(params.IdTipoMoneda))
            warnings.push(Globalize.localize('ErrorNoTipoMoneda'));

        if (isEmpty(params.Monto))
            warnings.push(Globalize.localize('ErrorNoMonto'));

        if (isEmpty(params.Fecha)) {
            warnings.push(Globalize.localize('ErrorNoFecha'));
        } else {
            var fechaActual = new Date();
            if ($('#txt-fecha-crear').datepicker('getDate') > fechaActual)
                warnings.push(Globalize.localize('ErrorFechaMayorHoy'));
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
                url: SiteUrl + 'Haber/Guardar',
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
                            $('#tb-haberes').table('update');
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
        url: SiteUrl + 'Haber/PopUpCrear',
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

/////////////////// PopUp Editar /////////////////////////
function PopUpEditar(idHaber) {
    //$.blockUI({ message: null });
    var popup = null;
    var buttons = {};
    /***************************************************************************/
    buttons[Globalize.localize('Guardar')] = function () {
        var params = {};

        params.IdHaber = idHaber;
        params.IdEmpresa = $('#cbx-empresa-crear').combobox('getId');
        params.IdTipoHaber = $('#cbx-tipo-haber-crear').combobox('getId');
        params.IdServicioBasico = $('#cbx-servicio-basico-crear').combobox('getId');
        params.IdTipoMoneda = $('#cbx-tipo-moneda-crear').combobox('getId');
        params.Fecha = $('#txt-fecha-crear').val();
        params.Monto = $('#txt-monto-crear').val();
        params.Observacion = $('#txt-observacion-crear').val().trim();

        var warnings = new Array();

        if (isNull(params.IdTipoHaber))
            warnings.push(Globalize.localize('ErrorNoTipoHaber'));

        if (isNull(params.IdServicioBasico))
            warnings.push(Globalize.localize('ErrorNoServicioBasico'));

        if (isNull(params.IdTipoMoneda))
            warnings.push(Globalize.localize('ErrorNoTipoMoneda'));

        if (isEmpty(params.Monto))
            warnings.push(Globalize.localize('ErrorNoMonto'));

        if (isEmpty(params.Fecha)) {
            warnings.push(Globalize.localize('ErrorNoFecha'));
        } else {
            var fechaActual = new Date();
            if ($('#txt-fecha-crear').datepicker('getDate') > fechaActual)
                warnings.push(Globalize.localize('ErrorFechaMayorHoy'));
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
                url: SiteUrl + 'Haber/Guardar',
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
                            $('#tb-haberes').table('update');
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
        title: Globalize.localize('TituloPopUpEditar'),
        url: SiteUrl + 'Haber/PopUpEditar',
        open: function (event, ui) {
            popup = $(this);
            //$.unblockUI();
        },
        buttons: buttons,
        heigth: 500,
        width: 800
    }, false, function () {
            $('#txt-monto-crear').autoNumeric(AutoNumericDecimal);
            $('input.datepicker').compDatepicker();
            /********************************/
            $('.ui-datepicker-trigger').attr("src", imgCal);
            /********************************/
            $('.box-datepicker').removeClass("small");

            $('#cbx-tipo-moneda-crear').combobox(DefaultCombobox({
                url: SiteUrl + 'Parametrico/SimpleSearchTipoMoneda',
                toolbar: {
                    reset: function () { }
                }
            }));

            $('#cbx-tipo-haber-crear').combobox(DefaultCombobox({
                url: SiteUrl + 'Parametrico/SimpleSearchTipoHaber',
                toolbar: {
                    reset: function () { }
                }
            }));

            $('#cbx-servicio-basico-crear').combobox(DefaultCombobox({
                url: SiteUrl + 'Parametrico/SimpleSearchServicioBasico',
                toolbar: {
                    reset: function () { }
                }
            }));
            $('#cbx-empresa-crear').combobox(DefaultCombobox({
                url: SiteUrl + 'Parametrico/SimpleSearchEmpresas'
            }));

            $('#cbx-empresa-crear').combobox('disableText');

            $.ajax({
                url: SiteUrl + 'Haber/Obtener',
                data: $.toJSON({ idHaber: idHaber }),
                success: function (res) {
                    $.unblockUI();
                    $('#txt-observacion-crear').val(res.Data.Haber.Observacion);
                    $('#txt-monto-crear').val(res.Data.Haber.Monto);
                    $('#txt-fecha-crear').val(res.Data.Haber.Fecha);

                    $('#cbx-empresa-crear')
                        .combobox('setId', res.Data.Haber.Empresa.Id)
                        .combobox('setValue', res.Data.Haber.Empresa.Nombre)
                        .combobox('setData', res.Data.Haber.Empresa);

                    $('#cbx-tipo-haber-crear')
                        .combobox('setId', res.Data.Haber.TipoHaber.Id)
                        .combobox('setValue', res.Data.Haber.TipoHaber.Nombre)
                        .combobox('setData', res.Data.Haber.TipoHaber);

                    $('#cbx-servicio-basico-crear')
                        .combobox('setId', res.Data.Haber.ServicioBasico.Id)
                        .combobox('setValue', res.Data.Haber.ServicioBasico.Nombre)
                        .combobox('setData', res.Data.Haber.ServicioBasico);

                    $('#cbx-tipo-moneda-crear')
                        .combobox('setId', res.Data.Haber.TipoMoneda.Id)
                        .combobox('setValue', res.Data.Haber.TipoMoneda.Nombre)
                        .combobox('setData', res.Data.Haber.TipoMoneda);
                }
            });
    });
}
function ObtenerEmpresaPorDefecto() {
    $.blockUI();
    $.ajax({
        url: SiteUrl + 'Parametrico/GetEmpresaPorDefecto',
        success: function (res) {
            $.unblockUI();
            $('#cbx-empresa')
                .combobox('setId', res.Data.Empresa.Id)
                .combobox('setValue', res.Data.Empresa.Nombre)
                .combobox('setData', res.Data.Empresa);

            if (primeraCarga) {
                primeraCarga = false;
                $('#tb-haberes').table('update');
            }
        }
    });
}