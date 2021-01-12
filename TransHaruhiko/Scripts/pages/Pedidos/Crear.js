$(document).ready(function () {
    ///// Combos /////
    $('#cbx-empresa-crear').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchEmpresas',
        fnSelect: function () {
            $('#cbx-clientes-crear').combobox('reset');
            $('#cbx-clientes-crear').combobox('enable');
        },
    }));
    $('#cbx-clientes-crear').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchCliente',
        fnParams: function () {
            return {
                IdEmpresa: $('#cbx-empresa-crear').combobox('getId')
            };
        },
        toolbar: {
            reset: function () { }
        }
    }));
    ObtenerEmpresaPorDefectoCrear();
    $('#cbx-empresa-crear').combobox('disableText');
});
function ObtenerEmpresaPorDefectoCrear() {
    $.blockUI();
    $.ajax({
        url: SiteUrl + 'Parametrico/GetEmpresaPorDefecto',
        success: function (res) {
            $.unblockUI();
            $('#cbx-empresa-crear')
                .combobox('setId', res.Data.Empresa.Id)
                .combobox('setValue', res.Data.Empresa.Nombre)
                .combobox('setData', res.Data.Empresa);
        }
    });
}


