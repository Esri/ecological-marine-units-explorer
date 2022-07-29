import "@esri/calcite-components/dist/calcite/calcite.css";
import "../style/index.scss";
import "../style/common.scss";
import "../style/app-loading-indicator.scss";
import "../style/app-overlay.scss";
import "../style/data-container.scss";
import "../style/no-data.scss";
import "../style/selection.scss";
import "../style/view.scss";

import { defineCustomElements } from "@esri/calcite-components/dist/loader";

defineCustomElements(window, {
    resourcesUrl: "https://js.arcgis.com/calcite-components/1.0.0-beta.77/assets"
});

import config from './config.json';
import * as Menu from "./components/menu/";
import * as watchUtils from "@arcgis/core/core/watchUtils";
import Camera from "@arcgis/core/Camera";
import MapView from "@arcgis/core/views/MapView";
import Point from "@arcgis/core/geometry/Point";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import SceneView from "@arcgis/core/views/SceneView";
import * as ErrorHandler from "./utils/ErrorHandler";
import * as QueryUtils from "./utils/QueryUtils";
import * as UIManager from "./utils/UIManager";
import * as UrlManager from "./utils/UrlManager";
import * as OverviewMap from "./components/overviewMap/index";
import * as WidgetManager from "./components/widgets";
import * as ViewManager from "./utils/ViewManager";
import * as d3 from "d3";
import PubSub from "pubsub-js";

const sceneLayer = new SceneLayer({
    "portalItem": {
        "id": config.EMU_CHANGE_LAYER_ID
    },
    "popupEnabled": false
});

const mapView = new MapView({
    "container": "mapViewContainer",
    "map": ViewManager.webMap,
    "ui": {
        "components": []
    }
});

const sceneView = new SceneView({
    "container": "sceneViewContainer",
    "highlightOptions" : {
        "haloColor": [255, 38, 150],
        "color": [255, 255, 255],
        "fillOpacity": 0.3
    },
    "map": ViewManager.webScene,
    "qualityProfile": "high",
    "ui": {
        "components": []
    }
});
sceneView.popup = null;

const emuVariables = [config.TEMP, config.SALINITY, config.DISSOLVED_O2, config.PHOSPHATE, config.NITRATE, config.SILICATE];
let selectedMapPoint = null;
let verticalProfileData = [];
let scatterPlotData = [];
let highlightedList = [];

let params = new URLSearchParams(location.search);
let viewType = UrlManager.getParam(params, "v");
let showHistoricalData = UrlManager.getParam(params, "showChange");
let fov = UrlManager.getParam(params, "fov");
let heading = UrlManager.getParam(params, "heading");
let tilt = UrlManager.getParam(params, "tilt");
let lat = UrlManager.getParam(params, "lat");
let lng = UrlManager.getParam(params, "lng");
let x = UrlManager.getParam(params, "x");
let y = UrlManager.getParam(params, "y");
let z = UrlManager.getParam(params, "z");
let selX = UrlManager.getParam(params, "selX");
let selY = UrlManager.getParam(params, "selY");
let zoom = UrlManager.getParam(params, "zoom");

// parse URL params
if (fov && heading && tilt && lat && lng && x && y && z && zoom) {
    sceneView.camera = new Camera({
        "fov": fov,
        "heading": heading,
        "tilt": tilt,
        "position": [lng, lat, z]
    });
    mapView.center = new Point({
        "x": x,
        "y": y,
        "spatialReference": 3857
    });
    mapView.zoom = zoom;
} else {
    viewType = "3d";
}

if (selX && selY) {
    selectedMapPoint = new Point({
        "x": parseFloat(selX),
        "y": parseFloat(selY),
        "spatialReference": 3857
    });
}

const appContainerEle = document.querySelector(".content-container");
const loadingIndicatorEle = document.getElementById("appLoadingIndicator");
const closeBtnEle = document.querySelector(".close-btn");
const sceneViewContainerEle = document.getElementById("sceneViewContainer");
const mapViewContainerEle = document.getElementById("mapViewContainer");
const targetEle = document.querySelector(`[data-view-type='${viewType}']`);
const emuKeyDepthAnchorEle = document.getElementById("emuDepths");

const selectedLocationCommonNameEle = document.querySelectorAll(".selected-location-common-name");
const selectedLocationDepthEle = document.querySelectorAll(".selected-location-depth");

appContainerEle.style.display = "block";
mapViewContainerEle.style.display = (viewType === "2d") ? "flex" : "none";
sceneViewContainerEle.style.display = (viewType === "3d") ? "flex" : "none";

closeBtnEle.addEventListener("click", closeButtonHandler);

setShowHistoricalDataValue(showHistoricalData);

UIManager.addClass(targetEle, "item-selected");

PubSub.subscribe("View Type Updated", (msg, data) => {
    // update URL view type
    let params = new URLSearchParams(location.search);
    const urlParamsView = UrlManager.getParam(params, "v");
    viewType = (urlParamsView === "2d") ? "3d" : "2d";
    UrlManager.setParam(params, "v", viewType);
    UrlManager.updateParams(params);
    mapViewContainerEle.style.display = (viewType === "2d") ? "flex" : "none";
    sceneViewContainerEle.style.display = (viewType === "3d") ? "flex" : "none";
    activeView = (viewType === "2d") ? mapView : sceneView;
});

