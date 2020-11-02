/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let metaData = {};
let importSet = {};
const httpOptions = {
    headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/hal+json',
    },
};

window.onload = async () => {
    initMDCElements();
    metaData = $('#metaData').data('meta');
    await $.getScript(`${metaData.assetBasePath}/util.js`);
};

function initMDCElements() {
    mdc.list.MDCList.attachTo(document.querySelector('.mdc-list'));
    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));
    dialog = mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'));
    snackBar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
    snackBar.timeoutMs = 10000;
}

function useImportSet(index) {
    showOverlay();
    importSet = JSON.parse(index);
    $('#importset-list').removeAttr('open');
    renderSelectedImportSet();
    hideOverlay();
}

function renderSelectedImportSet() {
    $('#importset-title').text(`Ausgewähltes Set "${importSet.name}" von ${importSet.stage} mit ${importSet.count} Dokument${importSet.count > 1 ? 'en' : ''}`);
    $('#importset-title').append('TODO: Infos und Dokumente über das ImportSet sammeln.');
}

function doImport() {
    dialog.open();
    dialog.listen('MDCDialog:closed', (reason) => {
        if (reason.detail.action === 'ok') {
            showOverlay();
            $.ajax({
                method: 'PUT',
                url: '/able-documenttransport/sets/set',
                data: { set: JSON.stringify(importSet) },
            }).done(() => {
                successSnackbar(`Das Set "${importSet.name}" wurde erfolgreich importiert.`);
            }).fail((err) => {
                console.error(err);
                failSnackbar(`Der Import konnte aufgrund eines Fehlers nicht durchgeführt werden: ${err.responseText ? err.responseText : err}`);
            }).always(() => {
                hideOverlay();
            });
        }
    });
}
