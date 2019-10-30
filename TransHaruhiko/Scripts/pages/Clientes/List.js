$(document).ready(function () {
    var tabla = $('#tb-clientes');
    $('#btn-buscar').button();
    $('#btn-limpiar').button();
    $('#btn-crear').button();

    $('#btn-limpiar').click(function () {
        $('#txt-nombre').val("");
        $('#txt-carnet').val("");
    });
    $('#btn-buscar').click(function () {
        tabla.table('update');
    });
    $('#btn-crear').click(function () {
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
        aaSorting: [[6, 'asc']],
        aoColumns: [
            {
                sTitle: Globalize.localize('ColumnId'),
                sWidth: "70px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnCarnet'),
                sWidth: "50px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnNombre'),
                sWidth: "170px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnTelefono'),
                sWidth: "50px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnEmail'),
                sWidth: "100px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnActivo'),
                sWidth: "50px",
                bSortable: false
            },
            {
                sTitle: Globalize.localize('ColumnAcciones'),
                sWidth: "100px",
                bSortable: false
            },
        ],
        bServerSide: true,
        sAjaxSource: SiteUrl + 'Cliente/Buscar',
        fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('.btn-editar', nRow).click(function () {
                PopUpEditar($(nRow).data('data').Cliente.Id);
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
                    2, 'Nombre'
                ]);
            params.OrderDirection = paramsTabla.sSortDir_0;
            /******************************************************************/

            params.Nombre = $('#txt-nombre').val();
            params.Carnet = $('#txt-carnet').val();

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

                                tempAcciones += '</div>';

                                row.push(value.Cliente.Id);
                                row.push(value.Cliente.Carnet);
                                //row.push('<span  title="'
                                //        + value.Pedido.Descripcion + '">'
                                //        + summary(value.Pedido.Descripcion, 35, '...')
                                //        + '</span>');
                                row.push(value.Cliente.NombreCompleto);
                                row.push(value.Cliente.Telefono);
                                row.push(value.Cliente.Email);
                                row.push('<input class="chk-visible" type="checkbox" ' + (value.Cliente.Activo ? 'checked="checked"' : '')
                                               + 'disabled >');
                                
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