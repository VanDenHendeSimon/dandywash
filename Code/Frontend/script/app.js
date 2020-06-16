"use strict";


//#region ***  DOM references ***
let htmlBleekImage, htmlDonkerImage, htmlBleekPercentage, htmlDonkerPercentage;
//#endregion

const getPercentageDone = function(remaining, duurtijd) {
    if (remaining > duurtijd) {
        return 0;
    }   else {
        return Math.round()
    }
}

const wasCanceled = function(jsonObject) {
    window.location.href = 'index.html';
}

const cancelWas = function(volgnummer) {
    handleData(`${endPoint}/cancel_was/${volgnummer}`, wasCanceled, null, 'DELETE', null);
}

//#region ***  Callback-Visualisation - show___ ***
const showBasketInfo = function(percentageFilled, currentlyWashing) {

    console.log(percentageFilled, currentlyWashing);

    let srcBleek = "img/wasmand";
    let srcDonker = "img/wasmand";

    let bleekCTA = "Wassen";
    let donkerCTA = "Wassen";

    let bleekDisabled = "";
    let donkerDisabled = "";

    let wasVolgnummer = 0;

    // Percentages
    let donkerPercentage = percentageFilled.donker;
    let bleekPercentage = percentageFilled.bleek;

    if (currentlyWashing) {
        wasVolgnummer = currentlyWashing.Volgnummer;

        if (currentlyWashing.Beschrijving === 'donker') {
            // Overwrite donker
            srcDonker = "img/wasmachine";
            donkerCTA = currentlyWashing.Remaining > 100 ? "Annuleren" : "Stoppen";
            donkerPercentage = currentlyWashing.Remaining > 100 ? 0 : currentlyWashing.Remaining;

            bleekDisabled = "c-cta--disabled";
            
        }   else {
            // Overwrite bleek
            srcBleek = "img/wasmachine";
            bleekCTA = currentlyWashing.Remaining > 100 ? "Annuleren" : "Stoppen";
            bleekPercentage = currentlyWashing.Remaining > 100 ? 0 : currentlyWashing.Remaining;
            
            donkerDisabled = "c-cta--disabled";
        }
    }

    document.querySelector('.js-content-holder').innerHTML = `
            <div class="o-layout o-layout--gutter o-layout--gutter-lg o-layout--align-center">
            <div class="u-1-of-2-bp2 o-layout__item c-machine-state c-machine-state--donker">
            <h2 class="c-machine-state__title">Donker</h2>
            <p class="c-machine-state__percentage js-donker-percentage">0%</p>
            <figure class="c-machine-state__figure u-max-height-md">
                <picture class="c-picture u-max-height-md u-display-block">
                    <div class="c-img-disabled">
                        <img class="u-max-height-md u-center-x u-display-block" src="${srcDonker}-disabled.png" alt="Intro afbeelding">
                    </div>
                    <div class="js-donker-img">
                    <img class="u-max-height-md u-center-x u-display-block" src="${srcDonker}-enabled.png" alt="Intro afbeelding">
                    </div>
                </picture>
            </figure>
            <div class="c-cta js-wash-me ${donkerDisabled}" data-basket="donker" data-washistoriek-id="${wasVolgnummer}">
                <a href="#!" class="c-link-cta">${donkerCTA}</a>
            </div>
            </div>
            <div class="u-1-of-2-bp2 o-layout__item c-machine-state c-machine-state--bleek">
            <h2 class="c-machine-state__title">Bleek</h2>
            <p class="c-machine-state__percentage js-bleek-percentage">0%</p>
            <figure class="c-machine-state__figure u-max-height-md">
                <picture class="c-picture u-max-height-md u-display-block">
                    <div class="c-img-disabled">
                        <img class="u-max-height-md u-center-x u-display-block" src="${srcBleek}-disabled.png" alt="Intro afbeelding">
                    </div>
                    <div class="js-bleek-img">
                    <img class="u-max-height-md u-center-x u-display-block" src="${srcBleek}-enabled.png" alt="Intro afbeelding">
                    </div>
                </picture>
            </figure>
            <div class="c-cta js-wash-me ${bleekDisabled}" data-basket="bleek" data-washistoriek-id="${wasVolgnummer}">
                <a href="#!" class="c-link-cta">${bleekCTA}</a>
            </div>
            </div>
        </div>
    `;

    getGlobalHtmlElements();
    listenToUI();

    if (currentlyWashing) {
        if (currentlyWashing.Beschrijving === 'donker') {
            htmlBleekPercentage.innerHTML = `${Math.round(bleekPercentage)}%`;

            if (donkerPercentage === 0) {
                htmlDonkerPercentage.innerHTML = `Start om ${currentlyWashing.Start}`;

            }   else {
                donkerPercentage = 100 - donkerPercentage;
                htmlDonkerPercentage.innerHTML = `${Math.round(donkerPercentage)}%`;
            }

        }   else {
            htmlDonkerPercentage.innerHTML = `${Math.round(donkerPercentage)}%`;

            if (bleekPercentage === 0) {
                htmlBleekPercentage.innerHTML = `Start om ${currentlyWashing.Start}`;

            }   else {
                bleekPercentage = 100 - bleekPercentage;
                htmlBleekPercentage.innerHTML = `${Math.round(bleekPercentage)}%`;
            }
        }

    }   else {
        htmlDonkerPercentage.innerHTML = `${Math.round(donkerPercentage)}%`;
        htmlBleekPercentage.innerHTML = `${Math.round(bleekPercentage)}%`;
    }

    // Masks (100% = bottom, 0% = top => invert values)
    // 0 - 100 => 5 - 95 (5% witruimte boven en onde de effectieve afbeelding)
    donkerPercentage = (100 - donkerPercentage) / 100 * 90 + 5;
    bleekPercentage = (100 - bleekPercentage) / 100 * 90 + 5;

    // https://bennettfeely.com/clippy/ For the clip path
    const donkerClipPath = `polygon(49% ${0 + donkerPercentage}%, 66% ${2 + donkerPercentage}%, 84% ${5 + donkerPercentage}%, 100% ${2 + donkerPercentage}%, 100% 100%, 0 100%, 0 ${10 + donkerPercentage}%, 14% ${6 + donkerPercentage}%, 29% ${1 + donkerPercentage}%)`;
    const bleekClipPath = `polygon(49% ${0 + bleekPercentage}%, 66% ${2 + bleekPercentage}%, 84% ${5 + bleekPercentage}%, 100% ${2 + bleekPercentage}%, 100% 100%, 0 100%, 0 ${10 + bleekPercentage}%, 14% ${6 + bleekPercentage}%, 29% ${1 + bleekPercentage}%)`;

    htmlDonkerImage.style.setProperty('-webkit-clip-path', donkerClipPath);
    htmlDonkerImage.style.setProperty('clip-path', donkerClipPath);
    htmlDonkerImage.style.setProperty('opacity', 1);

    htmlBleekImage.style.setProperty('-webkit-clip-path', bleekClipPath);
    htmlBleekImage.style.setProperty('clip-path', bleekClipPath);
    htmlBleekImage.style.setProperty('opacity', 1);
}
//#endregion