PubSub.subscribe("View Source Updated", (msg, data) => {

    if (data === "add") {
        ViewManager.webScene.add(sceneLayer);
        document.querySelectorAll(".historicalPoints").forEach(ele => {
            ele.style.display = "block";
        });
        document.querySelectorAll(".emu-change-line").forEach(ele => {
            ele.style.display = "block";
        });
        setShowHistoricalDataValue(true);
    } else {
        ViewManager.webScene.remove(sceneLayer);
        document.querySelectorAll(".historicalPoints").forEach(ele => {
            ele.style.display = "none";
        });
        document.querySelectorAll(".emu-change-line").forEach(ele => {
            ele.style.display = "none";
        });
        setShowHistoricalDataValue(false);
    }

    // update URL source type
    let params = new URLSearchParams(location.search);
    //showHistoricalData = getParam(params, "showChange");
    UrlManager.setParam(params, "showChange", showHistoricalData);
    UrlManager.updateParams(params);
});

let selectedVar = "temperature";
document.querySelectorAll(".mobile-nav-btn-item").forEach(mobileNavItem => {
    mobileNavItem.addEventListener("click", event => {
        let selectedChartId = event.currentTarget.dataset.id;
        UIManager.addClass(document.querySelector(`.${selectedVar}`), "hide");
        selectedVar = selectedChartId;
        UIManager.removeClass(document.querySelector(`.${selectedChartId}`), "hide");
    })
})

let activeView = (viewType === "2d") ? mapView : sceneView;
watchUtils.whenFalseOnce(activeView, "updating", viewUpdatingHandler);

ViewManager.webScene.load()
    .then(mapLoadHandler)
    .then(sceneLayersLoadHandler)
    .then(function(layers) {
        console.log("--- WebScene: All " + layers.length + " layers loaded.");
        watchUtils.whenTrue(sceneView, "stationary", stationaryHandler);

        sceneView.on("click", viewClickHandler);
    })
    .catch(ErrorHandler.errorHandler);

ViewManager.webMap.load()
    .then(mapLoadHandler)
    .then(mapLayersLoadHandler)
    .then(function(layers) {
        console.log("--- WebMap: All " + layers.length + " layers loaded.");
        watchUtils.whenTrue(mapView, "stationary", stationaryHandler);

        mapView.on("click", viewClickHandler);
    })
    .catch(ErrorHandler.errorHandler);

/**
 * Handler for when has stopped animating, being navigated with or being resized.
 */
function stationaryHandler() {
    let params = new URLSearchParams(location.search);
    if (viewType === "3d") {
        params.set("showChange", showHistoricalData);
        params.set("fov", sceneView.camera.fov.toString());
        params.set("heading", sceneView.camera.heading.toString());
        params.set("tilt", sceneView.camera.tilt.toString());
        params.set("z", sceneView.camera.position.z.toString());
    }

    params.set("v", viewType);
    params.set("lat", activeView.extent.center.latitude.toString());
    params.set("lng", activeView.extent.center.longitude.toString());
    params.set("x", activeView.extent.center.x.toString());
    params.set("y", activeView.extent.center.y.toString());
    params.set("zoom", activeView.zoom.toString());
    window.history.replaceState({}, "", `${location.pathname}?${params}`);
}

/**
 * Handler for when the view is being updated by additional data requests to the network, or by processing received data.
 * This is only watched one time.  Once it's false the UI components of the application are loaded.
 *
 * @param view
 */
function viewUpdatingHandler(view) {
    // hide loading indicator
    UIManager.addClass(loadingIndicatorEle, "hide");

    Menu.initMenu();
    OverviewMap.initOverviewMap(sceneView, mapView);
    WidgetManager.initWidgets(sceneView, mapView);

    if (showHistoricalData) {
        ViewManager.webScene.add(sceneLayer);
        const contentMenuItem = document.querySelector(".emu-change-layer");
        UIManager.addClass(contentMenuItem, "content-item-selected");
    } else {
        const contentChangeMenuItem = document.querySelector(".emu-current-layer");
        UIManager.addClass(contentChangeMenuItem, "content-item-selected");
    }

    if (selectedMapPoint)
        viewClickHandler(selectedMapPoint);
}

/**
 * Handle events for when the view loads.
 *
 * @param response
 * @returns {*}
 */
function mapLoadHandler(response) {
    return response.basemap.load();
}

/**
 * Web Scene layers load handler.
 *
 * @param response
 * @returns {Promise<unknown[]>}
 */
function sceneLayersLoadHandler(response) {
    // grab all the layers and load them
    const allLayers = ViewManager.webScene.allLayers;
    return layersLoadHandler(allLayers);
}

/**
 * Map layers load handler.
 *
 * @param response
 * @returns {Promise<unknown[]>}
 */
function mapLayersLoadHandler(response) {
    // grab all the layers and load them
    const allLayers = ViewManager.webMap.allLayers;
    return layersLoadHandler(allLayers);
}

function layersLoadHandler(allLayers) {
    const promises = allLayers.map(function(layer) {
        return layer.load();
    });
    return Promise.all(promises.toArray());
}

