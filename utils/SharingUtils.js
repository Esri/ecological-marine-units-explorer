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
    "dijit/Dialog",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Deferred",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/query",
    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/lang",
    "esri/request",
    "esri/SpatialReference",
    "esri/urlUtils",
    "config/config"
], function (Dialog, declare, lang, Deferred, dom, domStyle, on, query, Extent, Point, esriLang, esriRequest, SpatialReference, urlUtils, Config) {

    return declare(null, {

        HOST_NAME : null,
        PATH_NAME : null,
        urlParams: null,
        currentMapExtent: null,
        selectedMapPoint: null,
        selectedClusterID: null,
        selectedUnitTop: null,

        constructor: function () {
            this.HOST_NAME = null;
            this.PATH_NAME = null;
            this.urlParams = {};
            this.currentMapExtent = {};
            this.selectedMapPoint = {};
            this.selectedClusterID = null;
            this.selectedUnitTop = null;
        },

        /**
         * Get the URL parameters
         *
         * @returns {*}
         */
        getUrlParams: function () {
            // default state
            // http://cmahlke_mac.esri.com/emu/index.html
            //
            // extent changed
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-11684475.109884154&xmin=-14306570.928178143&ymax=4795352.470464459&ymin=3139420.689694841
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-12903798.585088963&xmin=-15156550.682709077&ymax=4577659.813908336&ymin=3112514.8557384666
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-205467.95013257815&xmin=-2458220.0477526938&ymax=7301264.005765011&ymin=5836119.047595142
            //
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-11684475.109884154&xmin=-14306570.928178143&ymax=4795352.470464459&ymin=3139420.689694841&x=-13726872.50566352&y=3518548.349989214
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-11684475.109884154&xmin=-14306570.928178143&ymax=4795352.470464459&ymin=3139420.689694841&x=-13726872.50566352&y=3518548.349989214&var=silicate
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-865883.8745163253&xmin=-3118635.9721364407&ymax=7479820.903839135&ymin=6014675.945669266&x=-1626585.1800101972&y=6467183.153117389&var=temp
            //
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-13131275.181265585&xmin=-15384027.2788857&ymax=4856502.093092583&ymin=3391357.1349227144&x=-14371389.528163955&y=3772930.7801222126&var=silicate
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-13515294.811370207&xmin=-15768046.908990322&ymax=4584997.768623709&ymin=3119852.810453841&x=-14371389.528163955&y=3772930.7801222126&var=temp
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=-865883.8745163251&xmin=-3118635.9721364407&ymax=7479820.903839135&ymin=6014675.945669266&x=-1626585.1800101972&y=6467183.153117389&var=temp
            // http://cmahlke_mac.esri.com/emu/index.html?xmax=7130040.780337265&xmin=4877288.68271715&ymax=1900529.3352490338&ymin=435384.37707916496&x=6418259.172945892&y=873215.6750965383&var=dissO2
            //
            // http://192.168.0.4/emu/index.html?xmax=-12907467.562446633&xmin=-15245829.131746123&ymax=5064410.8100282075&ymin=3513656.380178964&x=-14230745.396119252&y=4345291.24792146&var=temp&clusterID=4&unitBottom=-250
            var deferred = new Deferred();
            this.urlParams = urlUtils.urlToObject(window.location.href);
            if (esriLang.isDefined(this.urlParams)) {
                deferred.resolve(this.urlParams);
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        },

        updateMapExtent: function (urlParams) {
            var deferred = new Deferred();
            if (esriLang.isDefined(urlParams.query)) {
                var extent = new Extent(
                    Number(urlParams.query.xmin),
                    Number(urlParams.query.ymin),
                    Number(urlParams.query.xmax),
                    Number(urlParams.query.ymax), new SpatialReference({
                        wkid: 102100
                    }));
                deferred.resolve(extent);
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        },

        updateSelectedPoint: function (urlParams) {
            var deferred = new Deferred();
            if (esriLang.isDefined(urlParams.query.x)) {
                var selectedMapPoint = new Point(Number(urlParams.query.x), Number(urlParams.query.y), new SpatialReference({
                    wkid: 102100
                }));
                deferred.resolve(selectedMapPoint);
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        },

        updateSelectedVariable: function (urlParams) {
            var deferred = new Deferred();
            if (esriLang.isDefined(urlParams.query.var)) {
                var selectedVariable = urlParams.query.var;
                deferred.resolve(selectedVariable);
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        },

        updateSelectedClusterID: function (urlParams) {
            var deferred = new Deferred();
            if (esriLang.isDefined(urlParams.query.clusterID)) {
                /*console.debug("urlParams.query.clusterID", urlParams.query.clusterID);
                console.debug("urlParams.query.unitTop", urlParams.query.unitTop);*/
                var selectedCluster = {
                    "clusterID": urlParams.query.clusterID,
                    "unitTop": urlParams.query.unitTop
                };
                console.debug("selectedCluster", selectedCluster);
                deferred.resolve(selectedCluster);
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        },

        /**
         * Update the url params for the extent
         */
        updateUrlExtentParams: function () {
            window.history.pushState("object or string", "Title",
                "?xmax=" + this.currentMapExtent.xmax +
                "&xmin=" + this.currentMapExtent.xmin +
                "&ymax=" + this.currentMapExtent.ymax +
                "&ymin=" + this.currentMapExtent.ymin);
        },

        updateUrlExtentAndSelMapPointParams: function (_selectedMapPoint) {
            if (esriLang.isDefined(_selectedMapPoint)) {
                window.history.pushState("object or string", "Title",
                    "?xmax=" + this.currentMapExtent.xmax +
                    "&xmin=" + this.currentMapExtent.xmin +
                    "&ymax=" + this.currentMapExtent.ymax +
                    "&ymin=" + this.currentMapExtent.ymin +
                    "&x=" + Number(_selectedMapPoint.x) +
                    "&y=" + Number(_selectedMapPoint.y));
            }
        },

        updateUrlExtentAndSelMapPointAndSelVarParams: function (_selectedVariable, _selectedMapPoint) {
            if (esriLang.isDefined(_selectedVariable) && esriLang.isDefined(_selectedMapPoint)) {
                window.history.pushState("object or string", "Title",
                    "?xmax=" + this.currentMapExtent.xmax +
                    "&xmin=" + this.currentMapExtent.xmin +
                    "&ymax=" + this.currentMapExtent.ymax +
                    "&ymin=" + this.currentMapExtent.ymin +
                    "&x=" + Number(_selectedMapPoint.x) +
                    "&y=" + Number(_selectedMapPoint.y) +
                    "&var=" + _selectedVariable);
            }
        },

        updateAllUrlParams: function (_selectedVariable, _selectedMapPoint) {
            if (esriLang.isDefined(_selectedVariable) && esriLang.isDefined(_selectedMapPoint)) {
                console.debug("this.selectedUnitTop", this.selectedUnitTop);
                window.history.pushState("object or string", "Title",
                    "?xmax=" + this.currentMapExtent.xmax +
                    "&xmin=" + this.currentMapExtent.xmin +
                    "&ymax=" + this.currentMapExtent.ymax +
                    "&ymin=" + this.currentMapExtent.ymin +
                    "&x=" + Number(_selectedMapPoint.x) +
                    "&y=" + Number(_selectedMapPoint.y) +
                    "&var=" + _selectedVariable +
                    "&clusterID=" + this.selectedClusterID +
                    "&unitTop=" + this.selectedUnitTop);
            }
        }
    });
});