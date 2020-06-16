"use strict";

// Sometimes this doesnt get through from general.js
try {
    const endPoint = `http://${lanIP}/api/v1`;
} catch {
    // const endPoint already exists
}

let mand;

let duurtijdInput = 20;
let temperatuurInput = 60;
let productInput = 50;
let naamInput = 'Nieuw Programma';

//#region ***  DOM references ***
let htmlProgrammas,
    htmlContent,
    htmlWijzer,
    htmlUitsteltijd,
    htmlLinkText,
    htmlCTA,
    htmlSlider;

let htmlKwik, htmlProductLevel;
let currentProgram = null;
//#endregion

//#region ***  Utility functions ***
const formatDuurtijd = function (duurtijd) {
    const hours = Math.floor(duurtijd / 60);
    const minutes = duurtijd - hours * 60;
    if (minutes === 0) {
        return `${hours}u`;
    } else {
        return `${hours}u en ${minutes.toString().padStart(2, "0")}min`;
    }
};

const deltaTime = function (interval) {
    const timeStamp = new Date();

    let currentHour = timeStamp.getHours();
    let currentMinutes = timeStamp.getMinutes() + interval;

    while (currentMinutes > 59) {
        currentMinutes -= 60;
        currentHour += 1;
    }

    if (currentHour > 23) {
        currentHour = 0;
    }

    return `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`;
};

const mlToMaskPos = function(ml) {
    return (55 - (ml - 20)) * 3;
}

const tempToKwik = function (temp) {
    return -temp * 1.3;
};

const scaleKwik = function (temp) {
    // Start scaling from 60 so there's no gap
    if (temp > 60) {
        return 1 + (temp - 60) / 150;
    } else {
        return 1;
    }
};

const startWashing = function (program) {
    const body = JSON.stringify({
        basket: mand === "donker" ? 2 : 1,
        program: program,
        delay: parseInt(htmlSlider.value),
    });

    handleData(
        `${endPoint}/start_washing/`,
        callbackWashConfirmed,
        callbackFailed,
        "PUT",
        body
    );
};
//#endregion

//#region ***  Callback-Visualisation - show___ ***
const showProgrammas = function (jsonObject) {
    console.log(jsonObject.programmas);
    let htmlString = "";

    for (const programma of jsonObject.programmas) {
        if (mand) {
            htmlString += `
            <div class="c-program u-pointer data-id="${programma.Id}">
                <div class="c-program__info">
                    <div>
                        <p class="c-program__name" data-id="${programma.Id}">${
                programma.Naam
            }</p>
                        <span class="c-program__icon-proceed"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z"/></svg><span class="c-programma-proceed-text">Klik om door te gaan</span></span>
                    </div>
                </div>
                <p class="c-program__details">${formatDuurtijd(
                    programma.Duurtijd
                )} op ${programma.Temperatuur}°C</p>
            </div>
            `;
        } else {
            htmlString += `
            <div class="c-program">
                <div class="c-program__info">
                    <div>
                        <p class="c-program__name" data-id="${programma.Id}">${
                programma.Naam
            }</p>
                    </div>
                    <div class="c-program__info-icons">
                        <svg data-id="${
                            programma.Id
                        }" class="c-program__icon js-edit-programma" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/></svg>
                        <svg data-id="${
                            programma.Id
                        }" class="c-program__icon js-delete-programma" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg>
                    </div>
                </div>
                <p class="c-program__details">${formatDuurtijd(
                    programma.Duurtijd
                )} op ${programma.Temperatuur}°C</p>
            </div>
            `;
        }
    }

    htmlProgrammas.innerHTML = htmlString;
    listenToProgramma();
};

const minToLabel = function (value) {
    let hours = 0;
    if (value > 59) {
        hours = Math.floor(value / 60);
    }

    if (hours > 0) {
        const minutes = value - hours * 60;
        if (minutes > 0) {
            return `${hours} uur en ${minutes} minuten`;
        } else {
            return `${hours} uur`;
        }
    } else {
        return `${value} minuten`;
    }
};

const showLabel = function (value) {
    htmlUitsteltijd.innerHTML = minToLabel(value);
};

const showButtonText = function (value, programma) {
    htmlLinkText.innerHTML = `Start ${programma} om ${deltaTime(value)}`;
};

const showTimer = function (value) {
    htmlWijzer.style.setProperty(
        "transform",
        `translate(144.03px, 101.99px) rotate(${value * 6}deg)`
    );
};
//#endregion

//#region ***  Callback-No Visualisation - callback___  ***
const callbackProgrammaDeleted = function (jsonObject) {
    htmlDeleteConfirmDialog.style.setProperty("opacity", 0);
    htmlDeleteConfirmDialog.style.setProperty("pointer-events", "none");
    htmlDeleteConfirmDialog.style.setProperty("left", "0");
    getProgrammas();
};

