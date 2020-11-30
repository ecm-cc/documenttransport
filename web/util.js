/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/**
 * Shows a MDC Snackbar, used for errors
 * @param {string} text Text to be shown
 */
function failSnackbar(text) {
    $('.mdc-snackbar__surface').css('background-color', '#B00020');
    $('.mdc-snackbar__label').css('color', '#FFFFFF');
    $('.mdc-snackbar__label').text(text);
    snackBar.open();
    $('.mdc-snackbar__action').on('click', () => { snackBar.close(); });
}

/**
 * Shows a MDC Snackbar, used for the success messages
 * @param {string} text Text to be shown
 */
function successSnackbar(text) {
    $('.mdc-snackbar__surface').css('background-color', '#43A047');
    $('.mdc-snackbar__label').css('color', '#FFFFFF');
    $('.mdc-snackbar__label').text(text);
    snackBar.open();
    $('.mdc-snackbar__action').on('click', () => { snackBar.close(); });
}

/**
 * Shows a gray overlay for loading purposes
 */
function showOverlay() {
    $('#overlay').show();
}

/**
 * Hides a gray overlay when content is loaded
 */
function hideOverlay() {
    $('#overlay').hide();
}
