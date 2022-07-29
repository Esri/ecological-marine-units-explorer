import "./index.scss";
import esriRequest from "@arcgis/core/request";
import ClipboardJS from "clipboard";

export function createBitly() {
    let url = window.location.href;
    requestShortUrl(url).then(function (response) {
        let copyUrlInputEle = document.getElementById("copyUrl");
        copyUrlInputEle.value = response.data.data.url;
        let copyUrlEle = document.querySelector(".copy-bitly-url");
        copyUrlEle.setAttribute("data-clipboard-text", response.data.data.url);
        new ClipboardJS('.copy-bitly-url');
    });
}

function requestShortUrl(url) {
    let esriUrlShortener = 'https://arcg.is/prod/shorten?callback=';
    let targetUrl = url || document.location.href;
    return new Promise((resolve, reject) => {
        esriRequest(esriUrlShortener, {
            responseType: 'json',
            query: {
                f: 'json',
                longUrl: targetUrl
            },
            method: 'get'
        }).then(response => {
            resolve(response)
        }, error => {
            resolve(error);
        });
    });
}
