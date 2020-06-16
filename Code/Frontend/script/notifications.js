"use strict";

const svgMapper = {
    'error': '<svg class="c-notification__icon" xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><path id="error-circle-o" d="M21,42A21,21,0,1,1,42,21,21.026,21.026,0,0,1,21,42ZM21,5.1A15.9,15.9,0,1,0,36.9,21,15.918,15.918,0,0,0,21,5.1h0Zm8.97,20.931a.719.719,0,0,0-.231-.534l-4.5-4.5,4.527-4.527A.73.73,0,0,0,30,15.936a.749.749,0,0,0-.237-.537L26.6,12.234A.749.749,0,0,0,26.061,12a.73.73,0,0,0-.534.231L21,16.755l-4.527-4.527A.73.73,0,0,0,15.939,12a.749.749,0,0,0-.537.237L12.237,15.4a.749.749,0,0,0-.237.537.73.73,0,0,0,.231.534L16.758,21l-4.527,4.5a.73.73,0,0,0-.231.534.749.749,0,0,0,.237.537L15.4,29.733a.73.73,0,0,0,1.071.006L21,25.239l4.5,4.5a.73.73,0,0,0,.534.231.749.749,0,0,0,.537-.237l3.165-3.165a.745.745,0,0,0,.24-.534h0Z" fill="#ca0000"/></svg>',
    'warning': '<svg class="c-notification__icon" xmlns="http://www.w3.org/2000/svg" width="42" height="40.568" viewBox="0 0 42 40.568"><path id="warning-triangle" d="M21,.021a3.237,3.237,0,0,1,.8.1,2.551,2.551,0,0,1,.718.306,2.611,2.611,0,0,1,.637.493,3.4,3.4,0,0,1,.472.655L41.61,36.162A2.861,2.861,0,0,1,42,37.637a3.214,3.214,0,0,1-.429,1.475,2.971,2.971,0,0,1-.472.637,2.719,2.719,0,0,1-.637.472,3.8,3.8,0,0,1-.7.267,2.862,2.862,0,0,1-.778.1H3.015a2.862,2.862,0,0,1-.778-.1,3.8,3.8,0,0,1-.7-.267A2.687,2.687,0,0,1,.432,39.112,3.214,3.214,0,0,1,0,37.637a2.8,2.8,0,0,1,.39-1.475L18.378,1.577A3.2,3.2,0,0,1,18.85.922a2.611,2.611,0,0,1,.637-.493A2.642,2.642,0,0,1,20.2.123a3.1,3.1,0,0,1,.8-.1ZM5.457,35.994H36.637L21,5.541,5.457,35.994Zm18.5-3.418a.606.606,0,0,1-.574.39H19.021c-.454,0-1.009-.024-1.009-.616V30.522a.6.6,0,0,1,.616-.616h4.755a.6.6,0,0,1,.616.616v1.829a.613.613,0,0,1-.042.225Zm.018-5.971A.606.606,0,0,1,23.4,27H19.039c-.454,0-1.009-.024-1.009-.616V17.135a.6.6,0,0,1,.616-.616H23.4a.6.6,0,0,1,.616.616V26.38a.613.613,0,0,1-.042.225Z" transform="translate(-0.002 -0.021)" fill="#ea740b"/></svg>',
    'ok': '<svg class="c-notification__icon" xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41"><path id="Path_28" data-name="Path 28" d="M23.615,8.218a1.426,1.426,0,0,1-.409,1.041l-8.158,8.257-2.311,2.357a1.457,1.457,0,0,1-2.041,0l-6.787-6.92a1.53,1.53,0,0,1,0-2.082L5.9,8.842a1.369,1.369,0,0,1,1.021-.417,1.369,1.369,0,0,1,1.021.417l3.714,3.785,7.46-7.544a1.457,1.457,0,0,1,2.041,0l2.053,2.1a1.426,1.426,0,0,1,.409,1.041h0Z" transform="translate(6.851 8.917)" fill="#439d39"/><path id="Path_29" data-name="Path 29" d="M20.5,41A20.5,20.5,0,1,1,41,20.5,20.525,20.525,0,0,1,20.5,41Zm0-36.021A15.521,15.521,0,1,0,36.024,20.5,15.539,15.539,0,0,0,20.5,4.979Z" transform="translate(0)" fill="#439d39"/></svg>',
    'info': '<svg class="c-notification__icon" xmlns="http://www.w3.org/2000/svg" width="41.072" height="41.069" viewBox="0 0 41.072 41.069"><g id="info" transform="translate(0.001 0.017)"><path id="Path_25" data-name="Path 25" d="M20.535,41.052a20.021,20.021,0,0,1-7.981-1.6,20.484,20.484,0,0,1-6.518-4.412A21.176,21.176,0,0,1,1.624,28.5,19.775,19.775,0,0,1,0,20.519a19.786,19.786,0,0,1,1.625-7.981A20.8,20.8,0,0,1,12.553,1.608,19.786,19.786,0,0,1,20.535-.017a19.786,19.786,0,0,1,7.981,1.625A20.8,20.8,0,0,1,39.446,12.537a19.786,19.786,0,0,1,1.625,7.981A19.786,19.786,0,0,1,39.446,28.5a21.158,21.158,0,0,1-4.412,6.535,20.532,20.532,0,0,1-6.518,4.412A19.97,19.97,0,0,1,20.535,41.052ZM14.5,6.184A15.746,15.746,0,0,0,9.55,9.534,15.913,15.913,0,0,0,6.2,14.485a15.544,15.544,0,0,0,0,12.088,15.451,15.451,0,0,0,3.35,4.951A16.058,16.058,0,0,0,14.5,34.854a15.493,15.493,0,0,0,12.068,0,15.972,15.972,0,0,0,4.951-3.329,15.579,15.579,0,0,0,3.35-4.951,15.544,15.544,0,0,0,0-12.088,15.778,15.778,0,0,0-8.3-8.3,15.493,15.493,0,0,0-12.068,0Zm8.961,7.794V11.062a1.085,1.085,0,0,0-.041-.3.38.38,0,0,0-.161-.22,1,1,0,0,0-.241-.182.6.6,0,0,0-.282-.062H18.326a.613.613,0,0,0-.282.062.882.882,0,0,0-.241.182.384.384,0,0,0-.161.22,1.1,1.1,0,0,0-.041.3v2.916a.971.971,0,0,0,.041.3.393.393,0,0,0,.161.22.642.642,0,0,0,.241.161.891.891,0,0,0,.282.041h4.412a.837.837,0,0,0,.282-.041.62.62,0,0,0,.241-.161.384.384,0,0,0,.161-.22,1.1,1.1,0,0,0,.041-.3Zm0,14.666V18.4a1.085,1.085,0,0,0-.041-.3.6.6,0,0,0-.161-.261,2.558,2.558,0,0,0-.241-.141.6.6,0,0,0-.282-.062H18.326a.613.613,0,0,0-.282.062,2.232,2.232,0,0,0-.241.141.606.606,0,0,0-.161.261,1.1,1.1,0,0,0-.041.3V28.644a.971.971,0,0,0,.041.3.393.393,0,0,0,.161.22.642.642,0,0,0,.241.161.891.891,0,0,0,.282.041h4.412a.837.837,0,0,0,.282-.041.62.62,0,0,0,.241-.161.384.384,0,0,0,.161-.22A1.1,1.1,0,0,0,23.462,28.644Z" transform="translate(0 0)" fill="#4e5359"/></g></svg>'
}

