import React, { FC, useEffect, useRef } from 'react';
import IMapView from 'esri/views/MapView';
import ISceneView from 'esri/views/SceneView';
import IGraphic from 'esri/Graphic';
import { useSelector } from 'react-redux';
import { selectQueryLocation } from '../../store/EMU/selectors';
import { loadModules } from 'esri-loader';

import MarkerImage from '../../static/img/marker.png';

type Props = {
    sceneView?: ISceneView;
    mapView?: IMapView;
};

const HighlightGraphic: FC<Props> = ({ sceneView, mapView }: Props) => {
    const queryLocation = useSelector(selectQueryLocation);

    const graphic = useRef<IGraphic>();

    const showQueryLocation = async () => {
        type Modules = [typeof IGraphic];

        try {
            const [Graphic] = await (loadModules(['esri/Graphic']) as Promise<
                Modules
            >);

            const view = mapView || sceneView;

            const { latitude, longitude } = queryLocation;

            const symbol = sceneView
                ? {
                      type: 'point-3d',
                      symbolLayers: [
                          {
                              type: 'object',
                              width: 2000,
                              height: 2000000,
                              resource: {
                                  primitive: 'cylinder',
                              },
                              material: {
                                  color: 'rgba(255,255,255,0.75)',
                              },
                          },
                      ],
                  }
                : ({
                      type: 'picture-marker',
                      url: MarkerImage,
                      width: '32px',
                      height: '32px',
                  } as any);

            graphic.current = new Graphic({
                geometry: {
                    type: 'point',
                    latitude,
                    longitude,
                } as any,
                symbol,
            });

            view.graphics.add(graphic.current);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!mapView && !sceneView) {
            return;
        }

        const view = mapView || sceneView;

        if (view) {
            if (graphic.current) {
                view.graphics.remove(graphic.current);
            }

            if (queryLocation) {
                showQueryLocation();
            }
        }
    }, [mapView, sceneView, queryLocation]);

    return null;
};

export default HighlightGraphic;
