import React, { useRef } from 'react';

import { loadModules, loadCss } from 'esri-loader';
import IMapView from 'esri/views/MapView';
import IWebMap from 'esri/WebMap';
import { ViewPointInfo } from '../../store/Map/reducer';

interface Props {
    webmapId: string;
    viewpointInfo?: ViewPointInfo;
    children?: React.ReactNode;
}

const MapView: React.FC<Props> = ({
    webmapId,
    viewpointInfo,
    children,
}: Props) => {
    const mapDivRef = React.useRef<HTMLDivElement>();

    // need to save map view in this ref so it can be destroyed when switching to 3d view
    const mapViewRef = useRef<IMapView>();

    const [mapView, setMapView] = React.useState<IMapView>(null);

    const initMapView = async () => {
        type Modules = [typeof IMapView, typeof IWebMap];

        try {
            const [MapView, WebMap] = await (loadModules([
                'esri/views/MapView',
                'esri/WebMap',
            ]) as Promise<Modules>);

            const view = new MapView({
                container: mapDivRef.current,
                map: new WebMap({
                    portalItem: {
                        id: webmapId,
                    },
                }),
                constraints: {
                    snapToZoom: false,
                },
                ui: {
                    components: [],
                },
                popup: null,
                scale: viewpointInfo?.scale || undefined,
                center: viewpointInfo?.targetGeometry
                    ? ({
                          type: 'point',
                          x: viewpointInfo.targetGeometry.x,
                          y: viewpointInfo.targetGeometry.y,
                          spatialReference:
                              viewpointInfo.targetGeometry.spatialReference,
                      } as any)
                    : undefined,
            });

            view.when(() => {
                setMapView(view);

                mapViewRef.current = view;
            });
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        initMapView();

        return () => {
            mapViewRef.current.destroy();
        };
    }, []);

    return (
        <>
            <div
                className="absolute top-12 md:top-0 left-0 bottom-0 w-full"
                ref={mapDivRef}
            ></div>
            {mapView
                ? React.Children.map(children, (child) => {
                      return React.cloneElement(
                          child as React.ReactElement<any>,
                          {
                              mapView,
                          }
                      );
                  })
                : null}
        </>
    );
};

export default MapView;
