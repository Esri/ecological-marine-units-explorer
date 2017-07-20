define([
    "dojo/_base/declare",
    // charting
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
    // config
    "config/config"
], function (declare,
             Tooltip, Grid, Lines, Markers, Chart, Default, Stacked, StackedAreas, StackedColumns, SimpleTheme, StoreSeries, MarkersOnly, dgf,
             Config) {

    return declare(null, {

        chart: null,

        constructor: function () {
            this.chart = null;
        },

        /**
         * create chart and apply theme to chart markers
         *
         * @param id
         */
        createChart: function (id) {
            this.chart = new Chart(id).setTheme(new SimpleTheme({
                markers: Config.markerTheme,
                chart: Config.chartTheme,
                axis: Config.axisTheme
            }));
        },

        /**
         * add lines plot
         */
        addLinesPlot: function () {
            this.chart.addPlot("linesPlot", {
                type: Lines
            });
        },

        /**
         * add stacked columns plot (clusters)
         */
        addStackedColumnsPlot:function () {
            this.chart.addPlot("stackedColumnsPlot", {
                type: StackedColumns,
                lines: false,
                areas: false,
                markers: false
            });
        },

        /**
         * add markers plot
         */
        addMarkersPlot:function () {
            this.chart.addPlot(Config.TEMP_PLOT, {
                type: MarkersOnly,
                markers: true,
                stroke: {
                    width: 0
                }
            });
        },

        addMutliVariableSelectionMarkersPlot:function () {
            this.chart.addPlot(Config.SALINITY_PLOT, {
                type: MarkersOnly,
                hAxis: "temperature x",
                markers: true,
                stroke: {
                    width: 0
                }
            });
        }
    });
});