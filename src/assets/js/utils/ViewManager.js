import config from "../config.json";
import Graphic from "@arcgis/core/Graphic";
import WebMap from "@arcgis/core/WebMap";
import WebScene from "@arcgis/core/WebScene";

export const webMap = new WebMap({
    "portalItem": {
        "id": "e1b754ca501a4e9cb86b164e561f4a54"
    }
});

export const webScene = new WebScene({
    "portalItem": {
        "id": "81cb447e822f4ad890eb5b98cf3a23a9"
    }
});

export function updateGraphic(geom, views) {
    if (geom) {
        views.forEach(view => {
            removeGraphics(view);
            _addGraphic(geom, view);
        });
    }
}

export function removeGraphics(view) {
    let viewGraphics = view.graphics;
    if (viewGraphics.length > 0) {
        viewGraphics.forEach(graphic => {
            if (graphic.attributes.name === "Selected Point") {
                viewGraphics.remove(graphic)
            }
        });
    }
}

export function clearHighlightGraphics(inputArr) {
    if (inputArr.length > 0) {
        inputArr.forEach((highlightObject) => {
            highlightObject.remove();
        });
        inputArr = [];
    }
}

function _addGraphic(geom, view) {
    let viewGraphics = view.graphics;
    const symbolType = (view.type === "2d") ? {
        type: config.TWO_DIMENSIONAL_SYMBOL_TYPE,
        size: config.TWO_DIMENSIONAL_SYMBOL_SIZE,
        color: config.TWO_DIMENSIONAL_SYMBOL_COLOR,
        outline: null
    } : {
        type: config.THREE_DIMENSIONAL_SYMBOL_TYPE,
        symbolLayers: config.THREE_DIMENSIONAL_SYMBOL_LAYERS
    };
    let graphic = new Graphic({
        geometry: geom,
        symbol: symbolType,
        attributes: {
            name: "Selected Point"
        }
    });
    viewGraphics.add(graphic);
}