const callbackProgrammaEdited = function(jsonObject) {
    window.location.href = 'programmas.html';
}

const callbackWashConfirmed = function (jsonObject) {
    // Back to homepage
    window.location.href = "index.html";
};

const callbackFailed = function (ex) {
    console.log(ex);
};

const callbackProgrammaDetails = function(jsonObject) {
    currentProgram = jsonObject.programma;

    duurtijdInput = currentProgram.Duurtijd;
    temperatuurInput = currentProgram.Temperatuur;
    productInput = currentProgram.HoeveelheidProduct;

    htmlContent.innerHTML = duurtijdContent;
    listenToDuurtijdInput();
}
//#endregion

//#region ***  Data Access - get___ ***
const getMand = function () {
    const params = new URLSearchParams(window.location.search);
    // null if it doesnt exist, value if it does
    mand = params.get("mand");
};

const getProgrammas = function () {
    handleData(`${endPoint}/get_programmas/`, showProgrammas);
};

const getProgrammaDetails = function(id) {
    handleData(`${endPoint}/get_programmas/${id}`, callbackProgrammaDetails);
}
//#endregion

//#region ***  Event Listeners - listenTo___ ***
const listenToSteps = function () {
    for (const step of document.querySelectorAll(".js-input-step")) {
        const stepNumber = parseInt(step.getAttribute("data-step"));

        step.addEventListener("click", function () {
            if (stepNumber === 1) {
                htmlContent.innerHTML = duurtijdContent;
                listenToDuurtijdInput();
            } else if (stepNumber === 2) {
                htmlContent.innerHTML = temperatuurContent;
                listenToTemperatuurInput();
            } else if (stepNumber === 3) {
                htmlContent.innerHTML = productContent;
                listenToProductInput();
            }
        });
    }

    document.querySelector(".js-vorige").addEventListener("click", function () {
        const stepNumber = parseInt(this.getAttribute("data-step"));

        if (stepNumber === 1) {
            currentProgram = null;
            window.location.href = "programmas.html";
        } else if (stepNumber === 2) {
            htmlContent.innerHTML = duurtijdContent;
            listenToDuurtijdInput();
        } else if (stepNumber === 3) {
            htmlContent.innerHTML = temperatuurContent;
            listenToTemperatuurInput();
        }
    });

    document.querySelector(".js-next").addEventListener("click", function () {
        const stepNumber = parseInt(this.getAttribute("data-step"));

        if (stepNumber === 1) {
            htmlContent.innerHTML = temperatuurContent;
            listenToTemperatuurInput();
        } else if (stepNumber === 2) {
            htmlContent.innerHTML = productContent;
            listenToProductInput();
        } else if (stepNumber === 3) {
            htmlSaveConfirmDialog.style.setProperty("opacity", 1);
            htmlSaveConfirmDialog.style.setProperty(
                "pointer-events",
                "all"
            );
            htmlSaveConfirmDialog.style.setProperty("left", "50%");

            htmlSaveCancel.addEventListener("click", function () {
                htmlSaveConfirmDialog.style.setProperty("opacity", 0);
                htmlSaveConfirmDialog.style.setProperty(
                    "pointer-events",
                    "none"
                );
                htmlSaveConfirmDialog.style.setProperty("left", "0");
            });

            htmlSaveConfirm.addEventListener("click", function () {

                const body = JSON.stringify({
                    Duurtijd: duurtijdInput,
                    Temperatuur: temperatuurInput,
                    HoeveelheidProduct: productInput,
                    Naam: document.querySelector('#js-new-programma-name').value
                })

                if (currentProgram) {
                    editProgramma(currentProgram.Id, body);
                }   else {
                    newProgramma(body);
                }
            });

            htmlSaveCopyConfirm.addEventListener("click", function () {
                const body = JSON.stringify({
                    Duurtijd: duurtijdInput,
                    Temperatuur: temperatuurInput,
                    HoeveelheidProduct: productInput,
                    Naam: document.querySelector('#js-new-programma-name').value
                })

                newProgramma(body);
            });
        }
    });
};

const listenToProductInput = function () {
    listenToSteps();

    if (currentProgram) {
        // Change title
        document.querySelector('.c-page-title').innerHTML = `Hoeveelheid Product ${currentProgram.Naam}`;
        document.querySelector('#js-new-programma-name').value = currentProgram.Naam;
    }

    const arrow = document.querySelector(".js-back-arrow");
    arrow.addEventListener("click", function () {
        currentProgram = null;
        window.location.href = "programmas.html";
    });

    // Update global variables
    htmlSaveConfirmDialog = document.querySelector('.js-edit-confirm-dialog');
    htmlSaveCopyConfirm = document.querySelector('.js-confirm-copy-edit');
    htmlSaveConfirm = document.querySelector('.js-confirm-edit');
    htmlSaveCancel = document.querySelector('.js-cancel-edit');

    htmlContent = document.querySelector(".js-content-here");
    htmlSlider = document.querySelector(".js-input-slider");
    htmlProductLevel = document.querySelector('.js-product-level');
    htmlUitsteltijd = document.querySelector(".js-slider-text");

    htmlProductLevel.style.setProperty('mask-position', `0 ${mlToMaskPos(productInput)}px`);
    htmlUitsteltijd.innerHTML = `${productInput}ml`;
    htmlSlider.value = productInput;

    htmlSlider.addEventListener("input", function () {
        productInput = parseInt(this.value);
        htmlUitsteltijd.innerHTML = `${productInput}ml`;
        htmlProductLevel.style.setProperty('mask-position', `0 ${mlToMaskPos(productInput)}px`);
    });
};

