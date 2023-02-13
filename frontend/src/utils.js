import { API_SERVER } from "./config";

export function get(url, successCallback, errorCallback) {
    function errCallback(err) {
        if (errorCallback === undefined) {
            console.error(`GET request error: ${err}`);
        } else {
            errorCallback(err);
        }
    }

    fetch(API_SERVER + url, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + getCookie("token")
        }
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                errCallback(res.error);
            }
        }).then(successCallback, errCallback).catch(errCallback);
}

export function post(url, body, successCallback, errorCallback) {
    fetch(API_SERVER + url, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getCookie("token"),
            },
            body: body,
        }).then((data) => data.json()).then(successCallback, (error) => {
        if (errorCallback === undefined) {
            console.error(`POST request error: ${error}`);
        } else {
            errorCallback(error);
        }
    })
}

/**
 * @param {string} api
 * @param {Function | undefined} successCallback
 * @param {Function | undefined} errorCallback
 * @return {void}
 */
export function api_get(api, successCallback=undefined, errorCallback = undefined) {
    get("/api/" + api, successCallback, errorCallback);
}

/**
 * 
 * @param {string} api 
 * @param {string | FormData} body
 * @param {Function | undefined} successCallback 
 * @param {Function | undefined} errorCallback 
 */
export function api_post(api,
                         body,
                         successCallback = undefined,
                         errorCallback = undefined) {
    post("/api/" + api, body, successCallback, errorCallback);
}

export async function async_api_post(api, body, errorCallback) {
    return await fetch(API_SERVER + "/api/" + api, {
        method: "POST",
        body: body
    }).catch(errorCallback);
}

/**
 * 
 * @param {string} file
 */
export function staticFile(file) {
    return API_SERVER + "/static/" + file;
}

export function replaceObject(arr, setArr, index, obj) {
    setArr(arr.map((el, idx) => {
        if (idx === index) {
            return obj;
        }
        return el;
    }))
}

export function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

export function setCookie(name, value, options = {}) {
    let expires = options.expires;
    if (typeof expires === "number" && expires) {
        const d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }
    value = encodeURIComponent(value);
    let updatedCookie = name + "=" + value;
    for (const propName in options) {
        updatedCookie += "; " + propName;
        const propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }
    document.cookie = updatedCookie;
}


export const jsonify = JSON.stringify;