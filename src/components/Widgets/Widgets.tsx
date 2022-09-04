import React, { FC, useEffect } from 'react';
import ISceneView from 'esri/views/SceneView';
import IMapView from 'esri/views/MapView';
import IZoom from 'esri/widgets/Zoom';
import INavigationToggle from 'esri/widgets/NavigationToggle';
import ICompass from 'esri/widgets/Compass';
import { loadModules } from 'esri-loader';

type Props = {
    sceneView?: ISceneView;
    mapView?: IMapView;
};

const Widgets: FC<Props> = ({ sceneView, mapView }: Props) => {
    const initWidgets = async () => {
        type Modules = [
            typeof IZoom,
            typeof INavigationToggle,
            typeof ICompass
        ];

        // console.log('init widgets');

        try {
            const [Zoom, NavigationToggle, Compass] = await (loadModules([
                'esri/widgets/Zoom',
                'esri/widgets/NavigationToggle',
                'esri/widgets/Compass',
            ]) as Promise<Modules>);

            const view = sceneView || mapView;

            const zoom = new Zoom({
                view: view,
            });

            view.ui.add(zoom, 'top-right');

            const navToggle = new NavigationToggle({
                view: view,
            });

            view.ui.add(navToggle, 'top-right');

            // only show compass in 2D view
            if (mapView !== undefined) {
                const compass = new Compass({
                    view: view,
                });

                view.ui.add(compass, 'top-right');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (sceneView || mapView) {
            initWidgets();
        }
    }, [sceneView, mapView]);

    return null;
};

export default Widgets;