const listenToTemperatuurInput = function () {
    listenToSteps();

    if (currentProgram) {
        // Change title
        document.querySelector('.c-page-title').innerHTML = `Temperatuur ${currentProgram.Naam}`;
    }

    const arrow = document.querySelector(".js-back-arrow");
    arrow.addEventListener("click", function () {
        currentProgram = null;
        window.location.href = "programmas.html";
    });

    // Update global variables
    htmlContent = document.querySelector(".js-content-here");
    htmlSlider = document.querySelector(".js-input-slider");
    htmlKwik = document.querySelector(".js-thermometer__kwik");
    htmlUitsteltijd = document.querySelector(".js-slider-text");

    htmlKwik.style.setProperty(
        "transform",
        `translateY(${tempToKwik(temperatuurInput)}px) scaleY(${scaleKwik(
            temperatuurInput
        )})`
    );
    htmlUitsteltijd.innerHTML = `${temperatuurInput}°C`;
    htmlSlider.value = temperatuurInput;

    htmlSlider.addEventListener("input", function () {
        temperatuurInput = parseInt(this.value);
        htmlUitsteltijd.innerHTML = `${temperatuurInput}°C`;
        htmlKwik.style.setProperty(
            "transform",
            `translateY(${tempToKwik(temperatuurInput)}px) scaleY(${scaleKwik(
                temperatuurInput
            )})`
        );
    });
};

const listenToDuurtijdInput = function () {
    listenToSteps();

    if (currentProgram) {
        // Change title
        document.querySelector('.c-page-title').innerHTML = `Duurtijd ${currentProgram.Naam}`;
    }

    // Update global variables
    htmlContent = document.querySelector(".js-content-here");
    htmlSlider = document.querySelector(".js-input-slider");

    htmlWijzer = document.querySelector(".c-timer-wijzer");
    htmlUitsteltijd = document.querySelector(".js-slider-text");

    // Update in case we come back from another step
    showTimer(duurtijdInput);
    showLabel(duurtijdInput);
    htmlSlider.value = duurtijdInput;

    const arrow = document.querySelector(".js-back-arrow");
    arrow.addEventListener("click", function () {
        currentProgram = null;
        window.location.href = "programmas.html";
    });

    htmlSlider.addEventListener("input", function () {
        duurtijdInput = parseInt(this.value);
        showTimer(parseInt(this.value));
        showLabel(parseInt(this.value));
    });
};

const listenToDelayedStart = function (programma) {
    // Update global variables
    htmlWijzer = document.querySelector(".c-timer-wijzer");
    htmlUitsteltijd = document.querySelector(".js-slider-text");
    htmlLinkText = document.querySelector(".js-link-text");
    htmlCTA = document.querySelector(".js-start-washing");
    htmlSlider = document.querySelector(".js-input-slider");

    const arrow = document.querySelector(".js-back-arrow");
    arrow.addEventListener("click", function () {
        window.location.href = `programma_selectie.html?mand=${mand}`;
    });

    htmlSlider.addEventListener("input", function () {
        showTimer(parseInt(this.value));
        showLabel(parseInt(this.value));
        showButtonText(parseInt(this.value), programma);
    });

    htmlCTA.addEventListener("click", function () {
        startWashing(this.getAttribute("data-programma-id"));
    });
};

const deleteProgramma = function (id) {
    handleData(
        `${endPoint}/delete_programma/${id}`,
        callbackProgrammaDeleted,
        null,
        "DELETE",
        null
    );
};

const editProgramma = function (id, body) {
    console.log(body, id, `${endPoint}/edit_programma/${id}`);
    handleData(
        `${endPoint}/edit_programma/${id}`,
        callbackProgrammaEdited,
        callbackFailed,
        "PUT",
        body
    );
};

const newProgramma = function (body) {
    handleData(
        `${endPoint}/get_programmas/`,
        callbackProgrammaEdited,
        null,
        "POST",
        body
    );
};