function viewClickHandler(event) {
    if (event.type === "click") {
        selectedMapPoint = event.mapPoint;
    } else {
        selectedMapPoint = event;
    }

    let currentView = (viewType === "2d") ? mapView : sceneView;
    let queryDistance = QueryUtils.setQueryDistance(currentView);

    let queryParams = {
        "distance": queryDistance,
        "geometry": selectedMapPoint,
        "orderByFields": ["QtrDegreeID"],
        "outFields": ["*"],
        "outSpatialReference": {
            "wkid": 102100
        },
        "returnGeometry": true,
        "spatialRelationship": "intersects",
        "units": "miles"
    };

    Promise.all([
        QueryUtils.fetchData({
            "queryParams": queryParams,
            "url": config.EMU_POINT_MESH_CLUSTER
        }).catch(ErrorHandler.errorHandler),
        QueryUtils.fetchData({
            "queryParams": queryParams,
            "url": config.EMU_V2
        }).catch(ErrorHandler.errorHandler),
    ]).then(([verticalProfileResponse, scatterPlotDataResponse]) => {
        const verticalProfileFeatures = verticalProfileResponse.features;
        const scatterPlotFeatures = scatterPlotDataResponse.features;

        if (verticalProfileFeatures.length || scatterPlotFeatures.length) {
            UIManager.fadeInHandler("data-container");
            UIManager.fadeInHandler("selectedDepthContainer");

            ViewManager.clearHighlightGraphics(highlightedList);

            let qtrDegreeID = verticalProfileFeatures[0].attributes.QtrDegreeID;
            // Used for EMU name / Top Depth / Bottom Depth
            verticalProfileData = verticalProfileFeatures.filter(mergedFeature => {
                return mergedFeature.attributes.QtrDegreeID === qtrDegreeID;
            });

            scatterPlotData = scatterPlotFeatures.filter(point => {
                return point.attributes.QtrDegreeID === qtrDegreeID;
            });

            // clear legend DOM
            while (emuKeyDepthAnchorEle.firstChild) {
                emuKeyDepthAnchorEle.removeChild(emuKeyDepthAnchorEle.firstChild);
            }

            verticalProfileData.forEach((verticalProfileDataFeature, i) => {
                const {attributes} = verticalProfileDataFeature;

                const objectID = attributes.OBJECTID.toString();
                const emuKey = attributes.Cluster37.toString();
                const emuColor = config.CLUSTERS[emuKey].fill;

                const formattedUnitTop = UIManager.formatValue(attributes[config.UNIT_TOP]);
                const formattedThickness = UIManager.formatValue(attributes.ThicknessPos);

                let keyDepthRowEle = document.createElement("div");
                keyDepthRowEle.setAttribute("id", `objectid_${objectID}`)
                keyDepthRowEle.setAttribute("class", `depth-thickness-container`);
                keyDepthRowEle.style.backgroundColor = emuColor;
                keyDepthRowEle.innerHTML = `
                    <div class="depth-thickness">
                        <div class="emu-key-container key-depth-container" data-objectid="${objectID}" data-vertprofileindex="${i}">
                            <div class="emu-key-value key-depth-value" data-objectid="${objectID}" data-vertprofileindex="${i}">${emuKey}</div>
                        </div>
                        <div class="emu-depth-container key-depth-container" data-objectid="${objectID}" data-vertprofileindex="${i}">
                            <div class="emu-depth-value key-depth-value" data-objectid="${objectID}" data-vertprofileindex="${i}">${formattedUnitTop} (${formattedThickness})</div>
                        </div>
                    </div>`;
                keyDepthRowEle.addEventListener("click", emuKeyClickHandler);
                keyDepthRowEle.addEventListener("mouseover", emuKeyMouseoverHandler);
                keyDepthRowEle.addEventListener("mouseout", emuKeyMouseoutHandler)

                emuKeyDepthAnchorEle.appendChild(keyDepthRowEle);
            });

            emuVariables.forEach(emuVariable => {
                const elementID = `${emuVariable}Chart`;
                let TEMP_CHART_ELEMENT = document.getElementById(elementID);
                const { chartContainerWidth, chartContainerHeight } = UIManager.getElementDimensions(elementID);
                UIManager.removeChildren(TEMP_CHART_ELEMENT);
                updateChart({
                    "chartContainerWidth": chartContainerWidth,
                    "chartContainerHeight": chartContainerHeight,
                    "varName": emuVariable,
                    "verticalProfileData": verticalProfileData,
                    "scatterPlotData": scatterPlotData
                });
            });

            const { attributes } = verticalProfileData[verticalProfileData.length - 1];
            const commonName = attributes["EMU_Region_Name_and_Code"];
            const commonNameFormatted = UIManager.formatRegionLabel(commonName);
            const bottomDepth = attributes["UnitBottom"];
            selectedLocationCommonNameEle.forEach(el => {
                el.innerHTML = `${commonNameFormatted} | `;
            });

            selectedLocationDepthEle.forEach(el => {
                const bottomDepthFormatted = UIManager.formatValue(bottomDepth);
                el.innerHTML = `${bottomDepthFormatted} m local depth`
            });

            // update graphic
            ViewManager.updateGraphic(verticalProfileData[0].geometry, [sceneView, mapView]);

            activeView.hitTest(event)
                .then((hitTestResult) => {
                    const { results } = hitTestResult;
                    if (results.length > 0) {
                        const result = results[0];
                        const graphic = result.graphic;
                        const attributes = graphic.attributes;
                        const objectId = attributes.OBJECTID;
                        emuKeyClickHandler(objectId);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });


            // update URL params
            selX = selectedMapPoint.x;
            selY = selectedMapPoint.y;

            let params = new URLSearchParams(location.search);
            UrlManager.setParam(params, "selX", selX.toString());
            UrlManager.setParam(params, "selY", selY.toString());
            UrlManager.updateParams(params);

        } else {

            document.querySelector(".no-data-title").innerHTML = "No data";
            document.querySelector(".no-data-message").innerHTML = "Please select another location.";
            document.getElementById("noDataAlert").setAttribute("active", "true");

        }
    });
}


function setShowHistoricalDataValue(flag) {
    showHistoricalData = (/true/i).test(flag);
}


function emuKeyClickHandler(event) {
    const objectId = (event.target !== undefined) ? event.target.dataset.objectid : event;

    let nodeList = document.querySelectorAll(".depth-thickness-container");
    [...nodeList].forEach(el => {
        el.style.border = "none";
    });

    document.getElementById(`objectid_${objectId}`).style.border = "1px solid red";

    let queryParams = {
        "outFields": ["*"],
        "outSpatialReference": {
            "wkid": 102100
        },
        "returnGeometry": true,
        "where": `OBJECTID = ${objectId}`
    };
    QueryUtils.fetchData({
        "queryParams": queryParams,
        "url": config.EMU_POINT_MESH_CLUSTER,
    }).then(response => {
        if (response.features.length > 0) {
            let feature = response.features[0];
            feature.symbol = {
                "type": "point-3d",
                "symbolLayers": [
                    {
                        "type": "object",
                        "material": {
                            "color": "blue"
                        },
                        "resource": {
                            "primitive": "cylinder"
                        },
                    }
                ]
            };

            ViewManager.clearHighlightGraphics(highlightedList);

            sceneView.whenLayerView(sceneView.layerViews.items[4].layer).then((layerView) => {
                highlightedList.push(layerView.highlight(feature));
            });
        } else {
            // No features
        }
    }).catch(error => {
        return error
    });
}

function emuKeyMouseoverHandler(event) {
    let emuKeyIndex = parseInt(event.target.dataset.vertprofileindex);
    const tooltipHTML = hydrateTooltip({
        "content": verticalProfileData[emuKeyIndex].attributes,
        "latitude": selectedMapPoint.latitude,
        "longitude": selectedMapPoint.longitude
    });
    let areaChartTooltip = d3.select("body")
        .append("div")
        .attr("class", "global-statistics-tooltip")
        .style("display", "block");
    areaChartTooltip.html(tooltipHTML);
}

function emuKeyMouseoutHandler(event) {
    UIManager.clearDOM(".global-statistics-tooltip", true, true);
}


function hydrateTooltip(inputData) {
    const { content, latitude, longitude } = inputData;
    const tooltipContent = formatTooltipInputData(content);
    const formattedLatitude = latitude.toFixed(2);
    const formattedLongitude = longitude.toFixed(2);
    const formattedDepth = UIManager.formatValue(tooltipContent.depth);
    return `
    <div class="popup-main">
        <div class="popup-container">
        <div class="popup-emu-name-description" style="background: ${tooltipContent.color}">
            <div class="popup-emu-name">
                <div class="popup-emu-label">EMU</div>
                <div class="popup-emu-value">${tooltipContent.emu}</div>
            </div>
            <div class="popup-emu-description">${tooltipContent.emuName}</div>
        </div>
        <div class="popup-vars">
            <div class="popup-selected">
                <span class="popup-lat">${formattedLatitude}</span>,
                <span class="popup-lng">${formattedLongitude}</span> |
                <span class="popup-depth">${formattedDepth}</span>m deep,
                <span class="popup-thickness">${tooltipContent.thickness}</span>m thick
            </div>
            <div class="popup-vars2">
                <div class="popup-temp-label">Temperature</div>
                <div class="popup-temp-value">${tooltipContent.temp}</div>
                <div class="popup-salinity-label">Salinity</div>
                <div class="popup-salinity-value">${tooltipContent.salinity}</div>
                <div class="popup-dissO2-label">Dissolved O<sub>2</sub></div>
                <div class="popup-dissO2-value">${tooltipContent.dissO2}</div>
                <div class="popup-nitrate-label">Nitrate</div>
                <div class="popup-nitrate-value">${tooltipContent.nitrate}</div>
                <div class="popup-phosphate-label">Phosphate</div>
                <div class="popup-phospate-value">${tooltipContent.phosphate}</div>
                <div class="popup-silicate-label">Silicate</div>
                <div class="popup-silicate-value">${tooltipContent.silicate}</div>
            </div>
        </div>
    </div>
    </div>`;
}

function formatTooltipInputData(inputData) {
    // emu name
    const emuName = inputData["EMU_Name"];
    // color
    const color = config.CLUSTERS[inputData["Cluster37"]];
    // depth
    const depth = inputData[config.UNIT_TOP];
    // thickness
    const thickness = inputData["ThicknessPos"];

    // variables
    const _temp = inputData[config.TEMP].toFixed(2);
    const temp = UIManager.formatLabel(_temp) + ` <span>${config.TEMP_UNIT}</span>`;

    const _salinity = inputData[config.SALINITY].toFixed(2);
    const salinity = UIManager.formatLabel(_salinity);

    const _dissO2 = inputData[config.DISSOLVED_O2].toFixed(2);
    const dissO2 = UIManager.formatLabel(_dissO2) + ` <span>${config.DISSOLVED_O2_UNIT}</span>`;

    const _phosphate = inputData[config.PHOSPHATE].toFixed(2);
    const phosphate = UIManager.formatLabel(_phosphate) + ` <span>${config.PHOSPHATE_UNIT}</span>`;

    const _nitrate = inputData[config.NITRATE].toFixed(2);
    const nitrate = UIManager.formatLabel(_nitrate) + ` <span>${config.NITRATE_UNIT}</span>`;

    const _silicate = inputData[config.SILICATE].toFixed(2);
    const silicate = UIManager.formatLabel(_silicate) + ` <span>${config.SILICATE_UNIT}</span>`;

    return {
        "color": color.fill,
        "depth": depth,
        "emu": inputData["Cluster37"],
        "emuName": emuName,
        "thickness": thickness,
        "dissO2": dissO2,
        "nitrate": nitrate,
        "phosphate": phosphate,
        "salinity": salinity,
        "silicate": silicate,
        "temp": temp
    };
}

function clean(d) {
    return d.attributes;
}

function cleanVerticalProfileData(params) {
    const { inputData, nRecords, clusterIDFieldName, topUnitFieldName, thicknessFieldName } = params;
    return inputData.map((vp, i) => {
        let values = inputData.map((l, j) => {
            return {
                "profile": j,
                "y0": vp[topUnitFieldName],
                "y": vp[thicknessFieldName]
            }
        });

        // TODO Cheap hack for issue with d3 area charts overlaid on top of each other
        let j = values.length;
        while(values.length < nRecords) {
            j++;
            values.push({
                "profile": j,
                "y0": values[0].y0,
                "y": values[0].y
            });
        }

        return {
            "name": vp[clusterIDFieldName],
            "values": values,
            "data": vp
        }
    }).reverse();
}

function createScatterPlotSeries(inputData, attributeFields) {
    // Compute the series names
    const seriesNames = Object.keys(inputData[0])
        .filter(d => {
            return attributeFields.includes(d);
        })
        .sort();

    // Map the scatterPlotResponse to an array of arrays of {x, y} tuples.
    return seriesNames.map(series => {
        return inputData.map(d => {
            return {
                x: +d[series],
                y: +d[config.UNIT_TOP],
                data: d
            };
        });
    });
}

function createWhiskerPlot(selectorStr, params) {
    const {
        chartData,
        width,
        height
    } = params;

    const margin = ({
        "top": 0,
        "right": 10,
        "bottom": 0,
        "left": 0
    });
    const whiskersHeight = 5;

    const quartiles = [
        chartData.lowerQuantile,
        chartData.medianValue,
        chartData.upperQuantile
    ];
    const whiskers = [chartData.minValue, chartData.maxValue];

    const x_scale = d3.scaleLinear()
        .domain([chartData.minValue, chartData.maxValue])
        .range([margin.left, width - margin.right])

    try {
        const svg = d3.select(selectorStr)
            .append('svg')
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

        let gSvg = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top +")");

        // WhiskerLine Groups
        let whiskerLineGrps = gSvg.selectAll(".whiskers")
            .data(whiskers)
            .enter()
            .append("g")
            .attr("class", "whiskers")
            .attr("transform", function(d, i) {
                return "translate(" + x_scale(d) + "," + (height / 2 - whiskersHeight / 2) + ")";
            });

        whiskerLineGrps
            .append('line')
            .attr("x2", 0)
            .attr("y2", d => whiskersHeight)
            .attr("class", "whiskerLine")

        // Horizontal Line
        gSvg.append('line')
            .attr("x1", x_scale(whiskers[0]))
            .attr("y1", height / 2)
            .attr("x2", x_scale(whiskers[1]))
            .attr("y2", height / 2)
            .attr("class", "whiskerLine")

        // Rectangle
        gSvg.append("g")
            .append("rect")
            .attr("width", x_scale(quartiles[2]) - x_scale(quartiles[0]))
            .attr("height", whiskersHeight)
            .attr("x", x_scale(quartiles[0]))
            .attr("y", height / 2 - whiskersHeight / 2)
            .attr("fill", "rgba(255,255,255,0.53)")
            .attr("stroke", "#FFFFFF87")
            .attr("stroke-width", 1)


        // QuartileLine Groups
        gSvg.selectAll(".quartiles0")
            .data([quartiles[0]])
            .enter()
            .append("g")
            .attr("class", "quartiles0")
            .attr("transform", function(d, i) {
                return "translate(" + x_scale(d) + "," + (height / 2 - whiskersHeight / 2) + ")";
            })
            .append('line')
            .attr("x2", 0)
            .attr("y2", whiskersHeight)
            .attr("class", "whiskerLine");

        gSvg.selectAll(".quartiles1")
            .data([quartiles[1]])
            .enter()
            .append("g")
            .attr("class", "quartiles1 median")
            .attr("transform", function(d, i) {
                return "translate(" + x_scale(d) + "," + (height / 2 - whiskersHeight / 2) + ")";
            })
            .append('circle')
            .attr("cx", 0)
            .attr("cy", whiskersHeight/2)
            .attr("r", 5)

        gSvg.selectAll(".quartiles2")
            .data([quartiles[2]])
            .enter()
            .append("g")
            .attr("class", "quartiles2")
            .attr("transform", function(d, i) {
                return "translate(" + x_scale(d) + "," + (height / 2 - whiskersHeight / 2) + ")";
            })
            .append('line')
            .attr("x2", 0)
            .attr("y2", whiskersHeight)
            .attr("class", "whiskerLine");
    } catch (error) {
        console.debug(error);
    }
}

