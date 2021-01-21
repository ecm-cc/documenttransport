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
    $('.mdc-checkbox__native-control').on('click', () => {
        if ($('.mdc-checkbox__native-control').is(':checked')) {
            $('.text-field-wrapper').show();
        } else {
            $('.text-field-wrapper').hide();
        }
    });
}

function useImportSet(index) {
    showOverlay();
    importSet = JSON.parse(index);
    $('#importset-list').removeAttr('open');
    renderSelectedImportSet();
    hideOverlay();
}

function renderSelectedImportSet() {
    getCategoryTextFields();
    $('#importset-title').text(`"${importSet.name}" von ${importSet.stage} mit ${importSet.count} Dokument${importSet.count > 1 ? 'en' : ''}`);
    importSet.documents.name.forEach((documentName, index) => {
        const listElem = [];
        listElem.push(`<li class="mdc-list-item" id="${importSet.documents.id[index]}">
                            <span class="mdc-list-item__ripple"></span>
                            <span class="mdc-list-item__text">
                                <span class="mdc-list-item__primary-text">${documentName}</span>
                                <span class="mdc-list-item__secondary-text">${importSet.documents.category[index].displayName}</span>
                            </span>
                        </li>`);
        $('#importset-details').append(listElem.join(''));
    });
}

function getCategoryTextFields() {
    const textFields = [];
    const categories = removeDuplicateCategories();
    textFields.push('<span class="mdc-typography--body1">Bitte Werte für die Elemente angeben, die in eine andere Akte importiert werden sollen!</span><br/>');
    categories.forEach((category) => {
        const uniqueFields = metaData.config.uniqueFields[category.key];
        const uniqueFieldId = uniqueFields[uniqueFields.length - 1];
        const uniqueFieldName = metaData.uniqueFieldNames.find((name) => name[uniqueFieldId])[uniqueFieldId];
        if (uniqueFieldId) {
            textFields.push(`<span class="mdc-typography--body1">${category.displayName}: </span>`);
            textFields.push(`<label class="mdc-text-field mdc-text-field--outlined">
                                <input type="text" class="mdc-text-field__input" data-category="${category.displayName}" 
                                    id="${uniqueFieldId}" aria-labelledby="${uniqueFieldId}">
                                <span class="mdc-notched-outline">
                                    <span class="mdc-notched-outline__leading"></span>
                                    <span class="mdc-notched-outline__notch">
                                        <span class="mdc-floating-label">${uniqueFieldName}</span>
                                    </span>
                                    <span class="mdc-notched-outline__trailing"></span>
                                </span>
                            </label>
                            <br/>`);
        }
    });
    $('.text-field-wrapper').html(textFields.join(''));
    [].map.call(document.querySelectorAll('.mdc-text-field'), (el) => new mdc.textField.MDCTextField(el));
}

function removeDuplicateCategories() {
    const seenCategories = {};
    return importSet.documents.category.filter((currentObject) => {
        if (currentObject.key in seenCategories) {
            return false;
        }
        seenCategories[currentObject.key] = true;
        return true;
    });
}

function doImport() {
    dialog.open();
    dialog.listen('MDCDialog:closed', (reason) => {
        if (reason.detail.action === 'ok') {
            showOverlay();
            $.ajax({
                method: 'PUT',
                url: '/able-documenttransport/sets/set',
                data: { set: JSON.stringify(importSet), parentForCategory: getParentsForCategory(), newAttributes: [] },
            }).done(() => {
                successSnackbar(`Das Set "${importSet.name}" wurde erfolgreich importiert.`);
            }).fail((err) => {
                console.error(err);
                if (err.status === 409) {
                    failSnackbar(setFailedDocumentsText(err.responseJSON));
                } else {
                    failSnackbar(`Der Import konnte aufgrund eines Fehlers nicht durchgeführt werden: ${err.responseText ? err.responseText : err}`);
                }
            }).always(() => {
                hideOverlay();
            });
        }
    });
}

function getParentsForCategory() {
    const parentsForCategory = [];
    $('.mdc-text-field__input').each((i, element) => {
        if (element.value) {
            parentsForCategory.push({
                parentValue: element.value,
                parentField: element.id,
                category: element.dataset.category,
            });
        }
    });
    return JSON.stringify(parentsForCategory);
}

function setFailedDocumentsText(response) {
    const { failedDocuments } = response;
    let snackBarMessage = 'Folgende Dokumente konnten nicht importiert werden:\n';
    failedDocuments.forEach((doc) => {
        snackBarMessage += `Dokument ${doc.name.caption} (ID: ${doc.id}) - ${doc.message.message}\n`;
    });
    return snackBarMessage;
}
