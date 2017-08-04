/*
 Copyright 2017 Esri

 Licensed under the Apache License, Version 2.0 (the "License");

 you may not use this file except in compliance with the License.

 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software

 distributed under the License is distributed on an "AS IS" BASIS,

 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 See the License for the specific language governing permissions and

 limitations under the License.​
 */
require([
    // Dojo Charts
    "dojox/charting/action2d/Tooltip",
    "dojox/charting/plot2d/Grid",
    "dojox/charting/plot2d/Lines",
    "dojox/charting/plot2d/Markers",
    "dojox/charting/Chart",
    "dojox/charting/axis2d/Default",
    "dojox/charting/plot2d/Stacked",
    "dojox/charting/plot2d/StackedAreas",
    "dojox/charting/plot2d/StackedColumns",
    "dojox/charting/SimpleTheme",
    "dojox/charting/StoreSeries",
    "dojox/charting/plot2d/MarkersOnly",
    "dojox/gfx/fx",
    // Esri
    "esri/arcgis/Portal",
    "esri/arcgis/OAuthInfo",
    "esri/arcgis/utils",
    "esri/Color",
    "esri/graphic",
    "esri/IdentityManager",
    "esri/lang",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/map",
    "esri/renderers/UniqueValueRenderer",
    "esri/request",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/urlUtils",
    "esri/SpatialReference",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    // Dojo
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/json",
    "dojo/mouse",
    "dojo/on",
    "dojo/promise/all",
    "dojo/query",
    "dojo/store/Observable",
    "dojo/store/Memory",
    "dojo/window",
    // Config
    "config/config",
    // Utility classes
    "utils/ChartUtils",
    "utils/ErrorUtils",
    "utils/QueryUtils",
    "utils/SharingUtils",
    "utils/TableUtils",
    "utils/UserInterfaceUtils",
    // esri
    "dojo/i18n!esri/nls/jsapi",
    "dojo/NodeList-traverse",
    "dojo/domReady!"
], function (Tooltip, Grid, Lines, Markers, Chart, Default, Stacked, StackedAreas, StackedColumns, SimpleTheme, StoreSeries, MarkersOnly, dgf,
             arcgisPortal, OAuthInfo, arcgisUtils, Color, Graphic, esriId, esriLang, ArcGISTiledMapServiceLayer, FeatureLayer, GraphicsLayer, Map, UniqueValueRenderer, esriRequest, Query, QueryTask,
             urlUtils, SpatialReference, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol,
             array, declare, lang, windowBase, Deferred, dom, domAttr, domConstruct, domGeom, domStyle, JSON, mouse, on, all, query, Observable, Memory, win,
             Config,
             ChartUtils, ErrorUtils, QueryUtils, SharingUtils, TableUtils, UserInterfaceUtils, esriBundle) {

    var chartUtils = null,
        errorUtils = null,
        queryUtils = null,
        sharingUtils = null,
        tableUtils = null,
        userInterfaceUtils = null,
    // Map
        map,
    // graphics layer
        mapClickGraphicsLayer = new GraphicsLayer({
            id: "mapClickGraphicsLayer"
        }),
        selectedPointGraphicsMarker = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0]), 0.8),
            new Color([0, 0, 0, 0.35])),
    // selected variable
        selectedVariable = "temp",
        selectedMinValue = 0,
        selectedMaxValue = 0,
        selectedMinSalinityValue = 0,
        selectedMaxSalinityValue = 0,
    // selected map point
        selectedMapPoint = null,
        selectedQtrID = null,
        selectedCluster = null,

    // NOTE: Adding 2 layers per SB's request
    // ocean fill
        oceansFill = new FeatureLayer(Config.ClusterPolygons_FEATURE_SERVICE_URL, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            opacity: Config.OCEANS_LAYER_OPACITY
        }),

    // ocean border
        oceansBorder = new FeatureLayer(Config.ClusterPolygons_FEATURE_SERVICE_URL, {
            mode: FeatureLayer.MODE_ONDEMAND,
            outFields: ["*"],
            opacity: Config.OCEANS_LAYER_OPACITY
        }),

    // Query Task
        WOAPointsWest_QT = new QueryTask(Config.WOAPointsWest_FEATURE_SERVICE_URL),
        woaPointsMergedQT = new QueryTask(Config.WOAPointsClusterWest_FEATURE_SERVICE_URL),
        summaryQT = new QueryTask(Config.ClusterSummary_FEATURE_SERVICE_URL),
    // tables
        clusterTable = null,
        previousNode = null,
        currentNode = null,
        previouslySelectedRow = null,
        previousRowBackgroundColor = null,
    // charting
        chart = null,
        chartXaxisLabel = Config.CHART_X_AXIS.title,
    // stores
        woaPointsStore = new Observable(new Memory({
            idProperty: "id",
            data: []
        })),
        woaPointsStore2 = new Observable(new Memory({
            idProperty: "id",
            data: []
        })),
        woaPointsMergedStore = new Observable(new Memory({
            idProperty: "id",
            data: []
        })),
    //
        linesSeries = [],
        mouseTimer = null,
        clusterTableMouseTimer = null,
    // chart popup data
        chartPopupData = null,
        vs = null,
        windowWidth = null,
        windowHeight = null,
    // width of chart content pane
        chartContentPaneWidth = 0,
    // selected QtrDegreeID
        previousFeatureQtrDegreeID = null;

    initialize();

    function initialize() {
        // initialize Tailcoat
        T.init();
        // change default placeholder in the search dijit
        esriBundle.widgets.Search.main.placeholder = Config.SEARCH_DIJIT_DEFAULT_PLACEHOLDER;
        // Portal
        Config.portal = new arcgisPortal.Portal(Config.SHARING_HOST);
        // Specify the domain where the map associated with the webmap id is located.
        // https://developers.arcgis.com/javascript/jsapi/esri.arcgis.utils-amd.html#arcgisurl
        arcgisUtils.arcgisUrl = window.location.protocol + Config.FORWARD_SLASHES + Config.ARCGIS_URL;
        // charting utils
        chartUtils = new ChartUtils();
        // error utility methods
        errorUtils = new ErrorUtils();
        // sharing utility methods
        sharingUtils = new SharingUtils();
        sharingUtils.HOST_NAME = window.location.hostname;
        sharingUtils.PATH_NAME = window.location.pathname;
        // user interface utility methods
        userInterfaceUtils = new UserInterfaceUtils();
        // table utility methods
        tableUtils = new TableUtils();
        // query utility methods
        queryUtils = new QueryUtils();
        // click handler for splash screen thumbnail
        on(query(".app-image")[0], "click", appHeaderThumbnailClickHandler);
        // display the anchor node
        domStyle.set(dom.byId("anchor"), "display", "block");

        // Create the content panes
        //
        //
        // create a BorderContainer as the top widget in the hierarchy
        var borderContainer = userInterfaceUtils.createBorderContainer();
        // map content pane
        var mapContentPane = userInterfaceUtils.createContentPane("map-content-pane", "left", Config.MAP_CONTENT_PANE);
        borderContainer.addChild(mapContentPane);
        // chart content pane
        var chartContentPane = userInterfaceUtils.createContentPane("chart-content-pane", "right", Config.PROFILE_DROP_DOWN);
        borderContainer.addChild(chartContentPane);
        // grid content pane (includes the table and chart below the map and the visualization respectively)
        var gridContentPane = userInterfaceUtils.createContentPane("grid-content-pane", "bottom", tableUtils.startup());
        borderContainer.addChild(gridContentPane);
        // start up
        borderContainer.startup();

        // create map
        arcgisUtils.createMap(Config.WEBMAP_ID, "map", Config.MAP_OPTIONS).then(function (response) {
            // map
            map = response.map;
            // search
            userInterfaceUtils.createSearch(map);
            // create chart
            chartUtils.createChart("chart");
            // add plots
            chartUtils.addLinesPlot();
            chartUtils.addStackedColumnsPlot();
            chartUtils.addMarkersPlot();
            chartUtils.addMutliVariableSelectionMarkersPlot();
            // chart x/y axis
            chartUtils.chart.addAxis("x", Config.CHART_X_AXIS);
            chartUtils.chart.addAxis("temperature x", {
                min: 0,
                max: 35,
                leftBottom: false,
                title: Config.CHART_X_AXIS.title
            });
            chartUtils.chart.addAxis("y", Config.CHART_Y_AXIS);
            // move the markers plot to the front of the chart
            chartUtils.chart.movePlotToFront(Config.TEMP_PLOT);
            chartUtils.chart.movePlotToFront(Config.SALINITY_PLOT);
            // listen for click events on the clusters (stacked columns)
            chartUtils.chart.connectToPlot("stackedColumnsPlot", chartPlotSelectionHandler);
            // marker tooltips for temperature and salinity
            var tempMarkersPlotTooltips = new Tooltip(chartUtils.chart, Config.TEMP_PLOT, {
                text: function (point) {
                    var pointData = point.plot.series[0].data[point.index];
                    if (selectedVariable === "temp") {
                        return pointData.x + " &#8451; <br/>" + pointData.y + " meters";
                    } else {
                        return pointData.x + "<br/>" + pointData.y + " meters";
                    }
                }
            });
            var salinityMarkersPlotTooltips = new Tooltip(chartUtils.chart, Config.SALINITY_PLOT, {
                text: function (point) {
                    var pointData = point.plot.series[0].data[point.index];
                    if (selectedVariable === "temp") {
                        return pointData.x + " &#8451; <br/>" + pointData.y + " meters";
                    } else {
                        return pointData.x + "<br/>" + pointData.y + " meters";
                    }
                }
            });
            // chart mouse over events
            on(dom.byId("chart"), "mousemove", function (evt) {
                if (esriLang.isDefined(dom.byId("chartPopup"))) {
                    domConstruct.destroy("chartPopup");
                }
                clearTimeout(mouseTimer);
                mouseTimer = setTimeout(function () {
                    mouseStopped(evt);
                }, 300);
            });
            // chart mouse events
            on(dom.byId("dijit_layout_ContentPane_1"), mouse.leave, function (evt) {
                if (esriLang.isDefined(dom.byId("chartPopup"))) {
                    domConstruct.destroy("chartPopup");
                }
                clearTimeout(mouseTimer);
            });
            // chart mouse events
            on(query(".variable-dropdown-content-wrapper")[0], mouse.enter, function (evt) {
                if (esriLang.isDefined(dom.byId("chartPopup"))) {
                    domConstruct.destroy("chartPopup");
                }
                clearTimeout(mouseTimer);
            });

            // table mouse events

            // drop down list mouse over handlers
            on(query(".variable-dropdown-content-wrapper")[0], mouse.enter, userInterfaceUtils.dropdownListMouseEnterHandler);
            on(query(".variable-dropdown-content-wrapper")[0], mouse.leave, userInterfaceUtils.dropdownListMouseLeaveHandler);
            // drop down list click handler
            on(query(".variable-dropdown-list"), "click", dropdownListSelectHandler);
            // map click handler
            on(map, "click", mapClickHandler);
            // map extent change handler
            on(map, "extent-change", mapExtentChangeHandler);

            var myLayer = new ArcGISTiledMapServiceLayer(Config.TOP_UNIT);
            // TODO
            myLayer.on("error", errorUtils.serviceLoadErrorHandler);
            map.addLayer(oceansBorder, 5);
            map.addLayer(myLayer, 3);
            map.addLayer(oceansFill, 2);
            map.addLayer(mapClickGraphicsLayer, 4);

            // TODO Remove duplicate
            var renderer = null;
            var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
            defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
            // create renderer
            renderer = new UniqueValueRenderer(defaultSymbol, Config.Cluster37);
            // add symbol for each possible value
            array.forEach(Config.CLUSTERS, function (cluster, i) {
                //renderer.addValue(i, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL), new Color(cluster.fill)));
                renderer.addValue(i, new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL), new Color([140, 100, 100, 0.65])));
            });
            oceansFill.setRenderer(renderer);
            oceansFill.setDefinitionExpression(Config.Cluster37 + " = null");

            defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
            defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0]), 3);
            // create renderer
            renderer = new UniqueValueRenderer(defaultSymbol, Config.Cluster37);
            // add symbol for each possible value
            array.forEach(Config.CLUSTERS, function (cluster, i) {
                renderer.addValue(i, new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0], 0), 3)));
            });
            oceansBorder.setRenderer(renderer);
            oceansBorder.setDefinitionExpression(Config.Cluster37 + " = null");

            // add the overview map
            userInterfaceUtils.addOverviewMap(map);

            // TODO
            // check for any URL parameters
            sharingUtils.getUrlParams().then(function (urlParamsResponse) {
                if (esriLang.isDefined(urlParamsResponse)) {
                    // check if the extent is set in the url
                    sharingUtils.updateMapExtent(urlParamsResponse).then(function (mapExtentResponse) {
                        if (mapExtentResponse) {
                            map.setExtent(mapExtentResponse);
                            // check if the selected map point is set in the url
                            sharingUtils.updateSelectedPoint(urlParamsResponse).then(function (selectedPointResponse) {
                                if (selectedPointResponse) {
                                    // make visible bottom content pane
                                    domStyle.set(query(".grid-content-pane")[0], "opacity", "1.0");
                                    // hide splash screen
                                    userInterfaceUtils.toggleSplashScreenView(false);
                                    // selected map point
                                    selectedMapPoint = selectedPointResponse;
                                    // check if a variable is set in the url
                                    sharingUtils.updateSelectedVariable(urlParamsResponse).then(function (selectedVariableResponse) {
                                        if (selectedVariableResponse) {
                                            selectedVariable = selectedVariableResponse;
                                            chartXaxisLabel = userInterfaceUtils.updateChartXAxisTitle(selectedVariable);
                                        }
                                        // update selected variable in dropdown
                                        array.forEach(Config.PROFILES, function (profile) {
                                            if (selectedVariable === profile.value) {
                                                query(".dropdown")[0].innerHTML = profile.label;
                                            }
                                        });
                                        // run the query
                                        runQuery().then(function (response) {
                                            sharingUtils.updateSelectedClusterID(urlParamsResponse).then(function (selectedClusterIDResponse) {
                                                // TODO
                                                if (esriLang.isDefined(selectedClusterIDResponse.clusterID)) {
                                                    userInterfaceUtils.showTableLoader(".summary-table-loader", true);
                                                    // query store to get cluster ID (it's not returned in the click event on the chart);
                                                    var clusterData = woaPointsMergedStore.query({
                                                        "UnitTop": selectedClusterIDResponse.unitTop
                                                    });
                                                    // cluster ID
                                                    sharingUtils.selectedClusterID = clusterData[0][Config.Cluster37];
                                                    // cluster top
                                                    sharingUtils.selectedUnitTop = clusterData[0]["UnitTop"];

                                                    //var seriesName = sharingUtils.selectedClusterID + "_" + clusterData[0]["ThicknessPlus"];
                                                    var seriesName = sharingUtils.selectedClusterID + "_" + clusterData[0]["UnitTop"];
                                                    //
                                                    updateLineSeries(linesSeries, seriesName);

                                                    // reset table row styles
                                                    var clusterTableRows = tableUtils.getAllTableRows(".cluster-table");
                                                    tableUtils.resetAllTableRowStyles(clusterTableRows);
                                                    // update summary table
                                                    updateSummaryTable(sharingUtils.selectedClusterID);
                                                    // update oceans polygon layer
                                                    updateOceansPolygons(sharingUtils.selectedClusterID);

                                                    array.forEach(clusterTableRows, function (clusterTableRow, i) {
                                                        if (i > 0) {
                                                            if (esriLang.isDefined(clusterTableRow.innerText)) {
                                                                var currentRowClusterID = clusterTableRow.children[0].innerText;
                                                                var currentRowUnitTop = clusterTableRow.children[1].innerText;
                                                                if (currentRowClusterID == sharingUtils.selectedClusterID && currentRowUnitTop == sharingUtils.selectedUnitTop) {
                                                                    domStyle.set(clusterTableRow, "border", Config.CLUSTER_TABLE_SELECTED_ROW_COLOR);
                                                                }
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    // cluster ID was reset (?)
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });

        }, errorUtils.createMapErrorHandler);

        // get width of container pane
        chartContentPaneWidth = domStyle.get(query(".chart-content-pane")[0], "width");
        // display splash screen
        domConstruct.place('<div class="splash-screen" style="width:' + chartContentPaneWidth + 'px">' +
            '   <div class="row">' +
            '       <div class="column-24">' +
            '           <div class="splash-screen-title">' + Config.SPLASH_SCREEN_TITLE + '</div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="row">' +
            '       <div class="column-24">' +
            '           <img class="splash-screen-image" src="images/splash-screen.png">' +
            '       </div>' +
            '   </div>' +
            '   <div class="row">' +
            '       <div class="column-24">' +
            '           <div class="splash-screen-instructions instructions-a">' + Config.SPLASH_SCREEN_INSTRUCTIONS_A + '</div>' +
            '           <div class="splash-screen-instructions instructions-b">' + Config.SPLASH_SCREEN_INSTRUCTIONS_B + '</div>' +
            '           <div class="splash-screen-instructions instructions-a">' + Config.SPLASH_SCREEN_INSTRUCTIONS_C + '</div>' +
            '       </div>' +
            '   </div>' +
            '</div>', 'anchor', 'first');
    }

    /**
     * Chart click event handler.
     *
     * @param evt
     */
    function chartPlotSelectionHandler(evt) {
        var clusterData = null;
        if (evt.type === "onmouseover") {
            chartPopupData = null;
            selectedCluster = evt.cy;
            clusterData = woaPointsMergedStore.query({
                "UnitBottom": selectedCluster
            });
            chartPopupData = woaPointsMergedStore.query({
                "Cluster37": clusterData[0][Config.Cluster37],
                "UnitTop": clusterData[0]["UnitTop"]
            })[0];
        }

        if (evt.type === "onmouseout") {
            chartPopupData = null;
            selectedCluster = evt.cy;
            clusterData = woaPointsMergedStore.query({
                "UnitBottom": selectedCluster
            });
            chartPopupData = woaPointsMergedStore.query({
                "Cluster37": clusterData[0][Config.Cluster37],
                "UnitTop": clusterData[0]["UnitTop"]
            })[0];
        }

        if (evt.type === "onclick") {
            // table loading indicator
            userInterfaceUtils.showTableLoader(".summary-table-loader", true);
            // selected cluster
            selectedCluster = evt.cy;
            // query store to get cluster ID (it's not returned in the click event on the chart);
            clusterData = woaPointsMergedStore.query({
                "UnitBottom": selectedCluster
            });
            //console.debug("clusterData", clusterData[0]);
            // cluster ID
            sharingUtils.selectedClusterID = clusterData[0][Config.Cluster37];
            // cluster top
            sharingUtils.selectedUnitTop = clusterData[0]["UnitTop"];
            // set the series name
            var seriesName = sharingUtils.selectedClusterID + "_" + sharingUtils.selectedUnitTop;
            // set selected cluster ID/Unit Bottom values and map point in the url params
            sharingUtils.updateAllUrlParams(selectedVariable, selectedMapPoint);
            // update the top and bottom highlight line in the chart
            updateLineSeries(linesSeries, seriesName);
            // reset table row styles
            var clusterTableRows = tableUtils.getAllTableRows(".cluster-table");
            tableUtils.resetAllTableRowStyles(clusterTableRows);
            // update summary table
            updateSummaryTable(sharingUtils.selectedClusterID);
            // update oceans polygon layer
            updateOceansPolygons(sharingUtils.selectedClusterID);

            array.forEach(clusterTableRows, function (clusterTableRow, i) {
                if (i > 0) {
                    if (esriLang.isDefined(clusterTableRow.innerText)) {
                        var currentRowClusterID = clusterTableRow.children[0].innerText;
                        var currentRowUnitTop = clusterTableRow.children[1].innerText;
                        if (currentRowClusterID == sharingUtils.selectedClusterID && currentRowUnitTop == sharingUtils.selectedUnitTop) {
                            domStyle.set(clusterTableRow, "border", Config.CLUSTER_TABLE_SELECTED_ROW_COLOR);
                        }
                    }
                }
            });
        }
    }

    function dropdownListSelectHandler() {
        domStyle.set(query(".variable-dropdown-content")[0], "display", "none");

        query(".dropdown")[0].innerHTML = this.innerHTML;
        // set the selected variable (i.e. temp, salinity, etc...)
        selectedVariable = domAttr.get(this, "data-value");

        sharingUtils.updateUrlExtentAndSelMapPointParams(selectedMapPoint);
        sharingUtils.updateUrlExtentAndSelMapPointAndSelVarParams(selectedVariable, selectedMapPoint);
        sharingUtils.updateAllUrlParams(selectedVariable, selectedMapPoint);

        if (esriLang.isDefined(selectedMapPoint)) {
            // update X-axis title
            chartXaxisLabel = userInterfaceUtils.updateChartXAxisTitle(selectedVariable);
            runQuery().then(function (response) {
                //console.debug("run query", response);
            });
        } else {
            // no point selected
        }
    }

    function mapExtentChangeHandler(evt) {
        setQueryDistance();
        // update the extent vars in case the user shares the map
        sharingUtils.currentMapExtent = evt.extent;
        // TODO update url params (BETTER way to do this)
        sharingUtils.updateUrlExtentParams();
        sharingUtils.updateUrlExtentAndSelMapPointParams(selectedMapPoint);
        sharingUtils.updateUrlExtentAndSelMapPointAndSelVarParams(selectedVariable, selectedMapPoint);
        sharingUtils.updateAllUrlParams(selectedVariable, selectedMapPoint);
    }

    function mapClickHandler(evt) {
        // make visible bottom content pane
        domStyle.set(query(".grid-content-pane")[0], "opacity", "1.0");
        // update query buffer parameter
        setQueryDistance();
        // hide splash screen
        userInterfaceUtils.toggleSplashScreenView(false);
        // re-order the map layer (for some reason the ocean's FS does not reorder)
        var lastChild = dom.byId("map_layer1");
        domConstruct.place(lastChild, dom.byId("map_layers"), "last");
        // hide map's infowindow
        map.infoWindow.hide();
        // set the selected map point
        selectedMapPoint = evt.mapPoint;
        // update url params
        //sharingUtils.updateUrlExtentAndSelMapPointParams(selectedMapPoint);
        //sharingUtils.updateUrlExtentAndSelMapPointAndSelVarParams(selectedVariable, selectedMapPoint);

        // store extent
        // update the extent vars in case the user shares the map
        sharingUtils.currentMapExtent = map.extent;
        // TODO update url params (BETTER way to do this)
        sharingUtils.updateUrlExtentParams();
        sharingUtils.updateUrlExtentAndSelMapPointParams(selectedMapPoint);
        sharingUtils.updateUrlExtentAndSelMapPointAndSelVarParams(selectedVariable, selectedMapPoint);
        //sharingUtils.updateAllUrlParams(selectedVariable, selectedMapPoint);

        // clear the graphic layer
        mapClickGraphicsLayer.clear();
        // empty the tables
        userInterfaceUtils.emptyTables();
        // reset definition expression
        oceansFill.setDefinitionExpression(Config.Cluster37 + " = null");
        oceansBorder.setDefinitionExpression(Config.Cluster37 + " = null");
        // query the services and update chart
        runQuery().then(function (response) {
            // if there is no cluster ID in the url params, ...
            var currentUrl = sharingUtils.HOST_NAME + sharingUtils.PATH_NAME + window.location.search;
            var urlObj = urlUtils.urlToObject(currentUrl);
            if (urlObj.query) {
                if (!esriLang.isDefined(urlObj.query.clusterID)) {
                    var clusterTableRow = tableUtils.getTableFirstRow(".cluster-table");
                    sharingUtils.selectedClusterID = clusterTableRow.children[0].innerText;
                    sharingUtils.selectedUnitTop = clusterTableRow.children[1].innerText;
                    var seriesName = sharingUtils.selectedClusterID + "_" + sharingUtils.selectedUnitTop;
                    // update url params
                    sharingUtils.updateAllUrlParams(selectedVariable, selectedMapPoint);
                    //
                    updateLineSeries(linesSeries, seriesName);
                    // update summary table
                    updateSummaryTable(sharingUtils.selectedClusterID);
                    // update oceans polygon layer
                    updateOceansPolygons(sharingUtils.selectedClusterID);
                    // highlight the row
                    domStyle.set(clusterTableRow, "border", Config.CLUSTER_TABLE_SELECTED_ROW_COLOR);
                }
            }
        });
    }

    function runQuery() {
        var deferred = new Deferred();
        // show loading indicator
        userInterfaceUtils.showLoader(true);
        // selected map point
        queryUtils.queryParams.geometry = selectedMapPoint;
        // query feature services
        all({
            // Points
            woaPointsPromise: WOAPointsWest_QT.execute(queryUtils.queryParams),
            // Merged
            woaPointsMergedPromise: woaPointsMergedQT.execute(queryUtils.queryParams)
        }).then(function (results) {
            woaPointsQueryResultSuccessHandler(results.woaPointsPromise.features);
            woaPointsMergedQueryResultSuccessHandler(results.woaPointsMergedPromise.features).then(function (chart) {
                var minBounds = null;
                var minSalinityBounds = null;

                if (selectedMinValue > 1) {
                    minBounds = selectedMinValue - 1;
                } else {
                    minBounds = selectedMinValue;
                }

                if (selectedMinSalinityValue > 1) {
                    minSalinityBounds = selectedMinSalinityValue - 1;
                } else {
                    minSalinityBounds = selectedMinSalinityValue;
                }

                if (selectedVariable === "temp-salinity") {
                    chart.addAxis("x", {
                        title: chartXaxisLabel,
                        titleOrientation: "away",
                        horizontal: true,
                        min: Math.round(minBounds),
                        max: selectedMaxValue + 1
                    });
                    chart.addAxis("temperature x", {
                        title: "Salinity",
                        horizontal: true,
                        min: Math.round(minSalinityBounds),
                        max: selectedMaxSalinityValue + 1,
                        leftBottom: false
                    });
                } else {
                    chart.addAxis("x", {
                        title: chartXaxisLabel,
                        titleOrientation: "away",
                        horizontal: true,
                        min: Math.round(minBounds),
                        max: selectedMaxValue + 1
                    });
                    chart.removeAxis("temperature x");
                }

                chart.render();
                // update x-axis title
                userInterfaceUtils.formatChartXaxisTitle();
                // remove updating loader
                userInterfaceUtils.showLoader(false);
                // update geometry of dropdown menu
                //
                // chart container node
                var chartContainerNode = dom.byId("chart");
                // chart's children
                var chartChildren = dom.byId("chart").children;
                // chart's rect
                //console.log(chartChildren[chartChildren.length - 1]);
                //var chartRectNode = chartChildren[chartChildren.length - 1].children[2];
                var chartRectNode = chartChildren[chartChildren.length - 1].childNodes[2];
                // chart's rect
                var chartRectWidth = domAttr.get(chartRectNode, "width");
                // chart container width
                var chartContainerWidth = domStyle.get(chartContainerNode, "width");
                var chartNodeAndRectWidthDiff = chartContainerWidth - chartRectWidth;
                //
                // update dropdown style
                // TODO REMOVE hard-coded values
                domStyle.set(query(".dropdown-profiles")[0], "width", chartRectWidth + "px");
                domStyle.set(query(".dropdown-profiles")[0], "margin-left", (chartNodeAndRectWidthDiff - 14) + "px");
                domStyle.set(query(".variable-dropdown-content")[0], "width", chartRectWidth + "px");
                domStyle.set(query(".variable-dropdown-content")[0], "margin-left", (chartNodeAndRectWidthDiff - 14) + "px");

                domStyle.set(query(".variable-dropdown-content-wrapper")[0], "opacity", "1.0");

                deferred.resolve(true);
            });
        });
        return deferred.promise;
    }

    function woaPointsQueryResultSuccessHandler(features) {
        var uniqueSet = [];
        previousFeatureQtrDegreeID = null;
        array.forEach(features, function (feature, i) {
            if (i === 0) {
                uniqueSet.push(feature);
                previousFeatureQtrDegreeID = feature.attributes.QtrDegreeID;
            }

            if (feature.attributes.QtrDegreeID === previousFeatureQtrDegreeID && i > 0) {
                uniqueSet.push(feature);
                previousFeatureQtrDegreeID = feature.attributes.QtrDegreeID;
            }
        });
        features = uniqueSet;
        // check if user selected a valid point
        if (features.length > 0) {
            selectedQtrID = features[0].attributes.QtrDegreeID;
            // remove the overlay
            userInterfaceUtils.showOverlay(false);
            // show the chart
            userInterfaceUtils.showChart(true);
            // add graphic to selected point
            mapClickGraphicsLayer.add(new Graphic(features[0].geometry, selectedPointGraphicsMarker));

            if (selectedVariable !== "temp-salinity") {
                buildSelectedVariableArray(selectedVariable, features).then(function (variableValues) {
                    if (variableValues.length > 0) {
                        // selected min/max values
                        selectedMinValue = userInterfaceUtils.getMinValue(variableValues).x;
                        selectedMaxValue = userInterfaceUtils.getMaxValue(variableValues).x;

                        if (woaPointsStore.data.length > 0) {
                            woaPointsStore.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries", woaPointsStore.data);
                        } else {
                            // observable store
                            woaPointsStore.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries", variableValues, Config.CHART_MARKER_SERIES_TEMPERATURE);
                        }
                    } else {
                        userInterfaceUtils.showOverlay(true);
                        userInterfaceUtils.showChart(false);
                        if (woaPointsStore.data.length > 0) {
                            woaPointsStore.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries", woaPointsStore.data);
                        } else {
                            // observable store
                            woaPointsStore.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries", variableValues, Config.CHART_MARKER_SERIES_TEMPERATURE);
                        }
                    }
                });
                buildSelectedVariableArray("salinity", features).then(function (variableValues) {
                    variableValues = [];

                    if (variableValues.length > 0) {
                        // selected min/max values
                        selectedMinSalinityValue = userInterfaceUtils.getMinValue(variableValues).x;
                        selectedMaxSalinityValue = userInterfaceUtils.getMaxValue(variableValues).x;

                        if (woaPointsStore2.data.length > 0) {
                            woaPointsStore2.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries2", woaPointsStore2.data, {
                                plot: Config.TEMP_PLOT
                            });
                        } else {
                            // observable store
                            woaPointsStore2.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries2", variableValues, Config.CHART_MARKER_SERIES_SALINITY, {
                                plot: Config.TEMP_PLOT
                            });
                        }
                    } else {
                        if (woaPointsStore2.data.length > 0) {
                            woaPointsStore2.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries2", woaPointsStore2.data, {
                                plot: Config.TEMP_PLOT
                            });
                        } else {
                            // observable store
                            woaPointsStore2.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries2", variableValues, Config.CHART_MARKER_SERIES_SALINITY, {
                                plot: Config.TEMP_PLOT
                            });
                        }
                    }
                });
            } else {
                buildSelectedVariableArray("temp", features).then(function (variableValues) {
                    if (variableValues.length > 0) {
                        // selected min/max values
                        selectedMinValue = userInterfaceUtils.getMinValue(variableValues).x;
                        selectedMaxValue = userInterfaceUtils.getMaxValue(variableValues).x;

                        if (woaPointsStore.data.length > 0) {
                            woaPointsStore.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries", woaPointsStore.data, {
                                plot: Config.SALINITY_PLOT
                            });
                        } else {
                            // observable store
                            woaPointsStore.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries", variableValues, Config.CHART_MARKER_SERIES_TEMPERATURE, {
                                plot: Config.SALINITY_PLOT
                            });
                        }
                    } else {
                        userInterfaceUtils.showOverlay(true);
                        userInterfaceUtils.showChart(false);
                        if (woaPointsStore.data.length > 0) {
                            woaPointsStore.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries", woaPointsStore.data, {
                                plot: Config.SALINITY_PLOT
                            });
                        } else {
                            // observable store
                            woaPointsStore.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries", variableValues, Config.CHART_MARKER_SERIES_TEMPERATURE, {
                                plot: Config.SALINITY_PLOT
                            });
                        }
                    }
                });
                buildSelectedVariableArray("salinity", features).then(function (variableValues) {
                    if (variableValues.length > 0) {
                        // selected min/max values
                        selectedMinSalinityValue = userInterfaceUtils.getMinValue(variableValues).x;
                        selectedMaxSalinityValue = userInterfaceUtils.getMaxValue(variableValues).x;

                        if (woaPointsStore2.data.length > 0) {
                            woaPointsStore2.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries2", woaPointsStore2.data, {
                                plot: Config.TEMP_PLOT
                            });
                        } else {
                            // observable store
                            woaPointsStore2.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries2", variableValues, Config.CHART_MARKER_SERIES_SALINITY, {
                                plot: Config.TEMP_PLOT
                            });
                        }
                    } else {
                        if (woaPointsStore2.data.length > 0) {
                            woaPointsStore2.data = variableValues;
                            // update chart
                            chartUtils.chart.updateSeries("selectedVariableSeries2", woaPointsStore2.data, {
                                plot: Config.TEMP_PLOT
                            });
                        } else {
                            // observable store
                            woaPointsStore2.data = variableValues;
                            // add marker data for selected variable
                            chartUtils.chart.addSeries("selectedVariableSeries2", variableValues, Config.CHART_MARKER_SERIES_SALINITY, {
                                plot: Config.TEMP_PLOT
                            });
                        }
                    }
                });
            }
        } else {
            userInterfaceUtils.showLoader(false);
            userInterfaceUtils.showOverlay(true);
            userInterfaceUtils.showChart(false);
            woaPointsStore.data = [];
            woaPointsStore2.data = [];
            // update chart
            chartUtils.chart.updateSeries("selectedVariableSeries", woaPointsStore.data, {
                plot: Config.TEMP_PLOT
            });
            chartUtils.chart.updateSeries("selectedVariableSeries2", woaPointsStore2.data, {
                plot: Config.SALINITY_PLOT
            });
        }
    }

    function woaPointsMergedQueryResultSuccessHandler(features) {
        var uniqueSet = [];
        array.forEach(features, function (feature, i) {
            if (i === 0) {
                uniqueSet.push(feature);
            }

            if (feature.attributes.QtrDegreeID === previousFeatureQtrDegreeID && i > 0) {
                uniqueSet.push(feature);
            }
        });
        features = uniqueSet;
        var deferred = new Deferred();
        if (features.length > 0) {
            buildMergedDataArray(features).then(function (variableValues) {
                if (esriLang.isDefined(chartUtils.chart)) {
                    if (woaPointsMergedStore.data.length > 0) {
                        domConstruct.empty("clusterTable");
                    }
                    woaPointsMergedStore.data = variableValues;
                    updateClusterTable("clusterTable", woaPointsMergedStore.data);
                } else {
                    // update store
                    woaPointsMergedStore.data = variableValues;
                    // empty the table
                    domConstruct.empty("clusterTable");
                }

                on(query(".cluster-row"), mouse.enter, clusterRowMouseEnterHandler);
                on(query(".cluster-row"), mouse.leave, clusterRowMouseLeaveHandler);
                on(query(".cluster-row"), "click", clusterRowMouseClickHandler);
                on(query(".cluster-row"), "mousemove", clusterRowMouseMoveHandler);

                // clear Lines plot
                clearPlotSeries("linesPlot");
                // clear StackArea plot
                clearPlotSeries("stackedColumnsPlot");

                var clusterThemes = [];
                array.forEach(woaPointsMergedStore.data, function (obj, nClusters) {
                    var clusterValue = obj[Config.Cluster37];
                    clusterThemes.push(userInterfaceUtils.setClusterColorTheme(clusterValue));

                    if (nClusters === woaPointsMergedStore.data.length - 1) {
                        // create series
                        linesSeries = [];
                        array.forEach(woaPointsMergedStore.data, function (obj, i) {
                            var j = 0;
                            var thicknessPlus = -obj.ThicknessPlus;
                            var seriesName = "stackedColumnsPlot";
                            var linesPlotData = [];
                            while (j < 200) {
                                linesPlotData.push({
                                    x: j,
                                    y: obj.y
                                });

                                chartUtils.chart.addSeries(seriesName + i + j, [{
                                    x: j,
                                    y: thicknessPlus
                                }], {
                                    plot: "stackedColumnsPlot",
                                    stroke: {
                                        width: 0
                                    },
                                    fill: clusterThemes[i].fill
                                });
                                j++;
                            }

                            // add the line series
                            linesSeries.push({
                                "seriesName": obj[Config.Cluster37] + "_" + obj["UnitTop"],
                                "seriesData": linesPlotData
                            });

                            // resolve when complete
                            if (i === woaPointsMergedStore.data.length - 1) {
                                createMaxDepthLineSeriesData(woaPointsMergedStore.data[woaPointsMergedStore.data.length - 1]).then(function (linesPlotData) {
                                    // account for 0
                                    linesSeries.push({
                                        "seriesName": "sea-level",
                                        "seriesData": linesPlotData
                                    });
                                    deferred.resolve(chartUtils.chart);
                                });
                            }
                        });
                    }
                });
            });
        } else {
            // no features
            domConstruct.empty("clusterTable");
        }
        return deferred.promise;
    }

    function createMaxDepthLineSeriesData(data) {
        var deferred = new Deferred();
        var linesPlotData = [];
        var j = 0;
        while (j < 200) {
            linesPlotData.push({
                x: j,
                y: data["UnitBottom"]
            });
            j++;

            if (j === 149) {
                deferred.resolve(linesPlotData);
            }
        }
        return deferred.promise;
    }

    function buildSelectedVariableArray(selectedVariable, features) {
        var deferred = new Deferred(),
            nFeatures = features.length - 1,
            selectedVariableData = [];
        array.forEach(features, function (feature, i) {
            var jsonObj = userInterfaceUtils.formatValue(feature, selectedVariable);
            if (esriLang.isDefined(jsonObj.x)) {
                selectedVariableData.push(jsonObj);
            }

            if (i === nFeatures) {
                if (selectedVariableData.length > 0) {
                    selectedVariableData.sort(function (a, b) {
                        return a.x - b.x
                    });
                } else {
                    selectedVariableData = [];
                }
                deferred.resolve(selectedVariableData);
            }
        });
        return deferred.promise;
    }

    function buildMergedDataArray(features) {
        var deferred = new Deferred(),
            nFeatures = features.length - 1,
            selectedVariableData = [];
        array.forEach(features, function (feature, i) {
            selectedVariableData.push(userInterfaceUtils.cleanJSON(feature));
            if (i === nFeatures) {
                deferred.resolve(selectedVariableData);
            }
        });
        return deferred.promise;
    }

    /**
     * Table below chart
     *
     * @param anchorNode
     * @param data
     */
    function updateClusterTable(anchorNode, data) {
        // TODO no need to re-create this each time
        // create table column headers
        var table = tableUtils.createTableColumnHeaders(anchorNode);
        // create table rows
        array.forEach(data, function (cluster) {
            domConstruct.create('tr', {
                class: 'cluster-row',
                style: {
                    "backgroundColor": userInterfaceUtils.setClusterColorTheme(cluster.Cluster37).fill
                },
                innerHTML: '<td class="summary-table-cell cluster-table-row">' + cluster.Cluster37 + '</td>' +
                '<td class="summary-table-cell cluster-table-row">' + cluster.UnitTop + '</td>' +
                '<td class="summary-table-cell cluster-table-row">' + cluster.ThicknessPlus + '</td>'
            }, table);
        });
    }

    function clusterRowMouseEnterHandler(event) {
        var node = event.target.parentNode;
        previousRowBackgroundColor = domStyle.get(node, "backgroundColor");
        if (previousRowBackgroundColor !== Config.CLUSTER_TABLE_SELECTED_ROW_COLOR) {
            domStyle.set(node, "backgroundColor", "#eee");
        }
        currentNode = node;
    }

    function clusterRowMouseLeaveHandler(event) {
        var node = event.target.parentNode;
        var backgroundColor = domStyle.get(node, "backgroundColor");
        if (backgroundColor !== Config.CLUSTER_TABLE_SELECTED_ROW_COLOR) {
            previousNode = node;
            domStyle.set(currentNode, "backgroundColor", previousRowBackgroundColor);
        }

        clearTimeout(clusterTableMouseTimer);
        if (esriLang.isDefined(chartPopupData)) {
            if (esriLang.isDefined(dom.byId("clusterTablePopup"))) {
                domConstruct.destroy("clusterTablePopup");
            }
        }
    }

    function clusterRowMouseClickHandler(event) {
        // show table loader
        userInterfaceUtils.showTableLoader(".summary-table-loader", true);
        // currently selected row
        var currentSelectedRow = event.target.parentNode;
        // reset table row styles
        var clusterTableRows = tableUtils.getAllTableRows(".cluster-table");
        tableUtils.resetAllTableRowStyles(clusterTableRows);

        if (previouslySelectedRow) {
            domStyle.set(previouslySelectedRow, "border", "1px solid gainsboro");
        }
        domStyle.set(currentSelectedRow, "border", Config.CLUSTER_TABLE_SELECTED_ROW_COLOR);
        previouslySelectedRow = currentSelectedRow;

        // selected cluster ID and UnitBottom
        sharingUtils.selectedClusterID = previouslySelectedRow.cells[0].innerText;
        sharingUtils.selectedUnitTop = previouslySelectedRow.cells[1].innerText;
        var seriesName = sharingUtils.selectedClusterID + "_" + sharingUtils.selectedUnitTop;
        // update url params
        sharingUtils.updateAllUrlParams(selectedVariable, selectedMapPoint);
        //
        updateLineSeries(linesSeries, seriesName);
        // update summary table
        updateSummaryTable(sharingUtils.selectedClusterID);
        // update oceans polygon layer
        updateOceansPolygons(sharingUtils.selectedClusterID);
    }

    function clusterRowMouseMoveHandler(event) {
        if (esriLang.isDefined(dom.byId("clusterTablePopup"))) {
            domConstruct.destroy("clusterTablePopup");
        }
        clearTimeout(clusterTableMouseTimer);
        clusterTableMouseTimer = setTimeout(function () {
            clusterTableMouseStopped(event);
        }, 300);
    }


    function updateOceansPolygons(selectedClusterID) {
        oceansFill.setDefinitionExpression(Config.Cluster37 + " = " + selectedClusterID);
        oceansBorder.setDefinitionExpression(Config.Cluster37 + " = " + selectedClusterID);
    }

    function updateSummaryTable(selectedClusterID) {
        var q = new Query();
        q.where = Config.Cluster37 + " = " + selectedClusterID;
        q.outSpatialReference = {
            wkid: 102100
        };
        q.returnGeometry = false;
        q.outFields = ["*"];
        summaryQT.execute(q, function (results) {
            userInterfaceUtils.updateSummaryTable(results.features[0].attributes);
        });
    }

    function clearPlotSeries(seriesName) {
        var series = chartUtils.chart.getSeriesOrder(seriesName);
        array.forEach(series, function (seriesName) {
            chartUtils.chart.removeSeries(seriesName);
        });
    }

    function updateLineSeries(linesSeries, seriesName) {
        // clear the plot
        clearPlotSeries("linesPlot");
        // add the new plot
        array.forEach(linesSeries, function (currentSeries, i) {
            if (seriesName === currentSeries.seriesName) {
                // top line
                if (i === linesSeries.length - 1) {
                    chartUtils.chart.addSeries("sea-level", linesSeries[linesSeries.length - 1].seriesData, Config.CHART_LINES_SEIRES_TOP);
                } else {
                    chartUtils.chart.addSeries(linesSeries[i + 1].seriesName, linesSeries[i + 1].seriesData, Config.CHART_LINES_SEIRES_TOP);
                }
                // bottom line
                chartUtils.chart.addSeries(seriesName, currentSeries.seriesData, Config.CHART_LINES_SEIRES_BOTTOM);
                chartUtils.chart.render();
                userInterfaceUtils.formatChartXaxisTitle();
            }
        });
    }

    function mouseStopped(evt) {
        // vs is an object that is the size of the viewport
        vs = win.getBox();
        windowWidth = vs.w;
        windowHeight = vs.h;
        // mouse coordinates
        var clientX = evt.clientX,
            clientY = evt.clientY;

        clientX = clientX - 225;

        if (clientY < 240) {
            clientY = clientY - 50;
        } else {
            clientY = clientY - 220;
        }

        if (esriLang.isDefined(chartPopupData)) {
            if (esriLang.isDefined(dom.byId("chartPopup"))) {
                domConstruct.destroy("chartPopup");
            } else {
                var tooltip = lang.replace(Config.CHART_TOOLTIP, {
                    "x_px": clientX,
                    "y_px": clientY,
                    "id": chartPopupData.Cluster37,
                    "temp": userInterfaceUtils.formatSummaryDataItem(chartPopupData.temp),
                    "salinity": userInterfaceUtils.formatSummaryDataItem(chartPopupData.salinity),
                    "dissO2": userInterfaceUtils.formatSummaryDataItem(chartPopupData.dissO2),
                    "nitrate": userInterfaceUtils.formatSummaryDataItem(chartPopupData.nitrate),
                    "phosphate": userInterfaceUtils.formatSummaryDataItem(chartPopupData.phosphate),
                    "silicate": userInterfaceUtils.formatSummaryDataItem(chartPopupData.silicate)
                });
                domConstruct.place(tooltip, "anchor", "last");
            }
        }
    }

    function clusterTableMouseStopped(event) {
        var unitTop = currentNode.children[1].innerText,
            clusterData = woaPointsMergedStore.query({
                "UnitTop": unitTop
            }),
            cluterTableData = woaPointsMergedStore.query({
                "Cluster37": clusterData[0][Config.Cluster37],
                "UnitTop": clusterData[0]["UnitTop"]
            })[0],
            clientX = event.clientX,
            clientY = event.clientY;

        clientX = clientX - 225;
        clientY = clientY - 220;

        if (esriLang.isDefined(cluterTableData)) {
            if (esriLang.isDefined(dom.byId("clusterTablePopup"))) {
                domConstruct.destroy("clusterTablePopup");
            } else {
                var tooltip = lang.replace(Config.TABLE_TOOLTIP, {
                    "x_px": clientX,
                    "y_px": clientY,
                    "id": clusterData[0][Config.Cluster37],
                    "temp": userInterfaceUtils.formatSummaryDataItem(cluterTableData.temp),
                    "salinity": userInterfaceUtils.formatSummaryDataItem(cluterTableData.salinity),
                    "dissO2": userInterfaceUtils.formatSummaryDataItem(cluterTableData.dissO2),
                    "nitrate": userInterfaceUtils.formatSummaryDataItem(cluterTableData.nitrate),
                    "phosphate": userInterfaceUtils.formatSummaryDataItem(cluterTableData.phosphate),
                    "silicate": userInterfaceUtils.formatSummaryDataItem(cluterTableData.silicate)
                });
                domConstruct.place(tooltip, "anchor", "last");
            }
        }
    }

    function appHeaderThumbnailClickHandler(event) {
        var splashScreenVisible = domStyle.get(query(".splash-screen")[0], "display");
        if (splashScreenVisible === "block") {
            if (esriLang.isDefined(selectedMapPoint)) {
                userInterfaceUtils.toggleSplashScreenView(false);
                domStyle.set(dom.byId("chart"), "display", "block");
                domStyle.set(dom.byId("clusterTable"), "display", "block");
            }
        } else {
            userInterfaceUtils.toggleSplashScreenView(true);
            domStyle.set(dom.byId("chart"), "display", "none");
            domStyle.set(dom.byId("clusterTable"), "display", "none");
        }
    }

    function setQueryDistance() {
        var currentLevel = map.getLevel();
        switch (currentLevel) {
            case 1:
                queryUtils.queryParams.distance = 20;
                break;
            case 2:
                queryUtils.queryParams.distance = 20;
                break;
            case 3:
                queryUtils.queryParams.distance = 15;
                break;
            case 4:
                queryUtils.queryParams.distance = 15;
                break;
            case 5:
                queryUtils.queryParams.distance = 10;
                break;
            case 6:
                queryUtils.queryParams.distance = 10;
                break;
            case 7:
                queryUtils.queryParams.distance = 5;
                break;
            case 8:
                queryUtils.queryParams.distance = 5;
                break;
            default:
                queryUtils.queryParams.distance = 5;
        }
    }
})
;