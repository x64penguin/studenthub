import { API_SERVER } from "./config";

export function get(url, successCallback, errorCallback) {
    function errCallback(err) {
        if (errorCallback === undefined) {
            console.error(`GET request error: ${err}`);
        } else {
            errorCallback(err);
        }
    }

    fetch(API_SERVER + url)
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

export const jsonify = JSON.stringify;