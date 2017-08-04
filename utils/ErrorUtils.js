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
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "esri/lang",
    "esri/request",
    "config/config"
], function (Dialog, declare, lang, dom, on, query, esriLang, esriRequest, Config) {

    return declare(null, {

        constructor: function () {

        },

        createMapErrorHandler: function (error) {
            console.debug("createMap failed: ", error);
        },

        serviceLoadErrorHandler: function (error) {
            var map = error.target._map;
            map.setLevel(10);
            
            //query(".error-modal")[0].click();
        }
    });
});