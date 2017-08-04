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
    "esri/lang",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/on",
    "dojo/query",
    "dijit/registry",
    "dijit/_OnDijitClickMixin",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetBase",
    "config/config"
], function (esriLang, array, declare, lang, domConstruct, domStyle, on, query, registry, _OnDijitClickMixin, _TemplatedMixin, _WidgetBase, Config) {

    var TableUtils = declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {

        declaredClass: "TableUtils",

        id: "",
        content: "",

        /**
         * Your constructor method will be called before the parameters are mixed into the widget, and can be used to
         * initialize arrays, etc.
         *
         * This is when attributes in the markup (ex: <button iconClass=...>) are mixed in or, if you are instantiating
         * directly, the properties object you passed into the constructor (ex: new dijit.form.Button({label: “hi”})).
         * This step itself is not overridable, but you can play with the result in...
         *
         * @param params
         */
        constructor: function (params, srcNodeRef) {
            //this.id = params.id;
            /*this.title = params.title;
             this.portalItem = params.portalItem;
             this.currentDate = params.currentDate;
             this.message = params.message;
             this.userEmail = params.userEmail;*/
            /*this.content = */
        },

        /**
         * If you provide a postMixInProperties method for your widget, it will be invoked before rendering occurs, and
         * before any dom nodes are created. If you need to add or change the instance’s properties before the widget is
         * rendered - this is the place to do it.
         */
        postMixInProperties: function () {
            console.log("postMixInProperties");
        },

        /**
         * dijit._Templated provides an implementation of buildRendering that most times will do what you need. The
         * template is fetched/read, nodes created and events hooked up during buildRendering. The end result is
         * assigned to this.domNode. If you don’t mixin dijit._Templated (and most OOTB dijits do) and want to handle
         * rendering yourself (e.g. to really streamline a simple widget, or even use a different templating system)
         * this is where you’d do it.
         */
        buildRendering: function () {
            console.log("buildRendering");
        },

        /**
         * This is typically the workhorse of a custom widget. The widget has been rendered (but note that child widgets
         * in the containerNode have not!). The widget though may not be attached to the DOM yet so you shouldn’t do
         * any sizing calculations in this method.
         */
        postCreate: function () {
            console.log("postCreate");
        },

        /**
         * If you need to be sure parsing and creation of any child widgets has completed, use startup. This is often
         * used for layout widgets like BorderContainer. If the widget does JS sizing, then startup() should call
         * resize(), which does the sizing.
         */
        startup: function () {
            console.log("startup");
            return '<div class="row">' +
                '   <div class="column-24">' +
                '       <div class="summary-table-loader">' +
                '           <div style="color: #ef9f64" class="la-ball-clip-rotate"><div>' +
                '       </div>' +
                '   </div>' +
                '</div>' +

                '<div class="row variance-table">' +
                '   <div class="column-17 variance-table-content">' +
                '       <div class="column-2">' +
                '           <div id="selectedClusterIdLabel" class="variance-table-row-header">EMU:</div>' +
                '           <div id="selectedClusterCountLabel" class="variance-table-row-header">Volume:</div>' +
                '       </div>' +
                '       <div class="column-1 variance-column">' +
                '           <div id="selectedClusterId" class="variance-table-row-content"></div>' +
                '           <div id="selectedClusterCount" class="variance-table-row-content"></div>' +
                '       </div>' +
                '       <div class="column-21 variance-column">' +
                '           <div id="fullName" class="variance-table-row-content"></div>' +
                '       </div>' +
                '       <div class="column-24">' +
                '           <table class="summary-table">' +
                '               <thead>' +
                '                   <th class="custom-cell-style hide-cell-value-style"><div class="column-header summary-table-column-header" style="color:transparent; border-bottom:transparent;">QtrDegreeID</div></th>' +
                '                   <th><div id="tempColHdr" class="column-header summary-table-column-header">Temperature</div></th>' +
                '                   <th><div id="salColHdr"  class="column-header summary-table-column-header">Salinity</div></th>' +
                '                   <th><div id="doColHdr"  class="column-header summary-table-column-header">Dissolved O<sub>2</sub></div></th>' +
                '                   <th><div id="nitColHdr"  class="column-header summary-table-column-header">Nitrate</div></th>' +
                '                   <th><div id="phoColHdr"  class="column-header summary-table-column-header">Phosphate</div></th>' +
                '                   <th><div id="silColHdr"  class="column-header summary-table-column-header">Silicate</div></th>' +
                '                   <th><div id="thickColHdr"  class="column-header summary-table-column-header">Thickness</div></th>' +
                '                   <th><div id="unitColHdr"  class="column-header summary-table-column-header">Depth</div></th>' +
                '               </tr>' +
                '           </thead>' +
                '           <tbody class="align-center">' +
                '               <tr>' +
                '                   <td class="row-header">Minimum</td>' +
                '                   <td id="tempMin" class="summary-table-cell"></td>' +
                '                   <td id="salinityMin" class="summary-table-cell"></td>' +
                '                   <td id="dissO2Min" class="summary-table-cell"></td>' +
                '                   <td id="nitrateMin" class="summary-table-cell"></td>' +
                '                   <td id="phosphateMin" class="summary-table-cell"></td>' +
                '                   <td id="silicateMin" class="summary-table-cell"></td>' +
                '                   <td id="thicknessMin" class="summary-table-cell"></td>' +
                '                   <td id="unitBottomMin" class="summary-table-cell"></td>' +
                '               </tr>' +
                '               <tr>' +
                '                   <td class="row-header">Maximum</td>' +
                '                   <td id="tempMax" class="summary-table-cell"></td>' +
                '                   <td id="salinityMax" class="summary-table-cell"></td>' +
                '                   <td id="dissO2Max" class="summary-table-cell"></td>' +
                '                   <td id="nitrateMax" class="summary-table-cell"></td>' +
                '                   <td id="phosphateMax" class="summary-table-cell"></td>' +
                '                   <td id="silicateMax" class="summary-table-cell"></td>' +
                '                   <td id="thicknessMax" class="summary-table-cell"></td>' +
                '                   <td id="unitBottomMax" class="summary-table-cell"></td>' +
                '               </tr>' +
                '               <tr>' +
                '                   <td class="row-header">Average</td>' +
                '                   <td id="tempAvg" class="summary-table-cell"></td>' +
                '                   <td id="salinityAvg" class="summary-table-cell"></td>' +
                '                   <td id="dissO2Avg" class="summary-table-cell"></td>' +
                '                   <td id="nitrateAvg" class="summary-table-cell"></td>' +
                '                   <td id="phosphateAvg" class="summary-table-cell"></td>' +
                '                   <td id="silicateAvg" class="summary-table-cell"></td>' +
                '                   <td id="thicknessAvg" class="summary-table-cell"></td>' +
                '                   <td id="unitBottomAvg" class="summary-table-cell"></td>' +
                '               </tr>' +
                '               <tr>' +
                '                   <td class="row-header">SD</td>' +
                '                   <td id="tempSTD" class="summary-table-cell"></td>' +
                '                   <td id="salinitySTD" class="summary-table-cell"></td>' +
                '                   <td id="dissO2STD" class="summary-table-cell"></td>' +
                '                   <td id="nitrateSTD" class="summary-table-cell"></td>' +
                '                   <td id="phosphateSTD" class="summary-table-cell"></td>' +
                '                   <td id="silicateSTD" class="summary-table-cell"></td>' +
                '                   <td id="thicknessSTD" class="summary-table-cell"></td>' +
                '                   <td id="unitBottomSTD" class="summary-table-cell"></td>' +
                '               </tr>' +
                '           </tbody>' +
                '       </table>' +

                '   </div>' +
                '       </div>' +
                '       <div class="column-6 pre-1 cluster-table-container">' +
                '           <div id="clusterTable"></div>' +
                '       </div>' +
                '   </div>';
        },

        createTableColumnHeaders: function (anchorNode) {
            return domConstruct.create('table', {
                class: 'cluster-table',
                innerHTML: '<thead>' +
                '   <tr>' +
                '       <td><div class="column-header">EMU</div></td>' +
                '       <td><div class="column-header">Depth (m)</div></td>' +
                '       <td><div class="column-header">Thickness (m)</div></td>' +
                '   </tr>' +
                '</thead>'
            }, anchorNode, 'first');
        },

        getAllTableRows: function (tableNode) {
            return query(tableNode)[0].children
        },

        getTableFirstRow: function (tableNode) {
            return query(tableNode)[0].children[1];
        },

        resetAllTableRowStyles: function (tableRows) {
            array.forEach(tableRows, function (clusterTableRow, i) {
                if (i > 0) {
                    domStyle.set(clusterTableRow, "border", "1px solid gainsboro");
                }
            });
        }
    });
    return TableUtils;
});