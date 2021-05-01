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

    $.widget('if.combobox', $.if.combobox,
      {
          disableText: function () {
              var self = this;
              self.input.disable();
              self.input.css("background-color", "white");
          },
          enableText: function () {
              var self = this;
              self.input.enable();
              self.input.css("background-color", "");
          }
      })

    /*********************************/
    $.ajaxSetup({
        cache: false,
        type: "POST",
        contentType: "application/json"
    });
    /********************************/
    $('.datepicker').compDatepicker();
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

function ValidateURL(textval) {
    var urlregex = new RegExp(
          "^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.){1}([0-9A-Za-z]+\.)");
    return urlregex.test(textval);
}

var AutoNumericInteger = {
    mDec: 0,
    aSep: '',
    aDec: ','
};

var AutoNumericDecimal = {
    mDec: 2,
    aSep: ',',
    aDec: '.'
};

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/******************************************************************************/
function gotoController(controller) {
    if (controller) {
        window.location.href = SiteUrl + controller;
    } else {
        window.location.href = SiteUrl;
    }
}