"use strict";


//#region ***  DOM references ***
let htmlAnalytics, htmlAnalyticsSelect;
//#endregion

//#region ***  Utility functions ***
//#endregion

//#region ***  Callback-Visualisation - show___ ***
const listOfTableTopics = [
    'Historiek'
]

const showAnalytics = function(jsonObject) {
    console.log(jsonObject);

    if (listOfTableTopics.includes(jsonObject.topic)) {
        const headers = Object.keys(jsonObject.analytics[0]);
        let htmlString = '<table><tr>';

        for(const header of headers) {
            htmlString += `<th>${header}</th>`;
        }
        htmlString += '</tr>';

        for(const item of jsonObject.analytics) {
            htmlString += `<tr>`;
            for(const header of headers) {
                htmlString += `<td>${item[header]}</td>`;
            }
            htmlString += `</tr>`;
        }

        htmlAnalytics.innerHTML = htmlString;

    }   else {
        htmlAnalytics.innerHTML = `<canvas id="plot"></canvas>`;
        const htmlChart = document.getElementById('plot').getContext('2d');

        // Defaults
        Chart.defaults.global.defaultFontFamily = 'HK Grotesk Web';
        Chart.defaults.global.defaultFontSize = 16;
        Chart.defaults.global.defaultFontColor = '#777';

        let maxValue = Math.max(...jsonObject.analytics.y);

        let datasets = [{
            barPercentage: 0.5,
            label: jsonObject.topic,
            fontSize: 0,
            backgroundColor: '#7373F5',
            borderWidth: 1,
            borderColor: '#5051DB',
            hoverBackgroundColor: '#7373F5',
            data: jsonObject.analytics.y
        }];

        if (jsonObject.analytics.z) {
            maxValue = Math.max(maxValue, Math.max(...jsonObject.analytics.z));
            datasets[0].label = 'Aantal keer bleek gewassen';

            datasets.push({
                barPercentage: 0.5,
                label: 'Aantal keer donker gewassen',
                fontSize: 0,
                backgroundColor: '#3E3EA8',
                borderWidth: 1,
                borderColor: '#5051DB',
                hoverBackgroundColor: '#3E3EA8',
                data: jsonObject.analytics.z
            })
        }

        maxValue += 1;
        const barPlot = new Chart(htmlChart, {
            type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
            data: {
                labels: jsonObject.analytics.x,
                datasets: datasets
            },
            options: {
                title: {
                    display: true,
                    text: jsonObject.topic,
                    fontSize: 24,
                    fontColor: '#111'
                },
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            steps: 1,
                            max: maxValue
                        }
                    }]
                },
                layout: {
                    padding: 24
                },
                tooltips: {
                    // enabled: false
                },
                reponsive: true,
                aspectRatio: 0.45,
                maintainAspectRatio: false
            }
        })
    }
}
//#endregion

//#region ***  Callback-No Visualisation - callback___  ***
//#endregion

//#region ***  Data Access - get___ ***
const getAnalytics = function(topic) {
    handleData(`${endPoint}/get_analytics/${topic}`, showAnalytics);
}
//#endregion

//#region ***  Event Listeners - listenTo___ ***
const listenToUI = function() {
    htmlAnalyticsSelect.addEventListener('input', function() {
        const topic = htmlAnalyticsSelect.options[htmlAnalyticsSelect.selectedIndex].value;
        getAnalytics(topic);
    })
}
//#endregion

//#region ***  INIT / DOMContentLoaded  ***
const init = function() {
    console.log("DOM Content Loaded - Analytics");

    htmlAnalytics = document.querySelector('.js-analytics');
    htmlAnalyticsSelect = document.querySelector('.js-analytics-select');
    getAnalytics(htmlAnalyticsSelect.options[htmlAnalyticsSelect.selectedIndex].value);
    listenToUI();
}
//#endregion

document.addEventListener("DOMContentLoaded", init);