let eventHandlers = [];
let areaPlotTooltip = d3.select(".area-plot-tooltip");
let emuChangeTooltip = d3.select(".emu-change-tooltip");
let scatterPlotTooltip = d3.select(".scatter-plot-tooltip");

const resetBtns = [{
    "id": config.TEMP,
    "resetBtn": document.getElementById("tempChartResetBtn")
}, {
    "id": config.SALINITY,
    "resetBtn": document.getElementById("salinityChartResetBtn")
}, {
    "id": config.DISSOLVED_O2,
    "resetBtn": document.getElementById("dissO2ChartResetBtn")
}, {
    "id": config.PHOSPHATE,
    "resetBtn": document.getElementById("phosphateChartResetBtn")
}, {
    "id": config.NITRATE,
    "resetBtn": document.getElementById("nitrateChartResetBtn")
}, {
    "id": config.SILICATE,
    "resetBtn": document.getElementById("silicateChartResetBtn")
}];

function updateChart(params) {

    const { chartContainerWidth, chartContainerHeight, varName, verticalProfileData, scatterPlotData } = params;

    // TODO: apply chart masks
    UIManager.applyMask(`.chart-mask`, chartContainerWidth, chartContainerHeight);

    // TODO: depth mask
    const depthColumnDimensions = emuKeyDepthAnchorEle.getBoundingClientRect();
    UIManager.applyMask(`.depth-mask`, depthColumnDimensions.width, depthColumnDimensions.height);

    let xValue = d => {
        return d.x;
    };
    let xScale = d3.scaleLinear().range([0, chartContainerWidth]);
    let xMap = d => {
        return xScale(xValue(d));
    };

    let yValue = d => {
        return d.y;
    };
    let yScale = d3.scaleLinear().range([0, chartContainerHeight]);
    let yMap = d => {
        return yScale(yValue(d));
    };
    let z = d3.scaleOrdinal(["red", "white"]);

    const attributeFields = [`${varName}_2013`, `${varName}_2018`];

    const cleanedScatterPlotData = scatterPlotData.map(clean);

    const series = createScatterPlotSeries(cleanedScatterPlotData, attributeFields);


    const verticalProfile = verticalProfileData.map(clean);

    const verticalProfileData_ = cleanVerticalProfileData({
        "inputData": verticalProfile,
        "nRecords": verticalProfile.length,
        "clusterIDFieldName": `Cluster37`,
        "topUnitFieldName": config.UNIT_TOP,
        "thicknessFieldName": `ThicknessNeg`
    });


    const verticalProfileChange = cleanedScatterPlotData.filter(feature => {
        if (feature["EMU_Change"] === "Yes") {
            return feature;
        }
    });

    const verticalProfileChangeData = cleanVerticalProfileData({
        "inputData": verticalProfileChange,
        "nRecords": verticalProfile.length,
        "clusterIDFieldName": `Cluster_2013`,
        "topUnitFieldName": config.UNIT_TOP,
        "thicknessFieldName": `ThicknessPos`
    });


    let svg = d3.select(`#${varName}Chart`)
        .append("svg")
        .attr("id", `${varName}`)
        .attr("viewBox", `0 0 ${chartContainerWidth} ${chartContainerHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", chartContainerWidth)
        .attr("height", chartContainerHeight)
        .append("g")
        .attr("transform", "translate(0,0)");

    let zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[0, 0], [chartContainerWidth, chartContainerHeight]])
        .on("zoom", zoomHandler);

    // area
    let area = d3.area();
    area.x(d => {
        return xScale(d.profile);
    });
    area.y0(d => {
        return yScale(d.y0);
    });
    area.y1(d => {
        return yScale(d.y0 + d.y);
    });

    // compute scale domains
    let i = -1;
    xScale.domain(d3.extent(verticalProfile, d => {
        i++;
        return i;
    }));
    yScale.domain([0, verticalProfileData_[0].values[0].y + verticalProfileData_[0].values[0].y0]);

    // Area
    svg.selectAll(".area-chart")
        .data(verticalProfileData_)
        .enter()
        .append("g")
        .attr("class", "area-chart")
        .append("path")
        .attr("class", "area")
        .attr("d", d => {
            if (verticalProfileData_.length === 1) {
                return `M 0 0 H ${chartContainerHeight} V ${chartContainerWidth} H -${chartContainerWidth} L 0 0`;
            } else {
                return area(d.values);
            }
        })
        .style("fill", (d, i) => {
            return config.CLUSTERS[d.name].fill;
        })
        .on("mouseover touchstart pointerenter", areaChartMouseOverHandler)
        .on("mousemove touchmove pointermove", areaChartMouseMoveHandler)
        .on("mouseout touchend pointerout", areaChartMouseOutHandler);

    svg.selectAll(".emu-change-line")
        .data(verticalProfileChangeData)
        .enter()
        .append("g")
        .attr("class", "area")
        .append("path")
        .attr("class", "emu-change-line")
        .style("display", (d, i) => {
            return (showHistoricalData) ? "block" : "none";
        })
        .attr("d", d => {
            return area(d.values);
        })
        .style("fill", (d, i) => {
            return "#FF0000";
        })
        .on("mouseover", changeLineMouseOverHandler)
        .on("mousemove", changeLineMouseMoveHandler)
        .on("mouseout", changeLineMouseOutHandler)
        .attr("data", d => {
            return d;
        });

    // compute scale domains
    xScale.domain(d3.extent(d3.merge(series), d => {
        return d.x;
    })).nice();

    // Scatter Plot
    svg.selectAll(".series")
        .data(series)
        .enter()
        .append("g")
        .attr("type", (d, i) => {
            return (i === 0) ? "2013" : "2018";
        })
        .attr("class", (d, i) => {
            return (i === 0) ? "series historicalPoints" : "series current";
        })
        .style("display", (d, i) => {
            if (i === 0) {
                return (showHistoricalData) ? "block" : "none";
            }
        })
        .style("fill", (d, i) => {
            return z(i);
        })
        .selectAll(".point")
        .data(d => {
            return d;
        })
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("r", 2)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("data", d => {
            return d.data["OBJECTID"];
        })
        .on("mouseover", scatterPlotPointMouseOverHandler)
        .on("mousemove", scatterPlotPointMouseMoveHandler)
        .on("mouseout", scatterPlotPointMouseoutHandler);

    svg.call(zoom);

    let resetBtnEle = document.getElementById(`${varName}ChartResetBtn`);
    eventHandlers.forEach(eventHandler => {
        resetBtnEle.removeEventListener("click", eventHandler);
    });
    resetBtnEle.addEventListener("click", resetHandler);
    eventHandlers.push(resetHandler);

    function resetHandler(event) {
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([chartContainerWidth / 2, chartContainerHeight / 2])
        );
    }

    function zoomHandler({transform}) {
        svg.selectAll("g").attr("transform", transform);
        svg.selectAll("circle").attr("r", 2 / transform.k);

        console.debug("ZOOM IN viewportElement", this.viewportElement.id);

        let resetBtnItem = resetBtns.find(item => item.id === this.viewportElement.id)

        if (transform.k > 1) {
            // show zoom button
            resetBtnItem.resetBtn.style.display = "block";
        } else {
            // hide zoom button
            resetBtnItem.resetBtn.style.display = "none";
        }
    }

    function areaChartMouseOverHandler(event, d) {
        const found = config.EMU_GLOBAL_SUMMARY_DATA.find(target => {
            return target["Cluster37"] === d.name;
        });
        const { data } = d;
        const color = config.CLUSTERS[d.name].fill;
        const max = `${varName}_max`;
        const q3 = `${varName}_Q3`;
        const median = `${varName}_median`;
        const q1 = `${varName}_Q1`;
        const min = `${varName}_min`;

        const maxValue = found[max];
        const upperQuantileValue = found[q3];
        const medianValue = found[median];
        const lowerQuantileValue = found[q1];
        const minValue = found[min];

        const formattedLatitude = selectedMapPoint.latitude.toFixed(2);
        const formattedLongitude = selectedMapPoint.longitude.toFixed(2);
        const formattedUnitTop = UIManager.formatValue(data[config.UNIT_TOP]);

        areaPlotTooltip.html(`
            <div class="global-tooltip">
                <div class="emu-name-description" style="background: ${color};">
                    <div class="emu-number">
                        <div class="emu-number-label">EMU</div>
                        <div class="emu-number-value">${data["Cluster37"]}</div>
                    </div>
                    <div class="emu-description">
                        <div class="emu-description-value">${data["EMU_Name"]}</div>
                    </div>
                </div>
            </div>
            
            <div class="global-tooltip-values-container">
                <div class="tooltip-whisker-chart"></div>
            </div>
            
            <div class="global-tooltip-values-container">
                <div class="global-tooltip-values">
                <div class="selected-emu">
                    <div class="selected-emu-label">Selected EMU ${varName}</div>
                    <div class="selected-emu-value">${data[varName].toFixed(2)}</div>
                </div>
                <div class="global-max">
                    <div class="global-max-label">Global Max</div>
                    <div class="global-max-value">${maxValue.toFixed(2)}</div>
                </div>
                <div class="global-upper-quantile">
                    <div class="global-upper-quantile-label">Global Upper Quantile</div>
                    <div class="global-upper-quantile-value">${upperQuantileValue.toFixed(2)}</div>
                </div>
                <div class="global-median">
                    <div class="global-median-label">Global Median</div>
                    <div class="global-median-value">${medianValue.toFixed(2)}</div>
                </div>
                <div class="global-lower-quantile">
                    <div class="global-lower-quantile-label">Global Lower Quantile</div>
                    <div class="global-lower-quantile-value">${lowerQuantileValue.toFixed(2)}</div>
                </div>
                <div class="global-min">
                    <div class="global-min-label">Global Min</div>
                    <div class="global-min-value">${minValue.toFixed(2)}</div>
                </div>
            </div>
            </div>
            
            <div class="global-tooltip-values-container">
                <div style="font-size: .75em; font-weight: bold;">
                    <span>${formattedLatitude}, ${formattedLongitude}</span> | <span>${formattedUnitTop}m deep</span>, <span>${data["ThicknessPos"]}m thick</span>
                </div>
            </div>
        `);

        createWhiskerPlot(".tooltip-whisker-chart", {
            "chartData" : {
                "maxValue": maxValue,
                "upperQuantile": upperQuantileValue,
                "medianValue": medianValue,
                "lowerQuantile": lowerQuantileValue,
                "minValue": minValue
            },
            "width": 250,
            "height": 10
        });
    }

    function areaChartMouseMoveHandler(event, d) {
        let leftPos = mouseMoveEvent.pageX - 125;
        if ((window.innerWidth - mouseMoveEvent.pageX) < 200) {
            leftPos = window.innerWidth - 300;
        }

        areaPlotTooltip
            .style("left", `${leftPos}px`)
            .style("bottom", `${320}px`)
            .style("display", "block");
    }

    function areaChartMouseOutHandler(event, d) {
        areaPlotTooltip.style("display", "none");
    }



    function changeLineMouseOverHandler(event, d) {
        const { data } = d;
        const cluster2013 = parseInt(data["Cluster_2013"]);
        const cluster2018 = parseInt(data["Cluster_2018"]);
        const tempDiff = parseFloat(data["Temp_Diff"]);
        const salinityDiff = parseFloat(data["salinity_diff"]);
        const dissO2Diff = parseFloat(data["dissO2_2018"]) - parseFloat(data["dissO2_2013"]);
        const nitrateDiff = parseFloat(data["nitrate_diff"]);
        const phosphateDiff = parseFloat(data["phosphate_diff"]);
        const silicateDiff = parseFloat(data["silicate_diff"]);
        const unitTop = parseFloat(data[config.UNIT_TOP]);
        const thickness = parseFloat(data["ThicknessPos"]);

        const formattedLatitude = selectedMapPoint.latitude.toFixed(2);
        const formattedLongitude = selectedMapPoint.longitude.toFixed(2);
        const formattedUnitTop = UIManager.formatValue(unitTop);

        emuChangeTooltip.html(`
                <div class="global-tooltip">
                    <div class="emu-name-description" style="background: red;">
                        <div class="emu-number">
                            <div class="emu-number-label">WAS<br />EMU</div>
                            <div class="emu-number-value">${cluster2013}</div>
                        </div>
                        <div class="emu-description">
                            <div class="emu-description-value">${config.CLUSTERS[cluster2013]["EMU_Name"]}</div>
                        </div>
                    </div>
                </div>
                
                <div class="global-tooltip-values-container">
                    <div class="global-tooltip-values">
                    <div class="selected-emu">
                        <div class="selected-emu-label">Temperature</div>
                        <div class="selected-emu-value">${tempDiff.toFixed(2)}</div>
                    </div>
                    <div class="global-max">
                        <div class="global-max-label">Salinity</div>
                        <div class="global-max-value">${salinityDiff.toFixed(2)}</div>
                    </div>
                    <div class="global-upper-quantile">
                        <div class="global-upper-quantile-label">Dissolved O2</div>
                        <div class="global-upper-quantile-value">${dissO2Diff.toFixed(2)}</div>
                    </div>
                    <div class="global-median">
                        <div class="global-median-label">Nitrate</div>
                        <div class="global-median-value">${nitrateDiff.toFixed(2)}</div>
                    </div>
                    <div class="global-lower-quantile">
                        <div class="global-lower-quantile-label">Phosphate</div>
                        <div class="global-lower-quantile-value">${phosphateDiff.toFixed(2)}</div>
                    </div>
                    <div class="global-min">
                        <div class="global-min-label">Silicate</div>
                        <div class="global-min-value">${silicateDiff.toFixed(2)}</div>
                    </div>
                </div>
                </div>
                
                <div class="global-tooltip-values-container">
                    <div style="font-size: .75em; font-weight: bold;">
                        <span>${formattedLatitude}, ${formattedLongitude}</span> | <span>${formattedUnitTop}m deep</span>, <span>${thickness}m thick</span>
                    </div>
                </div>
            `)
    }

    function changeLineMouseMoveHandler(event, d) {
        let leftPos = mouseMoveEvent.pageX - 125;
        if ((window.innerWidth - mouseMoveEvent.pageX) < 150) {
            leftPos = window.innerWidth - 250;
        }

        emuChangeTooltip
            .style("left", `${leftPos}px`)
            .style("bottom", `${320}px`)
            .style("display", "block");
    }

    function changeLineMouseOutHandler(event, d) {
        emuChangeTooltip.style("display", "none");
    }


    function scatterPlotPointMouseOverHandler(event, d) {
        let time = (this.parentNode.attributes.type.value === "2013") ? "2013" : "2018";
        let v = `${varName}_${time}`;

        let unit = ``;
        if (varName === config.TEMP) {
            unit = `&#176;C`;
        } else if (varName === config.DISSOLVED_O2) {
            unit = "ml/l";
        } else if (varName === config.PHOSPHATE || varName === config.NITRATE || varName === config.SILICATE) {
            unit = "µmol/l";
        }

        let styles = `current`;
        if (time === `2013`) {
            styles = `historicalPoints`;
        }

        let depthValue = d.data[config.UNIT_TOP];
        let emuValue = d.data[v].toFixed(2);
        let formattedDepth = UIManager.formatValue(depthValue);

        scatterPlotTooltip.html(`
                <div class="scatter-plot-tooltip-dot ${styles}"></div>
                <div>${formattedDepth} deep</div>
                <div>${emuValue} ${unit}</div>
            `);

        areaPlotTooltip.style("display", "block");
    }

    function scatterPlotPointMouseMoveHandler(event, d) {
        scatterPlotTooltip
            .style("left", `${mouseMoveEvent.pageX - 100}px`)
            .style("top", `${mouseMoveEvent.pageY - 30}px`)
            .style("display", "block");

        areaPlotTooltip.style("display", "block");
    }

    function scatterPlotPointMouseoutHandler(event, d) {
        scatterPlotTooltip.style("display", "none");
    }
}

