$(document).ready(function () {
    ///// Combos /////
    $('#cbx-clientes-crear').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchCliente',
        toolbar: {
            reset: function() {}
        }
    }));
});


