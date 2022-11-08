import { findNonSerializableValue } from "@reduxjs/toolkit";
import { API_SERVER } from "./config";

export function get(url, successCallback, errorCallback) {
    fetch(API_SERVER + url).then((res) => res.json()).then(successCallback, (error) => {
        if (errorCallback == undefined) {
            console.error(`GET request error: ${error}`);
        } else {
            errorCallback(error);
        }
    })
}

export function post(url, body, successCallback, errorCallback) {
    fetch(API_SERVER + url, {method: "POST", body: body}).then((res) => res.json()).then(successCallback, (error) => {
        if (errorCallback == undefined) {
            console.error(`POST request error: ${error}`);
        } else {
            errorCallback(error);
        }
    })
}

export function api_get(api, successCallback, errorCallback) {
    get("/api/" + api, successCallback, errorCallback);
}

export function api_post(api, successCallback, errorCallback) {
    post("/api/" + api, successCallback, errorCallback);
}