const listenToProgramma = function () {
    // Aangepaste functionaliteiten als je via een mand komt
    if (mand) {
        for (const programma of document.querySelectorAll(".c-program")) {
            programma
                .addEventListener("click", function () {
                    // Change content
                    htmlContent.innerHTML = `
                <div class="o-container u-margin-top-md">

                <div class="o-layout">
                  <svg class="c-page-title-icon js-back-arrow" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"/></svg>
                  <h2 class="c-page-title">Uitgesteld Starten</h2>
                </div>
      
                <div class="c-separator"></div>

                <div class="c-big-icon">
                  <svg class="c-timer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 300 300">
                    <defs>
                      <clipPath id="clip-timer">
                        <rect width="300" height="300"/>
                      </clipPath>
                    </defs>
                    <g id="timer" clip-path="url(#clip-timer)">
                      <rect width="300" height="300" fill="#fff"/>
                      <g id="middle" transform="translate(-632 -303)">
                        <g id="timer-stopwatch" transform="translate(654 316)">
                          <path id="clock_inner" d="M200.478,150.714c-55.274,0-100.5,45.224-100.5,100.5A100.151,100.151,0,0,0,128.6,321.264a4.924,4.924,0,0,0,.617.752,5.643,5.643,0,0,0,.789.663,100.165,100.165,0,0,0,70.474,29.03c55.274,0,100.5-45.224,100.5-100.5S255.752,150.714,200.478,150.714ZM278.136,255.78h13.589a91.022,91.022,0,0,1-23.6,56.679l-9.628-9.628a4.522,4.522,0,1,0-6.4,6.4l9.628,9.628a91.019,91.019,0,0,1-56.679,23.6v-13.59a4.568,4.568,0,0,0-9.136,0v13.589a91.03,91.03,0,0,1-56.918-23.822l9.41-9.41a4.522,4.522,0,0,0-6.4-6.4l-9.386,9.386a91.01,91.01,0,0,1-23.389-56.437h13.589a4.577,4.577,0,0,0,4.568-4.568,4.316,4.316,0,0,0-4.568-4.568H109.232a91.021,91.021,0,0,1,23.6-56.679l9.628,9.628a4.146,4.146,0,0,0,3.2,1.37,4.932,4.932,0,0,0,3.2-1.37,4.416,4.416,0,0,0,0-6.4l-9.628-9.628a91.02,91.02,0,0,1,56.679-23.6v13.589a4.316,4.316,0,0,0,4.568,4.568,4.577,4.577,0,0,0,4.568-4.568V159.965a91.021,91.021,0,0,1,56.679,23.6L252.1,193.2a4.416,4.416,0,0,0,0,6.4,4.415,4.415,0,0,0,6.395,0l9.628-9.628a91.02,91.02,0,0,1,23.6,56.679H278.135a4.568,4.568,0,1,0,0,9.136Z" transform="translate(-72.254 -95.946)" fill="#202024"/>
                          <path id="clock_outer" d="M265.178,81.2a14.171,14.171,0,0,0,10.05-4.111,14.339,14.339,0,0,0,0-20.1L256.955,38.713a14.2,14.2,0,0,0-22.609,16.67l-7.366,7.366a118.425,118.425,0,0,0-57.733-26.274V25.922h8.679a9.271,9.271,0,0,0,9.593-9.136V8.107a9.367,9.367,0,0,0-9.593-9.593H123.567a9.271,9.271,0,0,0-9.136,9.593v8.223a9.271,9.271,0,0,0,9.136,9.593H132.7V36.474A118.41,118.41,0,0,0,75.219,62.539l-7.463-7.463A14.2,14.2,0,0,0,45,38.713L26.724,56.985a14.339,14.339,0,0,0,0,20.1,14.351,14.351,0,0,0,19.141.869l7.882,7.882a117.928,117.928,0,0,0-21.541,67.993c0,65.324,53.447,118.771,118.77,118.771s118.77-53.447,118.77-118.77A117.921,117.921,0,0,0,248.392,86.1l7.947-7.947A14.24,14.24,0,0,0,265.178,81.2ZM243.251,45.108a5.558,5.558,0,0,1,7.309,0L268.832,63.38c1.827,2.284,2.284,5.482,0,7.309s-5.482,1.827-7.309,0l-.826-.826a4.752,4.752,0,0,0-1-1.458L243.707,52.416a4.852,4.852,0,0,0-.966-.746A5.423,5.423,0,0,1,243.251,45.108Zm-3.2,16.9,9.593,9.593-6.852,6.852a95.337,95.337,0,0,0-9.136-10.05ZM123.567,7.65l54.817.457v8.223c0,.457,0,.457-.457.457l-54.36-.457Zm18.272,18.272h18.272v9.487q-4.524-.348-9.136-.351t-9.136.351V25.922ZM61.9,62.01l6.4,6.4a95.447,95.447,0,0,0-9.136,10.05L52.305,71.6ZM33.119,70.69c-1.827-2.284-1.827-5.482,0-7.309L51.391,45.108a5.558,5.558,0,0,1,7.309,0c1.827,2.284,1.827,5.482,0,7.309L42.712,68.405,40.428,70.69A5.558,5.558,0,0,1,33.119,70.69ZM150.976,263.462c-60.3,0-109.634-49.335-109.634-109.634A108.931,108.931,0,0,1,63.115,88.45q.305-.2.61-.4c4.111-5.938,9.136-10.963,14.618-15.988a4.254,4.254,0,0,0,.5-.611A109.32,109.32,0,0,1,137.1,45.074c.207.02.416.033.625.033a128.375,128.375,0,0,1,26.495,0h.457c.092,0,.191-.008.29-.017,53.754,6.927,95.64,53.178,95.64,108.738C260.61,214.127,211.274,263.462,150.976,263.462Z" transform="translate(-22.613 1.486)" fill="#202024"/>
                        </g>
                      </g>
                    </g>
                  </svg>
      
                  <svg class="c-timer-wijzer" xmlns="http://www.w3.org/2000/svg" width="12.249" height="67.015" viewBox="0 0 12.249 67.015">
                    <path d="M351.121,317.616V256.892a4.57,4.57,0,1,0-9.136,0v60.724C334.127,319.722,358.979,319.722,351.121,317.616Z" transform="translate(-340.428 -252.181)" fill="#202024"/>
                  </svg>            
      
                  <svg class="c-timer-middle" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                    <g id="middle" fill="#fff" stroke="#202024" stroke-width="9">
                      <circle cx="18" cy="18" r="18" stroke="none"/>
                      <circle cx="18" cy="18" r="13.5" fill="none"/>
                    </g>
                  </svg>
                </div>
      
                <div class="c-input__container">
                  <p class="c-input__text js-slider-text">5 minuten</p>
                  <input class="c-input__range js-input-slider" type="range" name="start-uitstel" id="start-uitstel" min="0" max="120" value="5">
                </div>

                <div class="c-start-washing js-start-washing" data-basket="${mand}" data-programma-id="${this.querySelector(".c-program__name").getAttribute(
                        "data-id"
                    )}">
                    <p href="#!" class="js-link-text" data-basket="${mand}">Start ${
                        this.querySelector(".c-program__name").innerHTML
                    } om ${deltaTime(5)}</p>
                </div>
      
              </div>
                `;

                    // innerHTML = label vd button = programma
                    listenToDelayedStart(this.querySelector(".c-program__name").innerHTML);
                });

            programma.addEventListener("mouseover", function () {
                // opschuiven naar links en pijltje tonen
                programma
                    .querySelector(".c-program__icon-proceed")
                    .classList.add("c-program__icon-proceed--show");
            });

            programma.addEventListener("mouseout", function () {
                // terug naar gewoon
                programma
                    .querySelector(".c-program__icon-proceed")
                    .classList.remove("c-program__icon-proceed--show");
            });
        }
    } else {
        for (const deleteBtn of document.querySelectorAll(
            ".js-delete-programma"
        )) {
            deleteBtn.addEventListener("click", function () {
                const programma = this.getAttribute("data-id");

                htmlDeleteConfirmDialog.style.setProperty("opacity", 1);
                htmlDeleteConfirmDialog.style.setProperty(
                    "pointer-events",
                    "all"
                );
                htmlDeleteConfirmDialog.style.setProperty("left", "50%");

                htmlDeleteCancel.addEventListener("click", function () {
                    htmlDeleteConfirmDialog.style.setProperty("opacity", 0);
                    htmlDeleteConfirmDialog.style.setProperty(
                        "pointer-events",
                        "none"
                    );
                    htmlDeleteConfirmDialog.style.setProperty("left", "0");
                });

                htmlDeleteConfirm.addEventListener("click", function () {
                    deleteProgramma(programma);
                });
            });
        }

        for (const editBtn of document.querySelectorAll(".js-edit-programma")) {
            editBtn.addEventListener("click", function () {
                const programID = this.getAttribute('data-id');
                getProgrammaDetails(programID);
            });
        }

        document.querySelector('.js-new-programma').addEventListener('click', function() {
            htmlContent.innerHTML = duurtijdContent;
            listenToDuurtijdInput();
        })
    }
};
//#endregion

