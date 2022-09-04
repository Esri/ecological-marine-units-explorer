import React, { FC, useEffect, useRef } from 'react';
import ISceneView from 'esri/views/SceneView';
import ISceneLayer from 'esri/layers/SceneLayer';
import { loadModules } from 'esri-loader';
import { EMU_OPTIMIZED_LAYER_NAME } from './config';
import { useDispatch } from 'react-redux';
import { objectIdOfHighlightedEmuOptimizedFeatureChanged } from '../../store/Map/reducer';

import { selectObjectIdOfHighlightedEmuOptimizedFeature } from '../../store/Map/selectors';

import { useSelector } from 'react-redux';

type Props = {
    sceneView?: ISceneView;
};

const EMU2018OptimizedLayerHighllight: FC<Props> = ({ sceneView }: Props) => {
    const dispatch = useDispatch();

    const objectIdOfHighlightedEmuOptimizedFeature = useSelector(
        selectObjectIdOfHighlightedEmuOptimizedFeature
    );

    const layerViewRef = useRef<__esri.SceneLayerView>();

    const highlight = useRef<__esri.Handle>();

    const reset = () => {
        // Remove the previous highlights
        if (highlight.current) {
            highlight.current.remove();
        }
    };

    const init = async () => {
        // get layer by title
        const layer = sceneView.map.layers.find((item) => {
            return item.title === EMU_OPTIMIZED_LAYER_NAME;
        }) as ISceneLayer;

        if (!layer) {
            return;
        }

        layerViewRef.current = await sceneView.whenLayerView(layer);

        sceneView.on('click', async (evt) => {
            reset();

            try {
                const { results } = await sceneView.hitTest(evt);

                if (!results.length) {
                    return;
                }

                const result = results[0];

                const { graphic } = result;
                const { attributes } = graphic;

                if (attributes && attributes.OBJECTID) {
                    dispatch(
                        objectIdOfHighlightedEmuOptimizedFeatureChanged(
                            attributes.OBJECTID
                        )
                    );
                }
            } catch (err) {
                console.log(err);
            }
        });
    };

    useEffect(() => {
        if (layerViewRef.current) {
            reset();

            highlight.current = layerViewRef.current.highlight(
                objectIdOfHighlightedEmuOptimizedFeature
            );
        }
    }, [objectIdOfHighlightedEmuOptimizedFeature]);

    useEffect(() => {
        if (sceneView) {
            init();
        }
    }, [sceneView]);

    return null;
};

export default EMU2018OptimizedLayerHighllight;
