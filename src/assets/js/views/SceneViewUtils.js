import WebScene from "@arcgis/core/WebScene";
import config from "../config.json";

export const webScene = new WebScene({
    "portalItem": {
        "id": config.WEBSCENE_ITEM_ID
    }
});
