$(document).ready(function () {

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
            $('#cbx-tipo-moneda-crear')
                .combobox('setId', 1)
                .combobox('setValue', "Bolivianos");
        }
    });
}