//#region ***  Callback-No Visualisation - callback___  ***
//#endregion

//#region ***  Data Access - get___ ***
const getGlobalHtmlElements = function() {
    htmlBleekImage = document.querySelector('.js-bleek-img');
    htmlBleekPercentage = document.querySelector('.js-bleek-percentage');
    htmlDonkerImage = document.querySelector('.js-donker-img');
    htmlDonkerPercentage = document.querySelector('.js-donker-percentage');
}
//#endregion

//#region ***  Event Listeners - listenTo___ ***
const listenToSockets = function() {
    socketio.on("B2F_ConnectionReceived", function (payload) {
        showBasketInfo(payload.percentageFilled, payload.currentlyWashing);
    });

    socketio.on("B2F_BasketUpdate", function (payload) {
        showBasketInfo(payload.percentageFilled, payload.currentlyWashing);
    });
}

const listenToUI = function() {
    for(const htmlCTA of document.querySelectorAll('.js-wash-me')) {
        htmlCTA.addEventListener('click', function() {
            if (!htmlCTA.classList.contains('c-cta--disabled')) {
                console.log(htmlCTA.innerHTML);
                if (htmlCTA.querySelector('.c-link-cta').innerHTML === 'Wassen') {
                    window.location.href = `programma_selectie.html?mand=${this.getAttribute('data-basket')}`;
                }   else {
                    const washistoriekId = this.getAttribute('data-washistoriek-id');

                    htmlDeleteConfirmDialog.style.setProperty("opacity", 1);
                    htmlDeleteConfirmDialog.style.setProperty(
                        "pointer-events",
                        "all"
                    );
                    htmlDeleteConfirmDialog.style.setProperty("left", "50%");
                    htmlDeleteConfirmDialog.style.setProperty("top", "25%");
    
                    htmlDeleteCancel.addEventListener("click", function () {
                        htmlDeleteConfirmDialog.style.setProperty("opacity", 0);
                        htmlDeleteConfirmDialog.style.setProperty(
                            "pointer-events",
                            "none"
                        );
                        htmlDeleteConfirmDialog.style.setProperty("left", "0");
                    });
    
                    htmlDeleteConfirm.addEventListener("click", function () {
                        cancelWas(washistoriekId);
                    });
                }
            }   else {
                console.log('TODO: Toch doorlaten naar programma\'s, maar die blokkeren met een langere duurtijd dan het huidig geschedulde programma, niet mvp');
            }
        })
    }
}
//#endregion

//#region ***  INIT / DOMContentLoaded  ***
const init = function() {
    console.log("DOM Content Loaded");
    listenToSockets();
}
//#endregion

document.addEventListener("DOMContentLoaded", init);