const duurtijdContent = `
<div class="o-container u-margin-top-md">

<div class="o-layout o-layout--justify-space-between">
  <h2 class="c-page-title">Duurtijd</h2>
  <svg class="c-page-title-icon js-back-arrow" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
</div>

<div class="c-separator"></div>

<div class="c-big-icon">
  <svg class="c-timer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 300 300">
    <defs>
      <clipPath id="clip-timer">
        <rect width="300" height="300"/>
      </clipPath>
    </defs>
    <g id="timer" clip-path="url(#clip-timer)">
      <rect width="300" height="300" fill="#fff"/>
      <g id="middle" transform="translate(-632 -303)">
        <g id="timer-stopwatch" transform="translate(654 316)">
          <path id="clock_inner" d="M200.478,150.714c-55.274,0-100.5,45.224-100.5,100.5A100.151,100.151,0,0,0,128.6,321.264a4.924,4.924,0,0,0,.617.752,5.643,5.643,0,0,0,.789.663,100.165,100.165,0,0,0,70.474,29.03c55.274,0,100.5-45.224,100.5-100.5S255.752,150.714,200.478,150.714ZM278.136,255.78h13.589a91.022,91.022,0,0,1-23.6,56.679l-9.628-9.628a4.522,4.522,0,1,0-6.4,6.4l9.628,9.628a91.019,91.019,0,0,1-56.679,23.6v-13.59a4.568,4.568,0,0,0-9.136,0v13.589a91.03,91.03,0,0,1-56.918-23.822l9.41-9.41a4.522,4.522,0,0,0-6.4-6.4l-9.386,9.386a91.01,91.01,0,0,1-23.389-56.437h13.589a4.577,4.577,0,0,0,4.568-4.568,4.316,4.316,0,0,0-4.568-4.568H109.232a91.021,91.021,0,0,1,23.6-56.679l9.628,9.628a4.146,4.146,0,0,0,3.2,1.37,4.932,4.932,0,0,0,3.2-1.37,4.416,4.416,0,0,0,0-6.4l-9.628-9.628a91.02,91.02,0,0,1,56.679-23.6v13.589a4.316,4.316,0,0,0,4.568,4.568,4.577,4.577,0,0,0,4.568-4.568V159.965a91.021,91.021,0,0,1,56.679,23.6L252.1,193.2a4.416,4.416,0,0,0,0,6.4,4.415,4.415,0,0,0,6.395,0l9.628-9.628a91.02,91.02,0,0,1,23.6,56.679H278.135a4.568,4.568,0,1,0,0,9.136Z" transform="translate(-72.254 -95.946)" fill="#202024"/>
          <path id="clock_outer" d="M265.178,81.2a14.171,14.171,0,0,0,10.05-4.111,14.339,14.339,0,0,0,0-20.1L256.955,38.713a14.2,14.2,0,0,0-22.609,16.67l-7.366,7.366a118.425,118.425,0,0,0-57.733-26.274V25.922h8.679a9.271,9.271,0,0,0,9.593-9.136V8.107a9.367,9.367,0,0,0-9.593-9.593H123.567a9.271,9.271,0,0,0-9.136,9.593v8.223a9.271,9.271,0,0,0,9.136,9.593H132.7V36.474A118.41,118.41,0,0,0,75.219,62.539l-7.463-7.463A14.2,14.2,0,0,0,45,38.713L26.724,56.985a14.339,14.339,0,0,0,0,20.1,14.351,14.351,0,0,0,19.141.869l7.882,7.882a117.928,117.928,0,0,0-21.541,67.993c0,65.324,53.447,118.771,118.77,118.771s118.77-53.447,118.77-118.77A117.921,117.921,0,0,0,248.392,86.1l7.947-7.947A14.24,14.24,0,0,0,265.178,81.2ZM243.251,45.108a5.558,5.558,0,0,1,7.309,0L268.832,63.38c1.827,2.284,2.284,5.482,0,7.309s-5.482,1.827-7.309,0l-.826-.826a4.752,4.752,0,0,0-1-1.458L243.707,52.416a4.852,4.852,0,0,0-.966-.746A5.423,5.423,0,0,1,243.251,45.108Zm-3.2,16.9,9.593,9.593-6.852,6.852a95.337,95.337,0,0,0-9.136-10.05ZM123.567,7.65l54.817.457v8.223c0,.457,0,.457-.457.457l-54.36-.457Zm18.272,18.272h18.272v9.487q-4.524-.348-9.136-.351t-9.136.351V25.922ZM61.9,62.01l6.4,6.4a95.447,95.447,0,0,0-9.136,10.05L52.305,71.6ZM33.119,70.69c-1.827-2.284-1.827-5.482,0-7.309L51.391,45.108a5.558,5.558,0,0,1,7.309,0c1.827,2.284,1.827,5.482,0,7.309L42.712,68.405,40.428,70.69A5.558,5.558,0,0,1,33.119,70.69ZM150.976,263.462c-60.3,0-109.634-49.335-109.634-109.634A108.931,108.931,0,0,1,63.115,88.45q.305-.2.61-.4c4.111-5.938,9.136-10.963,14.618-15.988a4.254,4.254,0,0,0,.5-.611A109.32,109.32,0,0,1,137.1,45.074c.207.02.416.033.625.033a128.375,128.375,0,0,1,26.495,0h.457c.092,0,.191-.008.29-.017,53.754,6.927,95.64,53.178,95.64,108.738C260.61,214.127,211.274,263.462,150.976,263.462Z" transform="translate(-22.613 1.486)" fill="#202024"/>
        </g>
      </g>
    </g>
  </svg>

  <svg class="c-timer-wijzer" xmlns="http://www.w3.org/2000/svg" width="12.249" height="67.015" viewBox="0 0 12.249 67.015">
    <path d="M351.121,317.616V256.892a4.57,4.57,0,1,0-9.136,0v60.724C334.127,319.722,358.979,319.722,351.121,317.616Z" transform="translate(-340.428 -252.181)" fill="#202024"/>
  </svg>            

  <svg class="c-timer-middle" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <g id="middle" fill="#fff" stroke="#202024" stroke-width="9">
      <circle cx="18" cy="18" r="18" stroke="none"/>
      <circle cx="18" cy="18" r="13.5" fill="none"/>
    </g>
  </svg>
</div>

<div class="c-input__container">
  <p class="c-input__text js-slider-text">${duurtijdInput} minuten</p>
  <input class="c-input__range js-input-slider" type="range" name="start-uitstel" id="start-uitstel" min="15" max="180" value="${duurtijdInput}">
</div>

<div class="o-layout o-layout--justify-space-evenly o-layout--align-center">
    <div class="u-hoverable js-vorige" data-step="1">Vorige</div>   

    <div class="o-layout o-layout--align-center">
        <div class="c-step-indicator c-step-indicator--current js-input-step" data-step="1"></div>
        <div class="c-step-indicator js-input-step" data-step="2"></div>
        <div class="c-step-indicator js-input-step" data-step="3"></div>
    </div>

    <div class="u-hoverable js-next" data-step="1">Volgende</div>  
</div>

</div>
`;

