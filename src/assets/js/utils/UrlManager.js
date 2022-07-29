/**
 *
 * @param params
 * @param paramName
 * @returns {*|boolean}
 */
export function getParam(params={}, paramName="") {
    return params.get(paramName) || false;
}

/**
 *
 * @param params
 * @param paramName
 * @param paramValue
 */
export function setParam(params={}, paramName="", paramValue) {
    params.set(paramName, paramValue);
}

/**
 *
 * @param params
 */
export function updateParams(params) {
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
}

/**
 *
 * @param searchParams
 */
export function deleteUrlParams(searchParams) {
    const { selX, selY } = searchParams;
    let urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.delete(selX);
    urlSearchParams.delete(selY);
    updateParams(urlSearchParams);
}