//#region ***  DOM references ***
//#endregion

//#region ***  Utility functions ***
//#endregion

//#region ***  Callback-Visualisation - show___ ***
const showNotifications = function(jsonObject) {
    // Dont draw the indication anymore

    // Display notifications
    const htmlNotificationsContainer = document.querySelector('.js-notifications-container')
    let htmlString = `<h3 class="c-notification__title">Nieuwe meldingen</h3>`;
    let hitOld = false;
    for (const notification of jsonObject) {
        if (notification.Gezien === 1 && !hitOld) {
            hitOld = true;
            htmlString += `<h3 class="c-notification__title">Oude meldingen</h3>`;
        }
        const niveau = notification.Niveau;
        htmlString += `
        <div class="o-layout o-layout--justify-space-between o-layout--align-center c-notification c-notification--${niveau}">
            <div class="o-layout o-layout--justify-space-between o-layout--align-center">
                <div class="c-notification__icon-container">
                    ${svgMapper[niveau]}
                </div>
                <div>
                    <p class="c-notification__message">${notification.Bericht}</p>
                    <p class="c-notification__time">${notification.Tijdstip}</p>
                </div>
            </div>
            <div>
                <svg class="c-program__icon js-delete-notification" data-id="${notification.Volgnummer}" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>
            </div>
        </div>
        `;
    }

    htmlNotificationsContainer.innerHTML = htmlString;

    // Update datebase
    handleData(`${endPoint}/viewed_notifications/`, callbackNotificationsUpdated, null, 'PUT', null);

    // Listen to delete
    listenToNotifications();
}
//#endregion

//#region ***  Callback-No Visualisation - callback___  ***
const callbackNotificationsUpdated = function(payload) {
    console.log(payload);
}

const callbackNotificationDeleted = function(payload) {
    htmlDeleteConfirmDialog.style.setProperty('opacity', 0);
    htmlDeleteConfirmDialog.style.setProperty('pointer-events', 'none');
    htmlDeleteConfirmDialog.style.setProperty('left', '0');
    getNotifications();
}
//#endregion

//#region ***  Data Access - get___ ***
const getNotifications = function() {
    handleData(`${endPoint}/get_notifications/`, showNotifications);
}
//#endregion

const deleteNotification = function(notification) {
    handleData(`${endPoint}/delete_notification/${notification}`, callbackNotificationDeleted, null, 'DELETE', null);
}

//#region ***  Event Listeners - listenTo___ ***
const listenToNotifications = function() {
    for(const deleteBtn of document.querySelectorAll('.js-delete-notification')) {
        deleteBtn.addEventListener('click', function() {
            const notification = this.getAttribute('data-id');
            console.log(notification);

            htmlDeleteConfirmDialog.style.setProperty('opacity', 1);
            htmlDeleteConfirmDialog.style.setProperty('pointer-events', 'all');
            htmlDeleteConfirmDialog.style.setProperty('left', '50%');

            htmlDeleteCancel.addEventListener('click', function() {
                htmlDeleteConfirmDialog.style.setProperty('opacity', 0);
                htmlDeleteConfirmDialog.style.setProperty('pointer-events', 'none');
                htmlDeleteConfirmDialog.style.setProperty('left', '0');
            })

            htmlDeleteConfirm.addEventListener('click', function() {
                deleteNotification(notification);
            })
        })
    }
}
//#endregion

//#region ***  INIT / DOMContentLoaded  ***
const init = function() {
    console.log("DOM Content Loaded - Notifications");
    getNotifications();
}
//#endregion

document.addEventListener("DOMContentLoaded", init);
