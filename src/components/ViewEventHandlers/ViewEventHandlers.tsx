import React, { FC, useEffect } from 'react';
import ISceneView from 'esri/views/SceneView';
import IMapView from 'esri/views/MapView';
import IReactiveUtils from 'esri/core/reactiveUtils';
import { loadModules } from 'esri-loader';
import IViewpoint from 'esri/Viewpoint';
import IPoint from 'esri/geometry/Point';
import { ViewExtent } from '../../store/Map/reducer';

type Props = {
    sceneView?: ISceneView;
    mapView?: IMapView;
    viewpointOnChange?: (viewpoint: IViewpoint, extent: ViewExtent) => void;
    onClickHandler?: (mapPoint: IPoint, zoomLevel: number) => void;
};

const EventHandlers: FC<Props> = ({
    sceneView,
    mapView,
    viewpointOnChange,
    onClickHandler,
}: Props) => {
    const init = async () => {
        const view = sceneView || mapView;

        try {
            type Modules = [typeof IReactiveUtils];

            const [reactiveUtils] = await (loadModules([
                'esri/core/reactiveUtils',
            ]) as Promise<Modules>);

            // Observe for when a boolean property becomes true
            // Equivalent to watchUtils.whenTrue()
            // learn more here: https://developers.arcgis.com/javascript/latest/api-reference/esri-core-reactiveUtils.html#when
            reactiveUtils.when(
                () => view.stationary === true,
                () => {
                    if (viewpointOnChange && view?.viewpoint) {
                        viewpointOnChange(
                            view.viewpoint.toJSON(),
                            view.extent.toJSON()
                        );
                    }
                }
            );

            view.on('click', async (evt) => {
                onClickHandler(evt.mapPoint.toJSON(), view.zoom);
            });

            // the stationary handler only get triggered after first time the user interactive with the view, therefore need to call this manually
            // so the overview map can get synced once the view is ready
            viewpointOnChange(view.viewpoint.toJSON(), view.extent.toJSON());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (sceneView || mapView) {
            init();
        }
    }, [sceneView, mapView]);

    return null;
};

export default EventHandlers;
