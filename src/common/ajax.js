export {postData, getData}

function postData(url, options) {
    const requestOptions = {
        method: 'POST',
        headers: options.headers || {'Content-Type': 'application/x-www-form-urlencoded'},
        body: options.body,
    };
    return fetch(url, requestOptions).then(response => {
        return response.json();
        // if  (response.ok) {
        //     return response.json();
        // } else {
        //     window.location.reload()
        // }
    });
}

function getData(url, options) {
    return fetch(url, options).then(response => {
        return response.json();
    }, e => {
    });
}


function loadYandexMap(url) {
    return new Promise((resolve) => {
        if (typeof ymaps !== 'undefined') {
            resolve();
        } else {
            // const yandexMapUrl = url;
            const yandexMapUrl =
                'https://api-maps.yandex.ru/2.1/?apikey=6cabbeea-5917-4375-b061-36a551dae260&lang=ru_RU';
            const yandexMapScript = document.createElement('script');
            yandexMapScript.type = 'text/javascript';
            yandexMapScript.src = yandexMapUrl;
            document.body.appendChild(yandexMapScript);

            yandexMapScript.onload = function () {
                resolve();
            };
        }
    });
}


