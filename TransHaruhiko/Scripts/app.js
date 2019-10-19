﻿(function ($) {
    $.widget('if.combobox', $.if.combobox,
        {
            setReadOnly: function () {
                var self = this;
                self.input.attr('readonly', "");
            }
        })
})(jQuery);


$(document).ready(function () {

    $.tableSetup({
        bJQueryUI: true,
        aLengthMenu: [
            $.map(RegistrosPorPagina.split("|"), function (item) {
                return parseInt(item);
            }),
            $.map(RegistrosPorPagina.split("|"), function (item) {
                return parseInt(item);
            })],
        iDisplayLength: parseInt(RegistrosPorPagina.split("|")[0])
        //bLengthChange  : false
    });
    /************************************/
    $.comboboxSetup({
        delay: 900,
        textOverlabel: "Seleccione",
        messageLoading: ImgLoading
            .attr("title", "Cargando")
            .attr("alt", "Cargando"),
        pageable: true,
        configButtonPrev: {
            label: "Anterior",
            text: true,
            icons: {}
        },
        configButtonNext: {
            label: "Siguiente",
            text: true,
            icons: {}
        }
    });

    /*********************************/
    $.ajaxSetup({
        cache: false,
        type: "POST",
        contentType: "application/json"
    });
    /********************************/
    $('input.datepicker').compDatepicker();
    /********************************/
    $('.ui-datepicker-trigger').attr("src", imgCal);
    /********************************/
    $('.box-datepicker').removeClass("small");
    /*******************************/
});

function BlockFullPage() {
    $('#main-wrapper').block();
}

function UnblockFullPage() {
    $('#main-wrapper').unblock();
}
