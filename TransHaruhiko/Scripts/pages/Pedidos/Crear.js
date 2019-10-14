$(document).ready(function () {
    ///// Combos /////
    $('#cbx-clientes-crear').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchAnyoAcademico',
        fnSelect: function () {
            if ($('#cbx-curso-academico-crear').combobox('getId') != $('#txt-idcurso-aux-crear').val()) {
                if ($('#cbx-tipo-crear').combobox('getId') != null) {
                    if ($('#box-modulos-crear').jstree("get_bottom_checked").length > 0 &&
                        $('#box-modulos-crear').find("li").length > 0) {
                        var idTipoAux = $('#cbx-tipo-crear').combobox('getId');
                        var tipoAux = $('#cbx-tipo-crear').combobox('getValue');
                        var idCursoAux = $('#cbx-curso-academico-crear').combobox('getId');
                        var cursoAux = $('#cbx-curso-academico-crear').combobox('getValue');
                        showConfirmation({
                            title: Globalization.localize('TitlePopUp'),
                            open: function (event, ui) {
                                popup = $(this);
                                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                            },
                            message: Globalize.localize('TextCambiarAlcance'),
                            buttonFunctionYes: function () {
                                var aux = $('#cbx-curso-academico-crear', '#popup-alcance-crear').combobox('getText').split('-');
                                var yy1 = aux[0].substring(2);
                                var yy2 = aux[1].substring(2);
                                AnioAcademico = yy1 + "/" + yy2;
                                $('#txt-curso-aux-crear', '#popup-alcance-crear').val(cursoAux);
                                $('#txt-idcurso-aux-crear', '#popup-alcance-crear').val(idCursoAux);
                                $('#txt-tipo-aux-crear', '#popup-alcance-crear').val(tipoAux);
                                $('#txt-idtipo-aux-crear', '#popup-alcance-crear').val(idTipoAux);
                                if (idTipoAux != 3) {//IPN
                                    CargarArbolCrear(idTipoAux, tipoAux, idCursoAux, cursoAux);
                                } else {
                                    localStorage.removeItem('jstree');
                                    $('#box-modulos-crear', '#popup-alcance-crear').jstree("destroy");
                                    $('#cbx-tipo-crear').combobox('setId', idTipoAux);
                                    $('#cbx-tipo-crear').combobox('setValue', tipoAux);
                                }
                                popup.dialog('close');

                            },
                            buttonFunctionNo: function () {
                                $('#cbx-curso-academico-crear', '#popup-alcance-crear').combobox('setId', $('#txt-idcurso-aux-crear', '#popup-alcance-crear').val());
                                $('#cbx-curso-academico-crear', '#popup-alcance-crear').combobox('setValue', $('#txt-curso-aux-crear', '#popup-alcance-crear').val());
                                popup.dialog('close');
                            }
                        });
                    } else {
                        var aux = $('#cbx-curso-academico-crear').combobox('getText').split('-');
                        var yy1 = aux[0].substring(2);
                        var yy2 = aux[1].substring(2);
                        AnioAcademico = yy1 + "/" + yy2;
                        $('#txt-tipo-aux-crear').val($('#cbx-tipo-crear').combobox('getValue'));
                        $('#txt-idtipo-aux-crear').val($('#cbx-tipo-crear').combobox('getId'));
                        $('#txt-curso-aux-crear').val($('#cbx-curso-academico-crear').combobox('getValue'));
                        $('#txt-idcurso-aux-crear').val($('#cbx-curso-academico-crear').combobox('getId'));
                        if ($('#cbx-tipo-crear').combobox('getId') != 3) {//IPN
                            CargarArbolCrear();
                        }
                    }
                }
            }
        },
        toolbar: {
            reset: function () {
                if ($('#box-modulos-crear').jstree("get_bottom_checked").length > 0 && $('#box-modulos-crear').find("li").length > 0) {
                    showConfirmation({
                        title: Globalize.localize('TitlePopUp'),
                        open: function (event, ui) {
                            popup = $(this);
                            $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                        },
                        message: Globalize.localize('TextCambiarAlcance'),
                        buttonFunctionYes: function () {
                            localStorage.removeItem('jstree');
                            $('#box-modulos-crear').jstree("destroy");
                            $('#txt-idcurso-aux-crear').val("");
                            $('#txt-curso-aux-crear').val("");
                            popup.dialog('close');
                        },
                        buttonFunctionNo: function () {
                            $('#cbx-curso-academico-crear').combobox('setId', $('#txt-idcurso-aux-crear').val());
                            $('#cbx-curso-academico-crear').combobox('setValue', $('#txt-curso-aux-crear').val());
                            popup.dialog('close');
                        }
                    });
                } else {
                    $('#txt-idcurso-aux-crear').val("");
                    $('#txt-curso-aux-crear').val("");
                    localStorage.removeItem('jstree');
                    $('#box-modulos-crear').jstree("destroy");
                }
            }
        }
    })).combobox('setReadOnly');

    $('#cbx-encuesta-crear').combobox(DefaultCombobox({
        url: SiteUrl + 'Parametrico/SimpleSearchEncuestas',
        toolbar: {
            reset: function () { }
        }//,
        //fnSelect: function () {
        //    $('#cbx-encuesta-crear').next().find('input').attr('title', $('#cbx-encuesta-crear').combobox('getValue'));
        //}
    }));
    

});


