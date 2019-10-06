'use strict';

function ready(fn) {
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
}

function loadCountries(file) {
    let xhr = new XMLHttpRequest;
    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: this.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: this.statusText
            });
        };
        xhr.open('GET', file);
        xhr.responseType = 'json';
        xhr.send();
    });
}

ready(() => {
    loadCountries('build/countries.json').then(countries => {
        new Autocomplete(document.getElementById('country'), document.getElementById('results'), countries);
    });
});