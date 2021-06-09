// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function showAlert(text, isError, dismissTimeOut) {
    let error_message = text.replace(/\n/g, '<br />');
    var dialog = bootbox.dialog({
        message: '<div class="alert ' + (isError ? 'alert-danger' : 'alert-success') + ' text-center" role="alert" style="margin-top: 22px;"><i class="fa fa-' + (isError ? 'exclamation-triangle' : 'check-circle') + '"></i>&nbsp;<strong>' + error_message + '</strong></div>',
        closeButton: true
    });
    let n_dismissTimeOut = 3000;
    if ((typeof (dismissTimeOut) !== 'undefined') && (!isNaN(dismissTimeOut))) {
        n_dismissTimeOut = parseInt(dismissTimeOut, 10) * 1000;
    }
    setTimeout(function () {
        dialog.modal('hide');
    }, n_dismissTimeOut);
}// end function showAlert

function TopAlert(alertText, alertType, dismissTimeOut) {
    switch ($.trim(alertType).toLowerCase()) {
        case 'primary':
        case 'secondary':
        case 'success':
        case 'info':
        case 'warning':
        case 'danger':
        case 'light':
        case 'dark':
            alertType = $.trim(alertType).toLowerCase();
            break;
        default:
            alertType = 'primary';
    }// end switch

    var top = $('.TopAlert').map(function () {
        return $(this).position().top + $(this).height() + 50;
    }).get().reduce((max, cur) => Math.max(max, cur), 65);
    if (top < 65)
        top = 65;

    var id = $('.TopAlert').length;

    var alertHtml = `
<div class ="TopAlert alert alert-${alertType} alert-dismissible fade show container fixed-top" role="alert" style="z-index: 1100; top:${top}px;" data-id="${id}">
  <button type="button" class="close TopAlertCloseButton" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  ${alertText.replace(/\n/g, '<br />')}
</div>`;
    $('body').prepend(alertHtml);

    dismissTimeOut = dismissTimeOut | 0;
    if (dismissTimeOut > 0)
        setTimeout(function () {
            //$('.TopAlert[data-id="' + id + '"]').alert('close');
            $('.TopAlert[data-id="' + id + '"] .TopAlertCloseButton').click();
        }, dismissTimeOut * 1000);
}// end function TopAlert
