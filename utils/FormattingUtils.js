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
define([
    "esri/arcgis/utils",
    "esri/lang",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/date/locale",
    "dojo/Deferred",
    "dojo/dom-construct",
    "dojo/number",
    "config/config"
], function (arcgisUtils, esriLang, array, declare, lang, locale, Deferred, domConstruct, number, Config) {

    return declare(null, {


        constructor: function () {

        },

        formatDate: function (date) {
            return locale.format(date, {
                selector: "date",
                datePattern: "MMMM d, yyyy"
            });
        },

        formatNumViews: function (value) {
            return number.format(value);
        },

        formatValue: function (feature, selectedVariable) {
            var selectedVariableValue = feature.attributes[selectedVariable];
            var percentO2 = Math.round(feature.attributes[Config.percO2sat]);
            // round out percent O2
            if (selectedVariable === Config.percO2sat) {
                if (esriLang.isDefined(selectedVariableValue)) {
                    selectedVariableValue = Math.round(selectedVariableValue);
                    if (selectedVariableValue > 100) {
                        selectedVariableValue = 100;
                    }

                    if (percentO2 > 100) {
                        percentO2 = 100;
                    }
                }
            }

            return {
                "id": feature.attributes[Config.OBJECTID],
                "QtrDegreeID": feature.attributes[Config.QtrDegreeID],
                "x": selectedVariableValue,
                "y": feature.attributes[Config.UnitTop],
                "temp": feature.attributes[Config.temp],
                "appO2ut": feature.attributes[Config.appO2ut],
                "dissO2": feature.attributes[Config.dissO2],
                "PercO2sat": percentO2,
                "Phosphate": feature.attributes[Config.phosphate],
                "nitrate": feature.attributes[Config.nitrate],
                "salinity": feature.attributes[Config.salinity],
                "Silicate": feature.attributes[Config.silicate],
                "Cluster37": feature.attributes[Config.Cluster37],
                "Top_depth": feature.attributes[Config.TOP_DEPTH],
                "Thickness": feature.attributes[Config.ThicknessNeg],
                "ThicknessPlus": feature.attributes[Config.ThicknessPos]
            }
        },

        cleanJSON: function (feature) {
            return {
                "x": 0,
                "y": feature.attributes[Config.UnitTop],
                "id": feature.attributes[Config.OBJECTID],
                "pointid": feature.attributes[Config.pointid],
                "temp": feature.attributes[Config.temp],
                "salinity": feature.attributes[Config.salinity],
                "appO2ut": feature.attributes[Config.appO2ut],
                "dissO2": feature.attributes[Config.dissO2],
                "nitrate": feature.attributes[Config.nitrate],
                "percO2sat": feature.attributes[Config.percO2sat],
                "phosphate": feature.attributes[Config.phosphate],
                "silicate": feature.attributes[Config.silicate],
                "srtm30": feature.attributes[Config.srtm30],
                "depth_lvl": feature.attributes[Config.depth_lvl],
                "Cluster37": feature.attributes[Config.Cluster37],
                "QtrDegreeID": feature.attributes[Config.QtrDegreeID],
                "UnitBottom": feature.attributes[Config.UnitBottom],
                "UnitTop" : feature.attributes[Config.UnitTop],
                "ThicknessNeg": feature.attributes[Config.ThicknessNeg],
                "ThicknessPlus": feature.attributes[Config.ThicknessPos],
                "Distance_to_Cluster_Seed": feature.attributes[Config.Distance_to_Cluster_Seed],
                "InTolerance" : feature.attributes[Config.InTolerance],
                "Fullname" : feature.attributes[Config.Fullname]
            };
        },

        getMinValue: function (arr) {
            return _.first(arr);
        },

        getMaxValue: function (arr) {
            return _.last(arr);
        },

        formatSummaryDataItem: function (obj) {
            if (esriLang.isDefined(obj)) {
                return obj.toFixed(2);
            } else {
                return "";
            }
        },

        formatWholeNumberLabel:function (obj) {
            if (esriLang.isDefined(obj)) {
                return obj.toFixed(0);
            } else {
                return "";
            }
        }
    });
});