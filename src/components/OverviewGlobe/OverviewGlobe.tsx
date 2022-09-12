import React, { useRef } from 'react';

import { loadModules } from 'esri-loader';
import ISceneView from 'esri/views/SceneView';
import IMap from 'esri/Map';
import IViewpoint from 'esri/Viewpoint';
import IGraphic from 'esri/Graphic';
import { selectViewExtent, selectViewpoint } from '../../store/Map/selectors';

import { ViewExtent } from '../../store/Map/reducer';

import { useSelector } from 'react-redux';

const SIZE = 150;
const SHADOW_SIZE = SIZE * 0.8;

const OverviewGlobe = () => {
    const viewpoint = useSelector(selectViewpoint);

    const viewExtent = useSelector(selectViewExtent);

    const sceneDivRef = React.useRef<HTMLDivElement>();

    const sceneViewRef = useRef<ISceneView>();

    const init = async () => {
        type Modules = [typeof ISceneView, typeof IMap];

        try {
            const [SceneView, Map] = await (loadModules([
                'esri/views/SceneView',
                'esri/Map',
            ]) as Promise<Modules>);

            sceneViewRef.current = new SceneView({
                container: sceneDivRef.current,
                map: new Map({
                    basemap: 'satellite',
                }),
                ui: {
                    components: [],
                },
                popup: null,
                constraints: {
                    tilt: {
                        max: 0.0,
                    },
                    altitude: {
                        min: 15000000,
                        max: 15000000,
                    },
                },
                alphaCompositingEnabled: true,
                environment: {
                    background: {
                        type: 'color',
                        color: [0, 0, 0, 0],
                    },
                    // disable stars
                    starsEnabled: false,
                    //disable atmosphere
                    atmosphereEnabled: false,
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    const updateViewPoint = async (extent: ViewExtent) => {
        type Modules = [typeof IViewpoint, typeof IGraphic];

        try {
            const [Viewpoint, Graphic] = await (loadModules([
                'esri/Viewpoint',
                'esri/Graphic',
            ]) as Promise<Modules>);

            const { rotation, scale, targetGeometry } = viewpoint;

            const viewpointProps = {
                rotation,
                scale,
                targetGeometry: {
                    type: 'point',
                    ...targetGeometry,
                },
            } as any;

            sceneViewRef.current.viewpoint = new Viewpoint({
                ...viewpointProps,
            });

            // show extent in overview scene
            if (extent) {
                sceneViewRef.current.graphics.removeAll();

                const extentGraphic = new Graphic({
                    geometry: {
                        type: 'extent',
                        ...extent,
                    },
                    symbol: {
                        type: 'simple-fill',
                        color: [0, 0, 0, 0.5],
                        outline: {
                            color: 'white',
                            width: 1,
                        },
                    },
                } as any);

                sceneViewRef.current.graphics.add(extentGraphic);
            }
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        init();

        return () => {
            sceneViewRef.current.destroy();
        };
    }, []);

    React.useEffect(() => {
        if (viewpoint && sceneViewRef.current) {
            updateViewPoint(viewExtent);
        }
    }, [viewpoint, viewExtent]);

    return (
        <div
            className="absolute pointer-events-none hidden md:block"
            style={{
                top: '.5rem',
                right: '3rem',
                width: SIZE,
                height: SIZE,
                zIndex: 1,
                opacity: viewpoint ? 1 : 0,
            }}
        >
            <div className="h-full w-full" ref={sceneDivRef}></div>

            {/* overview map shadow */}
            <div
                className="absolute rounded-full"
                style={{
                    width: SHADOW_SIZE,
                    height: SHADOW_SIZE / 4,
                    right: (SIZE - SHADOW_SIZE) / 2,
                    top: SHADOW_SIZE + 10,
                    background:
                        'radial-gradient(50% 50%, rgba(0, 0, 0, 0.7490196078) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
            ></div>
        </div>
    );
};

export default OverviewGlobe;
