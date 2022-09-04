import React, { FC, useEffect, useRef } from 'react';
import ISceneView from 'esri/views/SceneView';
import ISceneLayer from 'esri/layers/SceneLayer';
import { loadModules } from 'esri-loader';
import { EMU_2018_CHANGE_LAYER_ID_3D } from './config';

type Props = {
    sceneView?: ISceneView;
    visible?: boolean;
};

const EMUChangeLayer3D: FC<Props> = ({ sceneView, visible }: Props) => {
    const layerRef = useRef<ISceneLayer>();

    const init = async () => {
        type Modules = [typeof ISceneLayer];

        try {
            const [SceneLayer] = await (loadModules([
                'esri/layers/SceneLayer',
            ]) as Promise<Modules>);

            const layer = new SceneLayer({
                portalItem: {
                    id: EMU_2018_CHANGE_LAYER_ID_3D,
                },
                visible,
                popupEnabled: false,
            });

            layerRef.current = layer;

            sceneView.map.add(layer);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (sceneView) {
            init();
        }
    }, [sceneView]);

    useEffect(() => {
        if (sceneView && layerRef.current) {
            layerRef.current.visible = visible;
        }
    }, [visible]);

    return null;
};

export default EMUChangeLayer3D;
