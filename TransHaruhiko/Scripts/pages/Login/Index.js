$(document).ready(function () {
    $('#btn-login').button();

    $('#btn-login').click(function() {
        $.blockUI({ message: null });
        $.ajax({
            url: SiteUrl + 'Login/ValidarUsuario',
            //data: $.toJSON(params),
            data: $.toJSON({ nickName: $('#txt-usuario').val(), password: $('#txt-password').val()}),
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
                        window.location.href = SiteUrl + 'Home/Index';
                    }
                }
            }
        });
    });

});


