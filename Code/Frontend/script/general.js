"use strict";

const lanIP = `${window.location.hostname}:5000`;
const socketio = io(lanIP);
const endPoint = `http://${lanIP}/api/v1`;

let htmlNotifications;
let htmlDeleteConfirmDialog, htmlDeleteCancel, htmlDeleteConfirm;
let htmlSaveCopyConfirm, htmlSaveConfirm, htmlSaveConfirmDialog, htmlSaveCancel;

const showElements = function() {
    const hamburgerIcon = document.querySelector(".c-header__hamburger-menu");
    const mobileNav = document.querySelector('.js-mobile-nav');

    hamburgerIcon.addEventListener("click", function() {
        hamburgerIcon.classList.toggle("change");
        mobileNav.classList.toggle('visible');
    });
};

const showGeneralNotifications = function(jsonObject) {
    if (jsonObject.length > 0) {
        // Also target the one hidden in the mobile navigation
        for(const htmlNotification of htmlNotifications) {
            htmlNotification.innerHTML = 'Notificaties<div class="js-notification"></div>';
        }
    }
}

const getGeneralNotifications = function() {
    handleData(`${endPoint}/get_new_notifications/`, showGeneralNotifications);
}

const listenToHeaderUI = function() {
    for(const htmlNotification of htmlNotifications) {
        htmlNotification.addEventListener('click', function() {
            // Turn both circles off
            for(const htmlNotificationElement of htmlNotifications) {
                htmlNotificationElement.innerHTML = 'Notificaties';
            }
        })
    }

    // Redirect to home page when clicking on the logo / title
    document.querySelector('.c-header__title').addEventListener('click', function() {
        window.location.href = 'index.html';
    })
}

const listenToGeneralSockets = function() {
    socketio.on("B2F_NotificationsUpdate", function (payload) {
        showGeneralNotifications(payload);
    });
}

const initGeneral = function() {
    // Construct navigation and other static elements
    showElements();

    // Populate some global variables
    htmlDeleteConfirmDialog = document.querySelector('.js-delete-confirm-dialog');
    htmlDeleteCancel = document.querySelector('.js-cancel-delete');
    htmlDeleteConfirm = document.querySelector('.js-confirm-delete');

    htmlNotifications = document.querySelectorAll('.js-notifications');
    getGeneralNotifications();

    listenToHeaderUI();
    listenToGeneralSockets();
}

document.addEventListener("DOMContentLoaded", initGeneral);
