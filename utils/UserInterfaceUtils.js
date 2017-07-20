define([
    // Dojo Dijits
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "esri/arcgis/utils",
    "esri/lang",
    // Esri Dijits
    "esri/dijit/OverviewMap",
    "esri/dijit/Search",
    "dijit/_editor/plugins/AlwaysShowToolbar",
    "dijit/Editor",
    "dijit/focus",
    "dijit/form/Textarea",
    "dijit/Tooltip",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/sniff",
    "dojo/date/locale",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/has",
    "dojo/html",
    "dojo/on",
    "dojo/query",
    "utils/FormattingUtils",
    "config/config"
], function (BorderContainer, ContentPane,
             arcgisUtils, esriLang, OverviewMap, Search, AlwaysShowToolbar, Editor, focusUtil, Textarea, Tooltip,
             array, declare, lang, sniff, locale, Deferred, dom, domAttr, domConstruct, domStyle, has, html, on, query,
             FormattingUtils,
             Config) {

    return declare([FormattingUtils], {

        borderContainer: null,
        mapContentPane: null,
        chartContentPane : null,

        constructor: function () {
            this.borderContainer = null;
            this.mapContentPane = null;
            this.chartContentPane = null;
        },

        createBorderContainer: function () {
            this.borderContainer = new BorderContainer({
                class: "main-container",
                gutter: false
            }, "anchor");
            return this.borderContainer;
        },

        createContentPane: function (_class, _region, _content) {
            this.mapContentPane = new ContentPane({
                class: _class,
                region: _region,
                gutter: false,
                content: lang.replace(_content)
            });
            return this.mapContentPane;
        },

        /*updateSignInDropdown: function () {
         query(".authenticated-user")[0].innerText = " " + Config.portalUser.firstName;
         if (esriLang.isDefined(Config.portalUser.thumbnailUrl)) {
         domAttr.set(query(".user-profile-thumbnail-src")[0], "src", Config.portalUser.thumbnailUrl);
         } else {
         domAttr.set(query(".user-profile-thumbnail-src")[0], "src", Config.NO_USER_PROFILE_THUMBNAIL_IMAGE);
         }
         query(".authenticated-user-fullname")[0].innerText = Config.portalUser.fullName;
         query(".authenticated-user-username")[0].innerText = Config.portalUser.username;
         },*/

        /**
         * "Message" overlay
         *
         * @param show
         */
        showOverlay: function (show) {
            if (show) {
                domStyle.set(query(".overlay")[0], "display", "block");
            } else {
                domStyle.set(query(".overlay")[0], "display", "none");
            }
        },

        showLoader: function (show) {
            if (show) {
                domStyle.set(query(".loading-overlay")[0], "display", "block");
            } else {
                domStyle.set(query(".loading-overlay")[0], "display", "none");
            }
        },

        showChart: function (show) {
            if (show) {
                domStyle.set("chart", "display", "block");
            } else {
                domStyle.set("chart", "display", "none");
            }
        },

        addOverviewMap: function (map) {
            var overviewMapDijit = new OverviewMap({
                map: map,
                attachTo: "bottom-left",
                visible: false,
                color: "#D84E13",
                opacity: .40
            });
            overviewMapDijit.startup();
        },

        /**
         * Signout button handler
         *
         * @param evt
         */
        /*signOutBtnClickHandler: function (evt) {
         Config.portal.signOut();
         location.reload();
         },*/

        /**
         * Update the x-axis title based on the selected variable
         *
         * @param selectedVariable
         * Selected variable (label)
         *
         * @returns {string}
         * The x-axis title
         */
        updateChartXAxisTitle: function (selectedVariable) {
            var newLabel = "";
            if (selectedVariable === Config.temp) {
                newLabel = "Temperature (&#8451;)";
            } else if (selectedVariable === Config.appO2ut) {
                newLabel = "Apparent O<sub>2</sub> Utilization";
            } else if (selectedVariable === Config.dissO2) {
                newLabel = "Dissolved O<sub>2</sub>";
            } else if (selectedVariable === Config.nitrate) {
                newLabel = "Nitrate";
            } else if (selectedVariable === Config.percO2sat) {
                newLabel = "% O<sub>2</sub> Saturation";
            } else if (selectedVariable === Config.phosphate) {
                newLabel = "Phosphate";
            } else if (selectedVariable === Config.salinity) {
                newLabel = "Salinity";
            } else if (selectedVariable === Config.silicate) {
                newLabel = "Silicate";
            } else {
                newLabel = "Temperature (&#8451;)";
            }
            return newLabel;
        },

        /**
         * Set the color theme for the clusters
         *
         * @param clusterValue
         * Cluster value (ID)
         *
         * @returns {*}
         */
        setClusterColorTheme: function (clusterValue) {
            return Config.CLUSTERS[clusterValue];
        },

        /**
         * Toggle loading indicators
         *
         * @param target
         * Target node
         *
         * @param show
         * Boolean
         */
        showTableLoader: function (target, show) {
            var node = query(target)[0];
            if (show) {
                domStyle.set(node, "display", "block");
            } else {
                domStyle.set(node, "display", "none");
            }
        },

        /**
         * Update the table
         *
         * @param summariesData
         * Data
         */
        updateSummaryTable: function (summariesData) {
            dom.byId("selectedClusterId").innerHTML = summariesData["Cluster37"];
            dom.byId("fullName").innerHTML = summariesData["EMU_Name"];
            dom.byId("selectedClusterCount").innerHTML = this.formatSummaryDataItem(summariesData["PRCNT_H20"]) + "%";

            dom.byId("tempMin").innerHTML = this.formatSummaryDataItem(summariesData["MIN_temp"]);
            dom.byId("tempMax").innerHTML = this.formatSummaryDataItem(summariesData["MAX_temp"]);
            dom.byId("tempAvg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_temp"]);
            dom.byId("tempSTD").innerHTML = this.formatSummaryDataItem(summariesData["STD_temp"]);

            dom.byId("salinityMin").innerHTML = this.formatSummaryDataItem(summariesData["MIN_salinity"]);
            dom.byId("salinityMax").innerHTML = this.formatSummaryDataItem(summariesData["MAX_salinity"]);
            dom.byId("salinityAvg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_salinity"]);
            dom.byId("salinitySTD").innerHTML = this.formatSummaryDataItem(summariesData["STD_salinity"]);

            dom.byId("dissO2Min").innerHTML = this.formatSummaryDataItem(summariesData["MIN_dissO2"]);
            dom.byId("dissO2Max").innerHTML = this.formatSummaryDataItem(summariesData["MAX_dissO2"]);
            dom.byId("dissO2Avg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_dissO2"]);
            dom.byId("dissO2STD").innerHTML = this.formatSummaryDataItem(summariesData["STD_dissO2"]);

            dom.byId("nitrateMin").innerHTML = this.formatSummaryDataItem(summariesData["MIN_nitrate"]);
            dom.byId("nitrateMax").innerHTML = this.formatSummaryDataItem(summariesData["MAX_nitrate"]);
            dom.byId("nitrateAvg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_nitrate"]);
            dom.byId("nitrateSTD").innerHTML = this.formatSummaryDataItem(summariesData["STD_nitrate"]);

            dom.byId("phosphateMin").innerHTML = this.formatSummaryDataItem(summariesData["MIN_phosphate"]);
            dom.byId("phosphateMax").innerHTML = this.formatSummaryDataItem(summariesData["MAX_phosphate"]);
            dom.byId("phosphateAvg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_phosphate"]);
            dom.byId("phosphateSTD").innerHTML = this.formatSummaryDataItem(summariesData["STD_phosphate"]);

            dom.byId("silicateMin").innerHTML = this.formatSummaryDataItem(summariesData["MIN_silicate"]);
            dom.byId("silicateMax").innerHTML = this.formatSummaryDataItem(summariesData["MAX_silicate"]);
            dom.byId("silicateAvg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_silicate"]);
            dom.byId("silicateSTD").innerHTML = this.formatSummaryDataItem(summariesData["STD_silicate"]);

            dom.byId("thicknessMin").innerHTML = this.formatSummaryDataItem(summariesData["MIN_ThicknessPos"]);
            dom.byId("thicknessMax").innerHTML = this.formatSummaryDataItem(summariesData["MAX_ThicknessPos"]);
            dom.byId("thicknessAvg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_ThicknessPos"]);
            dom.byId("thicknessSTD").innerHTML = this.formatSummaryDataItem(summariesData["STD_ThicknessPos"]);

            dom.byId("unitBottomMin").innerHTML = this.formatSummaryDataItem(summariesData["MIN_UnitTop"]);
            dom.byId("unitBottomMax").innerHTML = this.formatSummaryDataItem(summariesData["MAX_UnitTop"]);
            dom.byId("unitBottomAvg").innerHTML = this.formatSummaryDataItem(summariesData["MEAN_UnitMiddle_m"]);
            dom.byId("unitBottomSTD").innerHTML = this.formatSummaryDataItem(summariesData["STD_UnitTop"]);

            var unit = null,
                j = 0;
            array.forEach(Config.TABLE_ID_VALUES, function (tableID, i) {
                if (i % 4 === 0) {
                    unit = Config.UNITS[j];
                    j++;
                }
                new Tooltip({
                    connectId: [tableID],
                    label: unit,
                    showDelay: 100
                });
            });

            this._generateTableColumnHeaderTooltips();

            this.showTableLoader(".summary-table-loader", false);
        },

        /**
         * Empty the table
         */
        emptyTables: function () {
            // clear summary table(s)
            dom.byId("selectedClusterId").innerHTML = "";
            dom.byId("fullName").innerHTML = "";
            dom.byId("selectedClusterCount").innerHTML = "";

            dom.byId("tempMin").innerHTML = "";
            dom.byId("salinityMin").innerHTML = "";
            dom.byId("dissO2Min").innerHTML = "";
            dom.byId("nitrateMin").innerHTML = "";
            dom.byId("phosphateMin").innerHTML = "";
            dom.byId("silicateMin").innerHTML = "";
            dom.byId("thicknessMin").innerHTML = "";
            dom.byId("unitBottomMin").innerHTML = "";

            dom.byId("tempMax").innerHTML = "";
            dom.byId("salinityMax").innerHTML = "";
            dom.byId("dissO2Max").innerHTML = "";
            dom.byId("nitrateMax").innerHTML = "";
            dom.byId("phosphateMax").innerHTML = "";
            dom.byId("silicateMax").innerHTML = "";
            dom.byId("thicknessMax").innerHTML = "";
            dom.byId("unitBottomMax").innerHTML = "";

            dom.byId("tempAvg").innerHTML = "";
            dom.byId("salinityAvg").innerHTML = "";
            dom.byId("dissO2Avg").innerHTML = "";
            dom.byId("nitrateAvg").innerHTML = "";
            dom.byId("phosphateAvg").innerHTML = "";
            dom.byId("silicateAvg").innerHTML = "";
            dom.byId("thicknessAvg").innerHTML = "";
            dom.byId("unitBottomAvg").innerHTML = "";

            dom.byId("tempSTD").innerHTML = "";
            dom.byId("salinitySTD").innerHTML = "";
            dom.byId("dissO2STD").innerHTML = "";
            dom.byId("nitrateSTD").innerHTML = "";
            dom.byId("phosphateSTD").innerHTML = "";
            dom.byId("silicateSTD").innerHTML = "";
            dom.byId("thicknessSTD").innerHTML = "";
            dom.byId("unitBottomSTD").innerHTML = "";
        },

        formatChartXaxisTitle: function () {
            if (!has("ie")) {
                var xAxisTitleNode = dom.byId("chart").children[dom.byId("chart").children.length - 2].children[0];
                var height = domStyle.get(xAxisTitleNode, "top") - 10;
                domStyle.set(xAxisTitleNode, "top", height + "px");
                domStyle.set(xAxisTitleNode, "font-size", "0.8em");
                domStyle.set(xAxisTitleNode, "font-family", "'Avenir Next W01', 'Avenir Next', 'Avenir', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif");
            }
        },

        dropdownListMouseEnterHandler: function () {
            domStyle.set(query(".variable-dropdown-content")[0], "display", "block");
        },

        dropdownListMouseLeaveHandler: function () {
            domStyle.set(query(".variable-dropdown-content")[0], "display", "none");
        },

        _generateTableColumnHeaderTooltips: function () {
            var unit = null,
                j = 0;
            array.forEach(Config.COL_HDR_NODE_IDS, function (tableID, i) {
                new Tooltip({
                    connectId: [tableID],
                    label: Config.UNITS[i],
                    showDelay: 100
                });
            });

            new Tooltip({
                connectId: ["selectedClusterCountLabel"],
                label: "Percent of total ocean volume for this specific EMU",
                position: ["above"],
                showDelay: 100
            });
        },

        toggleSplashScreenView: function (show) {
            if (show) {
                domStyle.set(query(".splash-screen")[0], "display", "block");
                domStyle.set(query(".variable-dropdown-content-wrapper")[0], "display", "none");
                domStyle.set(dom.byId("clusterTable"), "display", "none");
            } else {
                domStyle.set(query(".splash-screen")[0], "display", "none");
                domStyle.set(query(".variable-dropdown-content-wrapper")[0], "display", "block");
                domStyle.set(dom.byId("clusterTable"), "display", "block");
            }
        },

        createSearch: function (_map) {
            var search = new Search({
                enableButtonMode: true, //this enables the search widget to display as a single button
                enableLabel: false,
                enableHighlight: false,
                enableInfoWindow: false,
                showInfoWindowOnSelect: false,
                map: _map
            }, "search");
            search.startup();
            // update the search icon since Tailcoat is not compatible with this widget
            var searchWidgetIconNode = query(".searchIcon")[3];
            domAttr.set(searchWidgetIconNode, "class", "icon-search");
        }
    });
});