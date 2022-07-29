import "./index.scss";
import * as UIManager from "../../utils/UIManager";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import Graphic from "@arcgis/core/Graphic";

const overviewGraphic = new Graphic({
    "geometry": null,
    "symbol": {
        "type": "simple-fill",
        "color": [0, 0, 0, 0.5],
        "outline": {
            "color": "white",
            "width": 1
        }
    }
});

export function initOverviewMap(sceneView, mapView) {
    const overviewMapContainer = document.querySelector(".overview-map-container");
    UIManager.removeClass(overviewMapContainer, "hide");

    const overviewMap = new Map({
        "basemap": "satellite"
    });
    const overviewScene = new SceneView({
        "container": "overviewMap",
        "map": overviewMap,
        "constraints": {
            "snapToZoom": false,
            "tilt": {
                "max": 0.0
            },
            "altitude": {
                "min": 15000000,
                "max": 15000000
            }
        },
        "alphaCompositingEnabled": true,
        "environment": {
            "background": {
                "type": "color",
                "color": [0, 0, 0, 0]
            },
            // disable stars
            "starsEnabled": false,
            //disable atmosphere
            "atmosphereEnabled": false
        },
        "ui": {
            "components": []
        },
        "center": sceneView.center
    });
    overviewScene.when(() => {
        sceneView.when(() => {
            initOverviewMap();
        });
    });
    function initOverviewMap() {
        overviewGraphic.geometry = sceneView.extent;
        overviewScene.graphics.add(overviewGraphic);

        overviewScene.on("key-down", (event) => {
            const prohibitedKeys = ["+", "-", "Shift", "_", "="];
            const keyPressed = event.key;
            if (prohibitedKeys.indexOf(keyPressed) !== -1) {
                event.stopPropagation();
            }
        });

        overviewScene.on("mouse-wheel", (event) => {
            event.stopPropagation();
        });

        overviewScene.on("double-click", (event) => {
            event.stopPropagation();
        });

        overviewScene.on("double-click", ["Control"], (event) => {
            event.stopPropagation();
        });

        overviewScene.on("drag", (event) => {
            event.stopPropagation();
        });

        overviewScene.on("drag", ["Shift"], (event) => {
            event.stopPropagation();
        });

        overviewScene.on("drag", ["Shift", "Control"], (event) => {
            event.stopPropagation();
        });

        const views = [mapView, sceneView, overviewScene];
        let active;
        const sync = (source) => {
            if (!active || !active.viewpoint || active !== source) {
                return;
            }

            for (const view of views) {
                if (view !== active) {
                    view.viewpoint = active.viewpoint;
                    overviewGraphic.geometry = active.extent;
                    overviewScene.scale = overviewScene.scale * 50;
                }
            }
        };

        for (const view of views) {
            view.watch(["interacting", "animation"], () => {
                active = view;
                sync(active);
            });
            view.watch("viewpoint", () => sync(view));
        }
    }
}