const temperatuurContent = `
<div class="o-container u-margin-top-md">

<div class="o-layout o-layout--justify-space-between">
  <h2 class="c-page-title">Temperatuur</h2>
  <svg class="c-page-title-icon js-back-arrow" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
</div>

<div class="c-separator"></div>

<div class="c-big-icon">
  <svg class="c-thermometer__kwik js-thermometer__kwik" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <clipPath id="clip-thermometer">
      <rect width="300" height="300"/>
    </clipPath>
  </defs>
  <g id="thermometer" clip-path="url(#clip-thermometer)">
    <g id="thermometer-2" data-name="thermometer" transform="translate(-50.344 13)">
      <path id="wijzer" d="M228.548,352.52V208.613a5.353,5.353,0,1,0-10.706,0V352.52C206.162,354.992,240.227,354.992,228.548,352.52Z" transform="translate(-23.146 -14.724)" fill="#202024"/>
    </g>
  </g>
</svg>
           

<svg class="c-thermometer__middle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 300 300">
<defs>
<clipPath id="clip-thermometer">
  <rect width="300" height="300"/>
</clipPath>
</defs>
<g id="thermometer" clip-path="url(#clip-thermometer)">
<g id="thermometer-2" data-name="thermometer" transform="translate(-50.344 13)">
  <g id="Group_192" data-name="Group 192">
    <circle id="Ellipse_65" data-name="Ellipse 65" cx="46.5" cy="46.5" r="46.5" transform="translate(153.345 196)" fill="#fff"/>
    <path id="Path_41" data-name="Path 41" d="M228.548,282.52c-3.261-.445-2.972-.94-10.706,0a25.826,25.826,0,1,0,10.706,0ZM223.2,322.9a15.119,15.119,0,1,1,15.12-15.12A15.136,15.136,0,0,1,223.2,322.9Z" transform="translate(-23.146 -88.724)" fill="#202024"/>
  </g>
</g>
</g>
</svg>

<svg class="c-thermometer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300" viewBox="0 0 300 300">
<defs>
  <clipPath id="clip-thermometer">
    <rect width="300" height="300"/>
  </clipPath>
</defs>
<g id="thermometer" clip-path="url(#clip-thermometer)">
  <g id="thermometer-2" data-name="thermometer" transform="translate(-50.344 13)">
    <path id="Path_21" data-name="Path 21" d="M229.2,170.9V28.593a28.593,28.593,0,1,0-57.185,0V170.237a55.707,55.707,0,1,0,57.185.664Zm-29.146,92.477A45,45,0,0,1,179.779,178.2a5.353,5.353,0,0,0,2.938-4.777V28.593a17.886,17.886,0,1,1,35.771,0v3.5H208.349a5.353,5.353,0,0,0,0,10.706h10.14V55.332h-10.14a5.353,5.353,0,0,0,0,10.706h10.14V174a5.353,5.353,0,0,0,2.82,4.716,45,45,0,0,1-21.259,84.666Z" transform="translate(0)" fill="#202024"/>
  </g>
</g>
</svg>

</div>

<div class="c-input__container">
  <p class="c-input__text js-slider-text">${temperatuurInput}°C</p>
  <input class="c-input__range js-input-slider" type="range" name="start-uitstel" id="start-uitstel" min="15" max="100" value="${temperatuurInput}">
</div>

<div class="o-layout o-layout--justify-space-evenly o-layout--align-center">
    <div class="u-hoverable js-vorige" data-step="2">Vorige</div>   

    <div class="o-layout o-layout--align-center">
        <div class="c-step-indicator js-input-step" data-step="1"></div>
        <div class="c-step-indicator c-step-indicator--current js-input-step" data-step="2"></div>
        <div class="c-step-indicator js-input-step" data-step="3"></div>
    </div>

    <div class="u-hoverable js-next" data-step="2">Volgende</div>  
</div>

</div>
`;

