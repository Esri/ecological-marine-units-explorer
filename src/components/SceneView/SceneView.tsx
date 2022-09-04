import React, { useRef } from 'react';

import { loadModules } from 'esri-loader';
import ISceneView from 'esri/views/SceneView';
import IWebScene from 'esri/WebScene';
import { ViewPointInfo } from '../../store/Map/reducer';

interface Props {
    webSceneId: string;
    viewpointInfo?: ViewPointInfo;
    children?: React.ReactNode;
}

const SceneView: React.FC<Props> = ({
    webSceneId,
    viewpointInfo,
    children,
}: Props) => {
    const sceneDivRef = React.useRef<HTMLDivElement>();

    // need to save scene view in this ref so it can be destroyed when switching to 2d view
    const sceneViewRef = useRef<ISceneView>();

    const [sceneView, setSceneView] = React.useState<ISceneView>(null);

    const initMapView = async () => {
        type Modules = [typeof ISceneView, typeof IWebScene];

        try {
            const [SceneView, WebScene] = await (loadModules([
                'esri/views/SceneView',
                'esri/WebScene',
            ]) as Promise<Modules>);

            const sceneViewProps = {
                container: sceneDivRef.current,
                map: new WebScene({
                    portalItem: {
                        id: webSceneId,
                    },
                }),
                ui: {
                    components: [],
                },
                popup: null,
                environment: {
                    lighting: 'virtual',
                },
            } as __esri.SceneViewProperties;

            let shouldTiltCameraManually = false;

            if (viewpointInfo) {
                const {
                    rotation,
                    scale,
                    targetGeometry,
                    camera,
                } = viewpointInfo;

                const viewpointProps = {
                    rotation,
                    scale,
                    targetGeometry: {
                        type: 'point',
                        ...targetGeometry,
                    },
                } as any;

                if (camera) {
                    const { heading, tilt, position } = camera;

                    viewpointProps.camera = {
                        heading,
                        tilt,
                        position: {
                            type: 'point',
                            ...position,
                        },
                    };
                } else {
                    // camera data is not provided so by default the camera will be looking at the scene from the top at 90 degree,
                    // which is less ideal and we'd like to tune the tilt manually to make it look better
                    shouldTiltCameraManually = true;
                }

                sceneViewProps.viewpoint = viewpointProps;
            }

            const view = new SceneView(sceneViewProps);

            view.when(() => {
                setSceneView(view);
                sceneViewRef.current = view;

                // let's use the 45 degree angle
                if (shouldTiltCameraManually) {
                    view.goTo({
                        tilt: 45,
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        initMapView();

        return () => {
            sceneViewRef.current.destroy();
        };
    }, []);

    return (
        <>
            <div
                className="absolute top-12 md:top-0 left-0 w-full h-full"
                ref={sceneDivRef}
            ></div>
            {sceneView
                ? React.Children.map(children, (child) => {
                      return React.cloneElement(
                          child as React.ReactElement<any>,
                          {
                              sceneView,
                          }
                      );
                  })
                : null}
        </>
    );
};

export default SceneView;
