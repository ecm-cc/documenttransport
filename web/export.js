/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const exportSet = {
    name: '',
    template: false,
    elements: [],
};
let metaData = {};
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
    mdc.checkbox.MDCCheckbox.attachTo(document.querySelector('.mdc-checkbox'));
    mdc.linearProgress.MDCLinearProgress.attachTo(document.querySelector('.mdc-linear-progress'));
    dialog = mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'));
    [].map.call(document.querySelectorAll('.mdc-text-field'), (el) => new mdc.textField.MDCTextField(el));
    snackBar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
    snackBar.timeoutMs = 10000;
}

function renderList() {
    $('.mdc-list').empty();
    $('#exportset-length').text(exportSet.elements.length);
    exportSet.elements.forEach((document) => {
        const listElem = [];
        listElem.push(`<li class="mdc-list-item" id="${document.id}"><span class="mdc-list-item__ripple">`);
        listElem.push('</span><span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">');
        listElem.push(document.caption);
        listElem.push('</span><span class="mdc-list-item__secondary-text">');
        listElem.push(document.category.displayName);
        listElem.push(`</span></span><span class="material-icons remove-exportset" onclick="removeElement('${document.id}')">`);
        listElem.push('remove_circle_outline</span></li>');
        $('.mdc-list').append(listElem.join(''));
    });
}

async function buildExportSet() {
    showOverlay();
    const searchQuery = getSearchQuery();
    if (searchQuery !== '' && (searchQuery.includes('objectdefinitionids') || searchQuery.includes('fulltext'))) {
        httpOptions.url = `${searchQuery}&pagesize=999`;
        const searchResult = await $.ajax(httpOptions);
        const filtered = searchResult.items.filter((item) => !item.mimeType.includes('application/vnd.dvelop.folder'));
        filtered.forEach((item) => {
            exportSet.elements.push(item);
        });
        renderList();
    } else {
        failSnackbar('Bitte starten Sie einen Suchvorgang mit mindestens einem Filter!');
    }
    hideOverlay();
}

function removeElement(id) {
    exportSet.elements.splice(exportSet.elements.findIndex((elem) => elem.id === id), 1);
    renderList();
}

function clearElements() {
    exportSet.elements = [];
    $('#exportset-length').text(0);
    $('.mdc-list').empty();
}

function sendExport() {
    dialog.open();
    dialog.listen('MDCDialog:closed', (reason) => {
        if (reason.detail.action === 'ok') {
            showOverlay();
            exportSet.name = $('.mdc-text-field__input').val();
            exportSet.template = $('.mdc-checkbox__native-control').is(':checked');
            exportSet.elements = JSON.stringify(exportSet.elements);
            $.ajax({
                method: 'POST',
                url: '/able-documenttransport/sets/set',
                data: exportSet,
            }).done(() => {
                exportSet.elements = JSON.parse(exportSet.elements);
                successSnackbar(`Das Set "${exportSet.name}" wurde erfolgreich exportiert.`);
                clearElements();
            }).fail((err) => {
                console.error(err);
                exportSet.elements = JSON.parse(exportSet.elements);
                if (err.status === 413) {
                    const size = Math.round(new TextEncoder().encode(JSON.stringify(exportSet)).length / 1024);
                    failSnackbar(`Der Export konnte nicht abgesendet werden, da das Exportset zu groß ist (${size} KB von maximalen 100 KB).`);
                } else {
                    failSnackbar(`Der Export konnte aufgrund eines Fehlers nicht abgesendet werden: ${err.responseText ? err.responseText : err}`);
                }
            }).always(() => {
                hideOverlay();
            });
        }
    });
}

function getSearchQuery() {
    let searchQuery = '';
    Array.prototype.forEach.call(window.top, (frame) => {
        if (frame.document.location.href.includes('/sr/?')) {
            searchQuery = frame.document.location.href;
        }
    });
    return searchQuery;
}
