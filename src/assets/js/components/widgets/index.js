import Zoom from "@arcgis/core/widgets/Zoom";
import NavigationToggle from "@arcgis/core/widgets/NavigationToggle";
import Compass from "@arcgis/core/widgets/Compass";

/**
 *
 * @param sceneView
 * @param mapView
 */
export function initWidgets(mapView, sceneView) {
    // load the widgets for the 2D/3D views
    loadWidgets(mapView, [{
        "component": new Zoom({
            "view": mapView
        }),
        "position": "top-right"
    }, {
        "component": new Compass({
            "view": mapView
        }),
        "position": "top-right"
    }]);

    loadWidgets(sceneView, [{
        "component": new Zoom({
            "view": sceneView
        }),
        "position": "top-right"
    }, {
        "component": new NavigationToggle({
            "view": sceneView
        }),
        "position": "top-right"
    }, {
        "component": new Compass({
            "view": sceneView
        }),
        "position": "top-right"
    }]);
}

/**
 *
 * @param targetView
 * @param widgets
 */
function loadWidgets(targetView, ...widgets) {
    targetView.ui.add(widgets);
}