const productContent = `
<div class="o-container u-margin-top-md">

<div class="o-layout o-layout--justify-space-between">
  <h2 class="c-page-title">Hoeveelheid Product</h2>
  <svg class="c-page-title-icon js-back-arrow" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
</div>

<div class="c-separator"></div>

<div class="c-big-icon c-big-icon--big-width">
<svg class="c-wasproduct" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="350" height="300" viewBox="0 0 350 300">
  <defs>
    <clipPath id="clip-path">
      <rect id="Rectangle_196" data-name="Rectangle 196" width="397.075" height="260.261"/>
    </clipPath>
    <clipPath id="clip-path-2"/>
    <clipPath id="clip-product">
      <rect width="350" height="300"/>
    </clipPath>
  </defs>
  <g id="product" clip-path="url(#clip-product)">
    <g id="middle-icon" transform="translate(-641.974 -356)">
      <g id="wasproduct-bol" transform="translate(617.974 381)">
        <g id="Mask_Group_7" data-name="Mask Group 7" clip-path="url(#clip-path)">
          <ellipse id="Ellipse_9" data-name="Ellipse 9" cx="156.078" cy="156.471" rx="156.078" ry="156.471" transform="translate(41.673 -58.972)"/>
        </g>
      </g>
    </g>
  </g>
</svg>

<svg class="c-wasproduct--to-mask js-product-level" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="350" height="300" viewBox="0 0 350 300">
  <defs>
    <clipPath id="clip-path">
      <rect id="Rectangle_196" data-name="Rectangle 196" width="397.075" height="260.261"/>
    </clipPath>
    <clipPath id="clip-path-2"/>
    <clipPath id="clip-product">
      <rect width="350" height="300"/>
    </clipPath>
  </defs>
  <g id="product" clip-path="url(#clip-product)">
    <g id="middle-icon" transform="translate(-641.974 -356)">
      <g id="wasproduct-bol" transform="translate(617.974 381)">
        <g id="Mask_Group_7" data-name="Mask Group 7" clip-path="url(#clip-path)">
          <ellipse id="Ellipse_9" data-name="Ellipse 9" cx="156.078" cy="156.471" rx="156.078" ry="156.471" transform="translate(41.673 -58.972)"/>
        </g>
      </g>
    </g>
  </g>
</svg>


</div>

<div class="c-input__container">
  <p class="c-input__text js-slider-text">${productInput}ml</p>
  <input class="c-input__range js-input-slider" type="range" name="start-uitstel" id="start-uitstel" min="15" max="75" value="${productInput}">
</div>
<div class="o-layout o-layout--justify-space-evenly o-layout--align-center">
    <div class="u-hoverable js-vorige" data-step="3">Vorige</div>   

    <div class="o-layout o-layout--align-center">
        <div class="c-step-indicator js-input-step" data-step="1"></div>
        <div class="c-step-indicator js-input-step" data-step="2"></div>
        <div class="c-step-indicator c-step-indicator--current js-input-step" data-step="3"></div>
    </div>

    <div class="u-hoverable js-next" data-step="3">Volgende</div>  
</div>

</div>

<div class="c-edit-confirm js-edit-confirm-dialog">
<p class="c-edit-confirm__text">Wijzigingen opslaan</p>
<input type="text" class="c-edit-confirm__input" name="js-new-programma-name" id="js-new-programma-name">
<div class="o-layout o-layout--justify-space-evenly">
  <div class="u-hoverable c-edit-confirm__btn js-cancel-edit">Annuleer</div>
  <div class="u-hoverable c-edit-confirm__btn js-confirm-edit">Opslaan</div>
  <div class="u-hoverable c-edit-confirm__btn js-confirm-copy-edit">Opslaan als nieuw</div>
</div>
</div>
`;

//#region ***  INIT / DOMContentLoaded  ***
const init = function () {
    console.log("DOM Content Loaded - Programmas");
    htmlContent = document.querySelector(".js-content-here");

    getMand();

    htmlProgrammas = document.querySelector(".js-program");
    getProgrammas();
};
//#endregion

document.addEventListener("DOMContentLoaded", init);
