/*global define,location */
/*jslint sloppy:true */
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
define({

    // NOTES: http://esrioceans.maps.arcgis.com/apps/MapJournal/?appid=dc88bfd8cc2d4467ab67700c9cb7b42a

    portal: {},
    portalUser: {},
    curator: {},
    curatorList: [],
    curatorStore: {},
    groupsStore: {},

    // Sharing URL
    "SHARING_COMMUNITY_URL": "www.arcgis.com/sharing/rest/community/users/",

    //Defaults to arcgis.com. Set this value to your portal or organization host name.
    "SHARING_HOST": "https://www.arcgis.com",

    // Specify the domain where the map associated with the webmap id is located.
    "ARCGIS_URL": "www.arcgis.com/sharing/rest/content/items",

    "FORWARD_SLASH": "/",
    "FORWARD_SLASHES": "//",

    "NO_USER_PROFILE_THUMBNAIL_IMAGE": "images/no-user-thumb.jpg",

    // Services
    //
    //
    // This is a cached tiled service of the EMU Top Most (Ocean Surface) Points from the Point Mesh.  The points are
    // categorized into different clusters and colors accordingly to cluster characteristics.
    //

    "TOP_UNIT": window.location.protocol + "//utility.arcgis.com/usrsvcs/servers/d2db1dbd6d2742a38fe69506029b83ac/rest/services/EMU_Ocean_Surface/MapServer", // OLD
    //"TOP_UNIT": window.location.protocol + "//utility.arcgis.com/usrsvcs/servers/22aff33b56dc4231bb48ea4c79b94cf2/rest/services/EMU_Ocean_Surface/MapServer", // NEW *

    "WOAPointsWest_FEATURE_SERVICE_URL": window.location.protocol + "//utility.arcgis.com/usrsvcs/servers/82cff671f6fd4c88905454899ce015c2/rest/services/EMU_Point_Mesh/MapServer/0",   // OLD
    //"WOAPointsWest_FEATURE_SERVICE_URL": window.location.protocol + "//utility.arcgis.com/usrsvcs/servers/7a00654299b64c9b9b9cbb96d2a549f8/rest/services/EMU_Point_Mesh/MapServer/0",   // NEW *

    "SEARCH_DIJIT_DEFAULT_PLACEHOLDER": "Find a place",

    OBJECTID: "OBJECTID",
    pointid: "pointid",
    temp: "temp",
    salinity: "salinity",
    appO2ut: "appO2ut",
    dissO2: "dissO2",
    nitrate: "nitrate",
    percO2sat: "percO2sat",
    phosphate: "phosphate",
    silicate: "silicate",
    srtm30: "srtm30",
    depth_lvl: "depth_lvl",
    Cluster37: "Cluster37",
    QtrDegreeID: "QtrDegreeID",
    UnitBottom: "UnitBottom",
    UnitTop: "UnitTop",
    ThicknessNeg: "ThicknessNeg",
    ThicknessPos: "ThicknessPos",
    Distance_to_Cluster_Seed: "Distance_to_Cluster_Seed",
    InTolerance: "InTolerance",

    // This service consists of more than 52 million points that are at a quarter of a degree horizontal spacing and
    // variable spacing through the water column down to 5,500 meters.  All points are populated with attributes from
    // NOAA’s World Ocean Atlas.  Surface points are populated with attributes from NASA’s Ocean Color – Chlorophyll A,
    // Modis Aqua Data that is a compilation of 14 years of Monthly Chlorophyll A Averages.
    //
    "WOAPointsClusterWest_FEATURE_SERVICE_URL": window.location.protocol + "//utility.arcgis.com/usrsvcs/servers/dbb13dad900d4014b0611358602723dd/rest/services/EMU_Point_Mesh_Cluster/MapServer/0",    // OLD
    //"WOAPointsClusterWest_FEATURE_SERVICE_URL": window.location.protocol + "//utility.arcgis.com/usrsvcs/servers/8861be8cf3004dddb85c466d631d1250/rest/services/EMU_Point_Mesh_Cluster/MapServer/0",    // NEW *

    Fullname: "Fullname",

    //ClusterSummary_FEATURE_SERVICE_URL: window.location.protocol + "//services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/EMU_Summary_Table/FeatureServer/0",            // OLD
    ClusterSummary_FEATURE_SERVICE_URL: window.location.protocol + "//services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/EMUSummaryGlobal_v5/FeatureServer/0",            // NEW same

    //ClusterPolygons_FEATURE_SERVICE_URL: window.location.protocol + "//services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/EMU_Cluster_Polygon/FeatureServer/0",            // OLD
    ClusterPolygons_FEATURE_SERVICE_URL: window.location.protocol + "//services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/EMU_Cluster_Polygon_v2/FeatureServer/0",            // NEW same

    // ?
    TOP_DEPTH: "Top_depth",

    // App ID (Production)
    APP_ID: "PYFVIdQB6B7VBZyD",
    // webmap ID
    WEBMAP_ID: "07d86180e9104bfea6bafe7e120b02da",

    /* Map */
    MAP_OPTIONS: {
        mapOptions: {
            slider: true,
            nav: false
        }
    },

    /* Chart parameters */
    // x-axis
    CHART_X_AXIS: {
        title: "Temperature (&#8451;)",
        titleOrientation: "away",
        horizontal: true
    },

    // y-axis
    CHART_Y_AXIS: {
        title: "Depth (m)",
        minorLabels: true,
        vertical: true,
        fixUpper: "none",
        fixLower: "none"
    },

    // Lines plot
    CHART_LINES_SEIRES_TOP: {
        plot: "linesPlot",
        stroke: {
            color: "rgb(235, 235, 0)",
            width: 2
        }
    },

    CHART_LINES_SEIRES_BOTTOM: {
        plot: "linesPlot",
        stroke: {
            color: "rgb(235, 235, 0)",
            width: 2
        }
    },

    // PLOT NAMES
    "TEMP_PLOT": "markersPlot",
    "SALINITY_PLOT": "salinityMarkersPlot",

    // Markers plot
    CHART_MARKER_SERIES_TEMPERATURE: {
        plot: "markersPlot",
        stroke: {
            width: "0"
        },
        fill: "red",
        width: "1"
    },

    CHART_MARKER_SERIES_SALINITY: {
        plot: "salinityMarkersPlot",
        stroke: {
            width: "0"
        },
        fill: "yellow",
        width: "1"
    },

    /* Chart theme(s) */
    markerTheme: {
        CIRCLE: "m-3,0 c0,-4 6,-4 6,0, m-6,0 c0,4 6,4 6,0"
    },

    chartTheme: {
        fill: "#1b314d"
    },

    axisTheme: {
        stroke: { // the axis itself
            color: "#333",
            width: 1
        },
        tick: { // used as a foundation for all ticks
            color: "#b3d5ff",
            position: "center",
            font: "normal normal normal 7pt Tahoma",   // labels on axis
            fontColor: "#b3d5ff"                               // color of labels
        },
        majorTick: { // major ticks on axis, and used for major gridlines
            width: 1,
            length: 6
        },
        minorTick: { // minor ticks on axis, and used for minor gridlines
            width: 0.8,
            length: 3
        },
        microTick: { // minor ticks on axis, and used for minor gridlines
            width: 0.5,
            length: 1
        },
        title: {
            gap: 15,
            font: "normal normal normal 11pt Tahoma",   // title font
            fontColor: "#b3d5ff",                          // title font color
            orientation: "axis"                     // "axis": facing the axis, "away": facing away
        }
    },

    OCEANS_LAYER_OPACITY: 0.45,

    // depth
    CLUSTERS: [{
        stroke: {
            width: 0
        },
        id: 0,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 1,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 2,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 3,
        fill: "#708cd9"
    }, {
        stroke: {
            width: 0
        },
        id: 4,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 5,
        fill: "#a0d7d1"
    }, {
        stroke: {
            width: 0
        },
        id: 6,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 7,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 8,
        fill: "#ccb0ba"
    }, {
        stroke: {
            width: 0
        },
        id: 9,
        fill: "#c5b6d0"
    }, {
        stroke: {
            width: 0
        },
        id: 10,
        fill: "#7570e6"
    }, {
        stroke: {
            width: 0
        },
        id: 11,
        fill: "#cabfd9"
    }, {
        stroke: {
            width: 0
        },
        id: 12,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 13,
        fill: "#364799"
    }, {
        stroke: {
            width: 0
        },
        id: 14,
        fill: "#465290"
    }, {
        stroke: {
            width: 0
        },
        id: 15,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 16,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 17,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 18,
        fill: "#eb96cc"
    }, {
        stroke: {
            width: 0
        },
        id: 19,
        fill: "#b9caf6"
    }, {
        stroke: {
            width: 0
        },
        id: 20,
        fill: "#E1E1E1"
    }, {
        id: 21,
        stroke: {
            width: 0
        },
        fill: "#ebbccd"
    }, {
        stroke: {
            width: 0
        },
        id: 22,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 23,
        fill: "#a0d7d1"
    }, {
        stroke: {
            width: 0
        },
        id: 24,
        fill: "#eba9d4"
    }, {
        stroke: {
            width: 0
        },
        id: 25,
        fill: "#a0d7d1"
    }, {
        stroke: {
            width: 0
        },
        id: 26,
        fill: "#9365e6"
    }, {
        stroke: {
            width: 0
        },
        id: 27,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 28,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 29,
        fill: "#4792c9"
    }, {
        stroke: {
            width: 0
        },
        id: 30,
        fill: "#b4d7e7"
    }, {
        stroke: {
            width: 0
        },
        id: 31,
        fill: "#9ad4e6"
    }, {
        stroke: {
            width: 0
        },
        id: 32,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 33,
        fill: "#7591ff"
    }, {
        stroke: {
            width: 0
        },
        id: 34,
        fill: "#E1E1E1"
    }, {
        stroke: {
            width: 0
        },
        id: 35,
        fill: "#9edbff"
    }, {
        stroke: {
            width: 0
        },
        id: 36,
        fill: "#1a52aa"
    }, {
        stroke: {
            width: 0
        },
        id: 37,
        fill: "#4792c9"
    }],

    CLUSTER_TABLE_SELECTED_ROW_COLOR: "3px solid rgb(235, 235, 0)",

    "TABLE_ID_VALUES": [
        "tempMin", "tempMax", "tempAvg", "tempSTD",
        "salinityMin", "salinityMax", "salinityAvg", "salinitySTD",
        "dissO2Min", "dissO2Max", "dissO2Avg", "dissO2STD",
        "nitrateMin", "nitrateMax", "nitrateAvg", "nitrateSTD",
        "phosphateMin", "phosphateMax", "phosphateAvg", "phosphateSTD",
        "silicateMin", "silicateMax", "silicateAvg", "silicateSTD",
        "thicknessMin", "thicknessMax", "thicknessAvg", "thicknessSTD",
        "unitBottomMin", "unitBottomMax", "unitBottomAvg", "unitBottomSTD"],

    // Temperature
    // Salinity
    // Dissolved Oxygen
    // Percent Oxygen Saturation
    // Apparent Oxygen Saturation
    // Silicate
    // Phosphate
    // Nitrate
    "UNITS": ["&#8451;", "", "ml/l", "&mu;mol/l", "&mu;mol/l", "&mu;mol/l", "m", "m"],

    "COL_HDR_NODE_IDS": ["tempColHdr", "salColHdr", "doColHdr", "nitColHdr", "phoColHdr", "silColHdr", "thickColHdr", "unitColHdr"],

    "SPLASH_SCREEN_TITLE": "Welcome to the Ecological Marine Unit (EMU) Explorer!",

    "SPLASH_SCREEN_INSTRUCTIONS_A": "Clicking on the map will display information about ecological marine units based on a clustering analysis " +
    "that was preformed against <a class='instructions-link' href='https://www.nodc.noaa.gov/OC5/woa13/' target='_blank'>NOAA’s World Ocean Atlas Data</a>.  The interactive map allows you to zoom and pan and interact with the data by " +
    "clicking on the map.  Clicking the points on the map enables you to explore the depth (vertical) profile and associated oceanographic " +
    "information for the selected location.",

    "SPLASH_SCREEN_INSTRUCTIONS_B": "Please explore this fascinating ocean dataset and discover the (statistically) different clusters and what makes each one of them unique.",

    "SPLASH_SCREEN_INSTRUCTIONS_C": "<a class='instructions-link' href='https://blogs.esri.com/esri/esri-insider/2016/03/14/new-map-sets-framework-for-describing-ocean-ecology-in-unprecedented-detail/' target='_blank'>More Info</a>",

    "PROFILES": [{
        "label": "Temperature Profile",
        "value": "temp"
    }, {
        "label": "Dissolved O<sub>2</sub> Profile",
        "value": "dissO2"
    }, {
        "label": "Phosphate Profile",
        "value": "phosphate"
    }, {
        "label": "Nitrate Profile",
        "value": "nitrate"
    }, {
        "label": "Salinity Profile",
        "value": "salinity"
    }, {
        "label": "Silicate Profile",
        "value": "silicate"
    }, {
        "label": "Apparent O<sub>2</sub> Utilization Profile",
        "value": "appO2ut"
    }, {
        "label": "% O<sub>2</sub> Saturation Profile",
        "value": "percO2sat"
    }, {
        "label": "<span class='temp-symbol'></span> " +
        "<span class='temperature-profile-label'> Temperature / </span> " +
        "<span class='salinity-symbol'></span>" +
        "<span class='salinity-profile-label'> Salinity Profile </span>",
        "value": "temp-salinity"
    }],

    "MAP_CONTENT_PANE" : "<div id='search'></div><div id='map'></div>",

    "PROFILE_DROP_DOWN": '<div class="dropdown-navigation dropdown-wrapper variable-dropdown-content-wrapper">' +
    '       <a href="#" class="dropdown dropdown-profiles">Temperature Profile</a>' +
    '       <div class="dropdown-content variable-dropdown-content">' +
    '           <div class="dropdown-menu">' +
    '               <ul>' +
    '                   <li><a data-value="temp" class="variable-dropdown-list">Temperature Profile</a></li>' +
    '                   <li><a data-value="dissO2" class="variable-dropdown-list">Dissolved O<sub>2</sub> Profile</a></li>' +
    '                   <li><a data-value="phosphate" class="variable-dropdown-list">Phosphate Profile</a></li>' +
    '                   <li><a data-value="nitrate" class="variable-dropdown-list">Nitrate Profile</a></li>' +
    '                   <li><a data-value="salinity" class="variable-dropdown-list">Salinity Profile</a></li>' +
    '                   <li><a data-value="silicate" class="variable-dropdown-list">Silicate Profile</a></li>' +
    '                   <li><a data-value="appO2ut" class="variable-dropdown-list">Apparent O<sub>2</sub> Utilization Profile</a></li>' +
    '                   <li><a data-value="percO2sat" class="variable-dropdown-list">% O<sub>2</sub> Saturation Profile</a></li>' +
    '                   <li><hr /></li>' +
    '                   <li>' +
    '                       <a data-value="temp-salinity" class="variable-dropdown-list">' +
    '                           <span class="temp-symbol"></span>' +
    '                           <span class="temperature-profile-label"> Temperature / </span>' +
    '                           <span class="salinity-symbol"></span>' +
    '                           <span class="salinity-profile-label"> Salinity Profile </span>' +
    '                       </a>' +
    '                   </li>' +
    '               </ul>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '   <div id="chart"></div>' +
    '   <div class="loader loading-overlay">' +
    '       <span class="side side-left"><span class="fill"></span></span>' +
    '       <span class="side side-right"><span class="fill"></span></span>' +
    '       <p class="loading-word">Loading...</p>' +
    '   </div>' +
    '   <div class="overlay">' +
    '       <div class="no-data-available-msg">No data available</div>' +
    '   </div>',

    "CHART_TOOLTIP": "<div id='chartPopup' class='row' style='left:{x_px}px; top:{y_px}px;'>" +
    "   <div class='column-24'>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Ecological Marine Unit</div>" +
    "           <div class='column-5 cluster-id-chart-popup-value chart-tooltip-style'>{id}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'></div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Temperature</div>" +
    "           <div class='column-5 temp-chart-popup-value chart-tooltip-style'>{temp}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &#8451;</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Salinity</div>" +
    "           <div class='column-5 salinity-chart-popup-value chart-tooltip-style'>{salinity}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'></div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Dissolved O<sub>2</sub></div>" +
    "           <div class='column-5 dissolved-chart-popup-value chart-tooltip-style'>{dissO2}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> ml/l</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Nitrite</div>" +
    "           <div class='column-5 nitrite-chart-popup-value chart-tooltip-style'>{nitrate}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &mu;mol/l</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Phosphate</div>" +
    "           <div class='column-5 phosphate-chart-popup-value chart-tooltip-style'>{phosphate}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &mu;mol/l</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Silicate</div>" +
    "           <div class='column-5 silicate-chart-popup-value chart-tooltip-style'>{silicate}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &mu;mol/l</div>" +
    "       </div>" +
    "   </div>" +
    "</div>",

    "TABLE_TOOLTIP": "<div id='clusterTablePopup' class='row' style='left:{x_px}px; top:{y_px}px;'>" +
    "   <div class='column-24'>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Ecological Marine Unit</div>" +
    "           <div class='column-5 cluster-id-chart-popup-value chart-tooltip-style'>{id}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'></div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Temperature</div>" +
    "           <div class='column-5 temp-chart-popup-value chart-tooltip-style'>{temp}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &#8451;</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Salinity</div>" +
    "           <div class='column-5 salinity-chart-popup-value chart-tooltip-style'>{salinity}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'></div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Dissolved O<sub>2</sub></div>" +
    "           <div class='column-5 dissolved-chart-popup-value chart-tooltip-style'>{dissO2}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> ml/l</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Nitrite</div>" +
    "           <div class='column-5 nitrite-chart-popup-value chart-tooltip-style'>{nitrate}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &mu;mol/l</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Phosphate</div>" +
    "           <div class='column-5 phosphate-chart-popup-value chart-tooltip-style'>{phosphate}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &mu;mol/l</div>" +
    "       </div>" +
    "       <div class='row'>" +
    "           <div class='column-15 row-label'>Silicate</div>" +
    "           <div class='column-5 silicate-chart-popup-value chart-tooltip-style'>{silicate}</div>" +
    "           <div class='column-4 chart-tooltip-unit-style'> &mu;mol/l</div>" +
    "       </div>" +
    "   </div>" +
    "</div>",

    "SPLASH_SCREEN" : '<div class="splash-screen" style="width:{chartContentPaneWidth}px">' +
    '   <div class="row">' +
    '       <div class="column-24">' +
    '           <div class="splash-screen-title">Welcome to the Ecological Marine Unit (EMU) Explorer!</div>' +
    '       </div>' +
    '   </div>' +
    '   <div class="row">' +
    '       <div class="column-24">' +
    '           <img class="splash-screen-image" src="images/splash-screen.png">' +
    '       </div>' +
    '   </div>' +
    '   <div class="row">' +
    '       <div class="column-24">' +
    '           <div class="splash-screen-instructions instructions-a">Clicking on the map will display information about ecological marine units based on a clustering analysis that was preformed against <a class="instructions-link" href="https://www.nodc.noaa.gov/OC5/woa13/" target="_blank">NOAAs World Ocean Atlas Data</a>.  The interactive map allows you to zoom and pan and interact with the data by clicking on the map.  Clicking the points on the map enables you to explore the depth (vertical) profile and associated oceanographic information for the selected location.</div>' +
    '           <div class="splash-screen-instructions instructions-b">Please explore this fascinating ocean dataset and discover the (statistically) different clusters and what makes each one of them unique.</div>' +
    '           <div class="splash-screen-instructions instructions-a"><a class="instructions-link" href="https://blogs.esri.com/esri/esri-insider/2016/03/14/new-map-sets-framework-for-describing-ocean-ecology-in-unprecedented-detail/" target="_blank">More Info</a></div>' +
    '       </div>' +
    '   </div>' +
    '</div>'

});
