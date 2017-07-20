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