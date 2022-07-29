import * as query from "@arcgis/core/rest/query";
import Query from "@arcgis/core/rest/support/Query";
import esriRequest from "@arcgis/core/request";

/**
 *
 * @param activeView
 * @returns {number}
 */
export function setQueryDistance(activeView) {
    let zoomLevel = Math.round(activeView.get("zoom"));
    let queryDistance = 15;
    switch (zoomLevel) {
        case 1:
            queryDistance = 20;
            break;
        case 2:
            queryDistance = 20;
            break;
        case 3:
            queryDistance = 15;
            break;
        case 4:
            queryDistance = 15;
            break;
        case 5:
            queryDistance = 15;
            break;
        case 6:
            queryDistance = 10;
            break;
        case 7:
            queryDistance = 10;
            break;
        case 8:
            queryDistance = 10;
            break;
        default:
            queryDistance = 5;
    }
    return queryDistance;
}

/**
 *
 * @param params
 * @returns {Promise<unknown>}
 */
export async function fetchData(params) {
    return await new Promise((resolve, reject) => {
        // create the Query object
        let queryObject = new Query(params.queryParams);
        // call the executeQueryJSON() method
        query.executeQueryJSON(params.url, queryObject).then(results => {
            resolve(results);
        }, error => {
            reject(error);
        });
    });
}

export async function fetch(params) {
    const { url, options } = params;
    return await new Promise((resolve, reject) => {
        esriRequest(url, options).then(results => {
            resolve(results)
        }, error => {
            reject(error);
        });
    });
}
