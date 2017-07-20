define([
    "esri/lang",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "dojo/_base/array",
    "dojo/_base/declare",
    "config/config"
], function (esriLang, Query, QueryTask, array, declare, Config) {

    return declare(null, {

        queryParams: null,

        constructor: function () {
            this.queryParams = new Query();
            this.queryParams.distance = 20;
            this.queryParams.orderByFields = ["QtrDegreeID"];
            this.queryParams.units = "miles";
            this.queryParams.returnGeometry = true;
            this.queryParams.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
            this.queryParams.outSpatialReference = {
                wkid: 102100
            };
            this.queryParams.outFields = ["*"];
        }
    });
});