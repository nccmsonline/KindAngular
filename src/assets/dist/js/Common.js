var StartFy = '';
var EndFy = '';
jQuery.extend(jQuery.expr[':'], {
    focusable: function (el, index, selector) {
        return $(el).is('a, button, :input, [tabindex]');
    }
});

$(document).on('keypress', 'input,select,mat-checkbox', function (e) {
    if (e.which == 13) {
        e.preventDefault();
        // Get all focusable elements on the page
        var $canfocus = $(':focusable');
        var index = $canfocus.index(document.activeElement) + 1;
        if (index >= $canfocus.length) index = 0;
        $canfocus.eq(index).focus();
    }
});

App = {}
App.Common =
{
    glbfinStart: '',
    glbfinEnd: '',
    glbFinYear: '',
    glbStoreId: '',
    glbisClosed: '0',
    glbGraceDays: '0',
    glbCurrentYearId: '0',
    gbIsAdmin: false,
    Busy: function () {
        $('.busy_layer').remove();
        $(document.body).append('<div class="busy_layer"></div>');
        var winH = $(document).height();
        var winW = $(document).width();
        var layer = $('.busy_layer');
        layer.css({ 'height': winH, 'width': winW }).show();
        $(document.body).addClass('busy');
    },
    Free: function (form) {
        if (!form) {
            $(document.body).removeClass('busy');
            $('.wait_layer').remove();
            $('.busy_layer').remove();
        } else {
            form.find('.wait_layer').remove();
        }
    },

    
    CapitalizeTextBox: function () {
        $('input[type="text"]').bind('blur', function (evt) {
            txt = $(this).val();
            $(this).val(txt.toUpperCase());
        });
    },
};


function ErrorPopup(msg) {
    var msgResult = true;
    if (msg.length > 0) {
        $("#Validations").dialog({ title: "Error" });
        $("#Validations").dialog({
            height: 260,
            //autoOpen: false,
            modal: true,
            width: 300,
            buttons: {
                "Ok": function () {
                    $(this).dialog("close");
                },
            }
        });
        $("#errorInform").html(msg);
        msgResult = false;
    }
    else {
        msgResult = true;
    }
    return msgResult;
};








