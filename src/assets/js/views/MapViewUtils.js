import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import config from "../config.json";
import TileLayer from "@arcgis/core/layers/TileLayer";
import WebMap from "@arcgis/core/WebMap";

const OCEANS_BORDER_LAYER = new FeatureLayer(config.OCEANS_BORDER);
const OCEANS_FILL_LAYER = new FeatureLayer(config.OCEANS_FILL);
const OCEANS_SURFACE_LAYER = new TileLayer(config.OCEANS_SURFACE);

export const webMap = new WebMap({
    "portalItem": {
        "id": config.WEBMAP_ITEM_ID
    },
    "layers": [OCEANS_FILL_LAYER, OCEANS_BORDER_LAYER, OCEANS_SURFACE_LAYER]
});