function closeButtonHandler(event) {
    // remove graphics from views
    ViewManager.removeGraphics(sceneView);
    ViewManager.removeGraphics(mapView);

    // fade out bottom component
    UIManager.fadeOutHandler("data-container");
    UIManager.fadeOutHandler("selectedDepthContainer");

    // empty highlighted graphics
    ViewManager.clearHighlightGraphics(highlightedList);

    // update URL search parameters
    UrlManager.deleteUrlParams({
        "selX": "selX",
        "selY": "selY"
    });
}



let resizeComplete;
window.onresize = function(){
    clearTimeout(resizeComplete);
    resizeComplete = setTimeout(resizeCompleteHandler, 100);
};
function resizeCompleteHandler() {
    if (verticalProfileData.length > 0 && scatterPlotData.length > 0) {
        emuVariables.forEach(emuVariable => {
            let ele = document.getElementById(`${emuVariable}Chart`);
            UIManager.removeChildren(ele);
        });
        emuVariables.forEach(emuVariable => {
            const { chartContainerWidth, chartContainerHeight } = UIManager.getElementDimensions(`${emuVariable}Chart`);
            updateChart({
                "chartContainerWidth": chartContainerWidth,
                "chartContainerHeight": chartContainerHeight,
                "varName": emuVariable,
                "verticalProfileData": verticalProfileData,
                "scatterPlotData": scatterPlotData
            });
        });
    }
}

let mouseMoveEvent = null;
function mousemove(event) {
    mouseMoveEvent = event;
}
window.addEventListener("mousemove", mousemove);
